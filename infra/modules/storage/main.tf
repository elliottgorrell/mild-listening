
resource "google_storage_bucket" "default" {
  provider                    = google-beta
  name                        = "${var.project_id}-user-uploads"
  location                    = "US"
  project                     = var.project_id
  uniform_bucket_level_access = true
}

resource "google_firebase_storage_bucket" "default" {
  provider  = google-beta
  project   = var.project_id
  bucket_id = google_storage_bucket.default.id
}

# Creates a ruleset of Cloud Storage Security Rules from a local file.
resource "google_firebaserules_ruleset" "default" {
  provider = google-beta
  project  = var.project_id
  source {
    files {
      name    = "storage.rules"
      content = file(var.rules_file_path)
    }
  }

  # Wait for the Cloud Storage bucket to be provisioned before creating this ruleset.
  depends_on = [
    google_firebase_storage_bucket.default,
  ]
}

# Releases the ruleset to the default Storage bucket.
resource "google_firebaserules_release" "default" {
  provider = google-beta
  # name     = "firebase.storage/${google_app_engine_application.default.default_bucket}"
  name         = "firebase.storage/${google_storage_bucket.default.name}"
  ruleset_name = "projects/${var.project_id}/rulesets/${google_firebaserules_ruleset.default.name}"
  project      = var.project_id
}
