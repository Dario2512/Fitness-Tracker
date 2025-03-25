import "dotenv/config";

export default {
  expo: {
    name: "Licenta",
    slug: "Licenta",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.anonymous.Licenta",
      buildNumber: "1.0.0",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "com.anonymous.Licenta",
      permissions: [
        "ACTIVITY_RECOGNITION",
        "INTERNET",
        "BLUETOOTH",
        "BLUETOOTH_ADMIN",
        "BLUETOOTH_SCAN",
        "BLUETOOTH_CONNECT",
        "BLUETOOTH_ADVERTISE",
      ],
      config: {
        googleMaps: {
          apiKey: process.env.MAPS_API_KEY, 
        },
      },
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      mapsApiKey: process.env.MAPS_API_KEY, 
      eas: {
        projectId: "531e1507-04d5-43e1-9b36-a7bda4d0fb83",
      },
    },
    owner: "dario25122002",
    plugins: [
      "expo-router",
      "expo-font",
      [
        "expo-build-properties",
        {
          android: {
            "manifestApplicationMetaData": [
              {
                "name": "com.google.android.geo.API_KEY",
                "value": process.env.MAPS_API_KEY,
              },
            ],
          },
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
  },
};