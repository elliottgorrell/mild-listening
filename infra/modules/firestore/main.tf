# Provisions the Firestore database instance.
resource "google_firestore_database" "default" {
  provider         = google-beta
  project          = var.project_id
  name             = "(default)"
  location_id      = "nam5"
  type             = "FIRESTORE_NATIVE"
  concurrency_mode = "OPTIMISTIC"
}

# Creates a ruleset of Firestore Security Rules from a local file.
resource "google_firebaserules_ruleset" "default" {
  provider = google-beta
  project  = var.project_id
  source {
    files {
      name    = "firestore.rules"
      content = file(var.rules_file_path)
    }
  }

  depends_on = [
    google_firestore_database.default,
  ]
}

# Releases the ruleset for the Firestore instance.
resource "google_firebaserules_release" "default" {
  provider     = google-beta
  name         = "cloud.firestore" # must be cloud.firestore
  ruleset_name = google_firebaserules_ruleset.default.name
  project      = var.project_id

  depends_on = [
    google_firestore_database.default,
  ]
}
