variable "project_name" {
  type     = string
  nullable = false
}

variable "bundle_id" {
  type     = string
  nullable = false
}

locals {
  secrets = { for tuple in regexall("(.*?)=(.*)", file(".env")) : tuple[0] => sensitive(tuple[1]) }
}

# Terraform configuration to set up providers by version.
terraform {
  required_providers {
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }
}

# Configures the provider to use the resource block's specified project for quota checks.
provider "google-beta" {
  user_project_override = true
}

# Configures the provider to not use the resource block's specified project for quota checks.
# This provider should only be used during project creation and initializing services.
provider "google-beta" {
  alias                 = "no_user_project_override"
  user_project_override = false
}

# Creates a new Google Cloud project.
resource "google_project" "default" {
  provider   = google-beta.no_user_project_override
  name       = var.project_name
  project_id = local.secrets.project_id

  # Associates the project with a Cloud Billing account
  # (required for Firebase Authentication with GCIP).
  billing_account = local.secrets.billing_account

  # Required for the project to display in a list of Firebase projects.
  labels = {
    "firebase" = "enabled"
  }
}

# Enables required APIs.
resource "google_project_service" "default" {
  provider = google-beta.no_user_project_override
  project  = google_project.default.project_id
  for_each = toset([
    "cloudbilling.googleapis.com",
    "cloudresourcemanager.googleapis.com",
    "firebase.googleapis.com",
    "serviceusage.googleapis.com",
    "identitytoolkit.googleapis.com",
    "firestore.googleapis.com",
    "firebaserules.googleapis.com",
    "firebasestorage.googleapis.com",
    "storage.googleapis.com",
  ])
  service = each.key

  # Don't disable the service if the resource block is removed by accident.
  disable_on_destroy = false

  depends_on = [
    google_project.default,
  ]
}

# Creates an Identity Platform config.
# Also enables Firebase Authentication with Identity Platform in the project if not.
resource "google_identity_platform_config" "default" {
  provider = google-beta
  project  = google_project.default.project_id

  # For example, you can configure to auto-delete Anonymous users.
  autodelete_anonymous_users = true

  # Adds more configurations, like for the email/password sign-in provider.
  sign_in {
    allow_duplicate_emails = false

    anonymous {
      enabled = true
    }

    email {
      enabled           = true
      password_required = false
    }
  }

  # Wait for identitytoolkit.googleapis.com to be enabled before initializing Authentication.
  depends_on = [
    google_project_service.default,
  ]
}

# Enable FB SSO
resource "google_identity_platform_default_supported_idp_config" "facebook" {
  provider = google-beta
  project  = google_project.default.project_id

  enabled       = true
  idp_id        = "facebook.com"
  client_id     = local.secrets.fb_app_id
  client_secret = local.secrets.fb_app_secret

  depends_on = [
    google_identity_platform_config.default,
  ]
}

# Enables Firebase services for the new project created above.
resource "google_firebase_project" "default" {
  provider = google-beta
  project  = google_project.default.project_id

  depends_on = [
    google_project_service.default,
  ]
}

module "firestore" {
  source          = "./modules/firestore"
  project_id      = google_project.default.project_id
  rules_file_path = "../firebase/firestore.rules"

  depends_on = [
    google_firebase_project.default,
  ]
}

module "storage" {
  source          = "./modules/storage"
  project_id      = google_project.default.project_id
  rules_file_path = "../firebase/storage.rules"

  depends_on = [
    google_firebase_project.default,
    # Wait for Firestore to be provisioned first.
    # Otherwise, the Firestore instance will be provisioned in Datastore mode (unusable by Firebase).
    module.firestore,

  ]
}

# Creates a Firebase Web App in the new project created above.
resource "google_firebase_web_app" "default" {
  provider        = google-beta
  project         = google_project.default.project_id
  display_name    = "Web App"
  deletion_policy = "DELETE"

  depends_on = [google_firebase_project.default]
}

resource "google_firebase_apple_app" "default" {
  provider        = google-beta
  project         = google_project.default.project_id
  display_name    = "Apple App"
  bundle_id       = var.bundle_id
  deletion_policy = "DELETE"

  depends_on = [google_firebase_project.default]
}

resource "google_firebase_android_app" "default" {
  provider        = google-beta
  project         = google_project.default.project_id
  display_name    = "Android App"
  package_name    = var.bundle_id
  deletion_policy = "DELETE"

  depends_on = [google_firebase_project.default]
}
