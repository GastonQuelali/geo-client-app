# Deployment

## EAS Build

The project uses [Expo Application Services (EAS)](https://docs.expo.dev/eas/) for building native binaries.

### Profiles (defined in `eas.json`)

| Profile | Build type | Android | Notes |
|---------|-----------|---------|-------|
| `preview` | APK | ✅ | Test builds, sideloading |
| `production` | APK | ✅ | Release builds |

### Building

```bash
# Install EAS CLI
npm install -g eas-cli

# Preview build (APK)
eas build --platform android --profile preview

# Production build
eas build --platform android --profile production
```

### EAS project configuration

| Key | Value |
|-----|-------|
| Project ID | `a73e63ac-77b1-4ec0-bdd8-ac2c4aedfe84` |
| Owner | `gaston1980` |
| Updates URL | `https://u.expo.dev/a73e63ac-77b1-4ec0-bdd8-ac2c4aedfe84` |

Configured in `app.json` under the `expo` key.

## Over-the-air updates (expo-updates)

The app uses `expo-updates` to push JavaScript bundle updates without requiring a store submission.

### Publishing an update

```bash
eas update --branch <branch-name> --message "<description>"
```

### Runtime version

The runtime version policy is set to `appVersion` (derived from `version` in `app.json`).

## Local development

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Start with cache cleared
npx expo start -c

# Run on specific platform
npx expo start --android
npx expo start --ios
npx expo start --web
```

## Environment notes

- No `.env` files are committed to the repository (listed in `.gitignore`).
- All configuration is stored at runtime in `expo-secure-store`.
- Default server addresses are hardcoded and can be overridden via the Settings screen.

## Required native permissions

None beyond defaults. HTTP cleartext traffic is enabled via `expo-build-properties`:
- iOS: `NSAllowsArbitraryLoads: true`
- Android: `usesCleartextTraffic: true`
