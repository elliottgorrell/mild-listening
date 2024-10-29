# Tilp

## Monorepo Organizational Structure

- mobile (A react native app for mobile)
- ci (All the code related to CI/CD)
- infra (All infra code related to cloud deployment of the service)
- firebase (The config for our firebase project and also the local emulation suite)

## Testing GitHub Actions Workflows

We make use of [act](https://github.com/nektos/act) to locally run our github workflows and quickly get feedback before actually pushing to github.

### Pre-Requisites

- Homebrew (if on mac)
- The secrets file from dashlane (secrets.env)

Simply install act using `brew install act`

## Running

`act [(pull_request|push|etc.)] --secret-file .github/secrets.env`

A beginners guides can be found [here](https://nektosact.com/beginner/index.html)
