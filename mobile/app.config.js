import * as dotenv from "dotenv";
dotenv.config();

function throwIfNotSet(varName) {
  const envVar =
    process.env[varName] ??
    (() => {
      throw new Error(`Env Var ${varName} is not set`);
    })();

  return envVar;
}

// Env Vars needed in the app
// You need this for google sign in to work on android
throwIfNotSet("EXPO_PUBLIC_GOOGLE_WEB_ID"),

module.exports = ({ config }) => {
  const secrets = {
    fbAppId: throwIfNotSet("FB_APP_ID"),
    fbClientToken: throwIfNotSet("FB_CLIENT_TOKEN"),
    easProjectId: throwIfNotSet("EAS_PROJECT_ID"),
  };

  return {
    expo: {
      name: config.name,
      slug: config.name,
      version: config.version,
      orientation: "portrait",
      icon: "./src/assets/icon.png",
      userInterfaceStyle: "light",
      splash: {
        image: "./src/assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
      assetBundlePatterns: ["**/*"],
      ios: {
        supportsTablet: true,
        bundleIdentifier: config.bundleIdentifier,
        googleServicesFile: "./GoogleService-Info.plist",
      },
      android: {
        package: config.bundleIdentifier,
        googleServicesFile: "./google-services.json",
      },
      plugins: [
        "@react-native-firebase/app",
        "@react-native-firebase/auth",
        [
          "expo-build-properties",
          {
            ios: { useFrameworks: "static" },
          },
        ],
        ["@react-native-google-signin/google-signin"],
        [
          "react-native-fbsdk-next",
          {
            appID: secrets.fbAppId,
            clientToken: secrets.fbClientToken,
            displayName: config.name,
            scheme: `fb${secrets.fbAppId}`,
          },
        ],
      ],
      extra: {
        environment: "local",
        eas: {
          projectId: secrets.easProjectId,
        },
      },
    },
  };
};
