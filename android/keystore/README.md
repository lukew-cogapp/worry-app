# Android Keystore Setup

This directory contains the debug keystore to ensure consistent app signing across all development environments.

## Why This Exists

The `INSTALL_FAILED_UPDATE_INCOMPATIBLE` error occurs when Android detects different signing keys between app installations. By checking in a consistent debug keystore, we avoid this issue.

## Setup Instructions

### First Time Setup (New Developer)

The debug keystore is already configured and checked into the repo. No action needed!

### If You Deleted Your Debug Keystore

If you need to regenerate the debug keystore:

```bash
# From project root
keytool -genkey -v -keystore android/keystore/debug.keystore \
  -storepass android -alias androiddebugkey -keypass android \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -dname "CN=Android Debug,O=Android,C=US"
```

## Security Note

**Debug keystores are safe to check into version control** because they use standard Android debug credentials:
- Store password: `android`
- Key alias: `androiddebugkey`
- Key password: `android`

**Never check in release keystores!** Release keystores should be kept secure and managed separately (e.g., via CI/CD secrets).

## Troubleshooting

If you still get `INSTALL_FAILED_UPDATE_INCOMPATIBLE`:

```bash
# Force uninstall the app completely
adb uninstall com.worrybox.app

# Then reinstall
npx cap run android
```
