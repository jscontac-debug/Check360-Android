CoviTools Android v2.1.0

Cambios principales:
- Actualizador anti-caché definitivo: version.json se consulta siempre con URL única y cabeceras no-cache.
- Versión interna actualizada a 2.1.0 / versionCode 210.
- Build Release preparado con R8/ProGuard y reducción de recursos.
- Reglas ProGuard seguras para Capacitor/WebView.

Compilación de prueba habitual:
  npm install --registry=https://registry.npmjs.org/
  npx cap sync android
  cd android
  gradlew clean
  gradlew assembleDebug

APK de prueba:
  android/app/build/outputs/apk/debug/app-debug.apk

Release/producción:
- El modo release queda preparado, pero para distribuirlo como producción estable hace falta crear un certificado .jks y firmar la APK.
- No pierdas nunca el certificado .jks cuando lo creemos: sin él no se podrán actualizar instalaciones firmadas con ese certificado.
