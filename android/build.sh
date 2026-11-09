#!/bin/bash
# Construit l'APK sans Gradle : aapt2 -> javac -> d8 -> zipalign -> apksigner
set -e
cd "$(dirname "$0")"
SDK=${ANDROID_HOME:-/opt/android-sdk}; BT=$SDK/build-tools/34.0.0; JAR=$SDK/platforms/android-34/android.jar
rm -rf build && mkdir -p build/res build/gen build/classes build/dex
$BT/aapt2 compile --dir res -o build/res/res.zip
$BT/aapt2 link -o build/base.apk -I $JAR --manifest AndroidManifest.xml -A assets --java build/gen build/res/res.zip --auto-add-overlay -0 html -0 js
javac --release 11 -nowarn -classpath $JAR -d build/classes $(find src build/gen -name '*.java') 2>&1 | grep -v 'bootstrap\|JAVA_TOOL' || true
(cd build/classes && jar cf ../classes.jar .) && java -cp $SDK/r8.jar com.android.tools.r8.D8 --min-api 24 --output build/dex --lib $JAR build/classes.jar
cp build/base.apk build/unsigned.apk && (cd build/dex && zip -q -u ../unsigned.apk classes.dex)
$BT/zipalign -f -p 4 build/unsigned.apk build/aligned.apk
[ -f release.keystore ] || keytool -genkeypair -keystore release.keystore -alias armees40k -keyalg RSA -keysize 2048 -validity 10000 -storepass armees40k -keypass armees40k -dname "CN=Mes armees 40k" 2>/dev/null
$BT/apksigner sign --ks release.keystore --ks-pass pass:armees40k --key-pass pass:armees40k --out MesArmees40k.apk build/aligned.apk
$BT/apksigner verify MesArmees40k.apk && ls -la MesArmees40k.apk
