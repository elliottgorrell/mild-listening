# Tilp Mobile App

## UI Framework Decisions

In this bootstrap setup I have tried to add what I believe is a sane level or UI frameworks. I have included tailwindcss as it has had decent staying power in the industry for awhile now.

I have steered clear of any "UI Frameworks", the hotness changes every year, updates can be a pain and often you only need a few components to get a simple MVP off the ground.

Therefore I have made use of [this project](https://www.atomlab.dev/elements) which is designed to be more copy paste and doesn't actually install versioned npm packages for every ui element. If you are missing a component check that link to see if it exists otherwise feel free to create a component or migrate to something more powerful such as [gluestack](https://gluestack.io/ui/docs/home/getting-started/cli).

## How to access the firebase services for debugging

By default the app connects to several firebase services hosted in the cloud.
If you want to inspect our DB, storage buckets or modify data directly (for example setting a user to need to onbooard again) you will need to log in to the cloud console in your browser.

The easiest way to access this is to get access to the dashlane account for Tilp with all the logins and then access it at <https://console.firebase.google.com/project/tilp-app>

## oAuth

Sign in with Facebook doesn't work when auth emulator is connected. This is a restriction from google firebase.

## Debugging issues that only appear in release build

Sometimes you encounter an issue with a release build (for example an EAS preview build) that you don't see when normally developing.
For example I encountered the app crashing when i tried ot install the preview non-dev build. To debug this you can get closer to prod by running:
`npx expo run:ios --configuration Release`

This sometimes reveals issues related to release configuration
