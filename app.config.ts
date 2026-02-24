import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: "عمو قناد",
    slug: "amoo-ghanad",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    scheme: "bakerycalculator",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
        supportsTablet: true,
        bundleIdentifier: "ir.appsaz.amoo.ghanad"
    },
    android: {
        adaptiveIcon: {
            backgroundColor: "#ff0000ff",
            foregroundImage: "./src/assets/images/android-icon-foreground.png",
            monochromeImage: "./src/assets/images/android-icon-monochrome.png"
        },
        edgeToEdgeEnabled: true,
        predictiveBackGestureEnabled: false,
        package: "ir.appsaz.amoo.ghanad",

    },
    web: {
        output: "static",
        favicon: "./src/assets/images/favicon.png"
    },
    plugins: [
        "expo-router",
        [
            "expo-splash-screen",
            {
                image: "./src/assets/images/light-splash-screen.png",
                imageWidth: 200,
                resizeMode: "contain",
                backgroundColor: "#ffffff",
                dark: {
                    image: "./src/assets/images/dark-splash-screen.png",
                    backgroundColor: "#000000"
                }
            }
        ],
        "expo-sqlite"
    ],
    experiments: {
        typedRoutes: true,
        reactCompiler: true
    },
    extra: {
        router: {},
        eas: {
            projectId: "c5150895-aef1-4886-a53a-bfafcb35707b"
        }
    }
});
