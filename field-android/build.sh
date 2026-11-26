#!/usr/bin/env bash
# Builds the QuickSlot Field APK. Runs in GitHub Actions (see .github/workflows/field-apk.yml); needs Android SDK + Java 21.
set -euo pipefail
cd "$(dirname "$0")"
rm -rf www android && mkdir www
cp -r ../field/. www/ && rm -f www/README.md
npm install --no-audit --no-fund
npx cap add android
# permissions for background location + notification (foreground service)
M=android/app/src/main/AndroidManifest.xml
python3 - "$M" <<'PY'
import sys,re
p=sys.argv[1]; s=open(p).read()
perms=["ACCESS_COARSE_LOCATION","ACCESS_FINE_LOCATION","ACCESS_BACKGROUND_LOCATION","FOREGROUND_SERVICE","FOREGROUND_SERVICE_LOCATION","POST_NOTIFICATIONS","WAKE_LOCK","CAMERA"]
add="".join(f'    <uses-permission android:name="android.permission.{x}" />\n' for x in perms if x not in s)
s=s.replace("</manifest>",add+"</manifest>")
open(p,"w").write(s)
PY
# icon: use the app icon on all launcher sizes
for d in mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192; do
  n=${d%%:*}; px=${d##*:}
  for f in ic_launcher ic_launcher_round ic_launcher_foreground; do
    python3 - "$n" "$px" "$f" <<'PY' || true
import sys
from PIL import Image
n,px,f=sys.argv[1],int(sys.argv[2]),sys.argv[3]
im=Image.open("../field/icon-192.png").convert("RGBA").resize((px,px))
im.save(f"android/app/src/main/res/mipmap-{n}/{f}.png")
PY
  done
done
rm -rf android/app/src/main/res/mipmap-anydpi-v26
[ -f google-services.json ] && cp google-services.json android/app/google-services.json || echo "WARNING: no google-services.json - Google login will not work in this APK"
# fixed signing key so the SHA-1 never changes (needed for Google login)
mkdir -p ~/.android && cp debug.keystore ~/.android/debug.keystore
npx cap sync android
(cd android && ./gradlew --no-daemon assembleDebug)
mkdir -p out && cp android/app/build/outputs/apk/debug/app-debug.apk out/QuickSlot-Field.apk
ls -la out
