# Infrastructure as Code

## Pre-Requisites

* GCP cli (`brew install --cask google-cloud-sdk`)
* Terraform (`brew tap hashicorp/tap && brew install hashicorp/tap/terraform`)

## Steps to run locally

1. Make sure you are authenticated in you browser to the GCP account for tilp.
2. `gcloud auth application-default login`. This will download a credential file for terraform to use
3. `terraform apply`