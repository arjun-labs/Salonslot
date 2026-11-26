# SalonSlot Field — Android APK (Capacitor wrapper)

The APK is the same `/field/` web app inside a native shell, so it can keep GPS running with the screen off (foreground service with a notification) and use native Google login.
It is built by GitHub Actions (`.github/workflows/field-apk.yml`) on every change to `field/` or `field-android/`; the latest file is at the repo's Releases page (`field-latest`).

## One-time Firebase setup (needed for Google login in the APK)
1. Firebase Console → Project settings → Your apps → Add app → Android.
   Package name: `com.salonslot.field`. SHA-1: `52:73:B1:86:2C:87:CE:C5:69:F4:FC:30:1C:7B:90:B6:09:67:58:D0` (from the committed `debug.keystore`).
2. Download `google-services.json` and put it in this folder (`field-android/google-services.json`), commit, push. The build then includes it.
3. Authentication → Sign-in method → Google must be enabled (it already is for the salon app).

## Install on the boy's phone
Open the Releases link on his phone, download `SalonSlot-Field.apk`, allow "install unknown apps", install. On first Start allow Location "Allow all the time" and Notifications; set Battery to "Unrestricted".

Note: `debug.keystore` is a pilot signing key committed on purpose (fixed SHA-1). Use a private release key before any Play Store upload.
