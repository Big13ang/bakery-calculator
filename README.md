# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## CI/CD Android APK Build (GitHub Actions)

This repository is configured with a GitHub Actions workflow that automatically builds an installable Android APK (`app-release.apk`) signed with the debug keystore.

### How to Start the Workflow

1. Navigate to the repository on GitHub.
2. Click on the **Actions** tab.
3. Select the **Build Android APK** workflow in the left sidebar.
4. Click the **Run workflow** dropdown on the right.
5. Select the branch and click **Run workflow**.

### Downloading the APK

1. Once the workflow run completes, click on it.
2. Scroll down to the **Artifacts** section.
3. Click on the **peymaneh-apk** artifact to download the ZIP file.
4. Extract the ZIP file to get `app-release.apk`.

### Installing the APK on Android

1. Transfer `app-release.apk` to your Android device.
2. Locate the APK in your device's File Manager.
3. Tap the file to install it. (If prompted, enable "Allow installation from unknown sources" in settings).

