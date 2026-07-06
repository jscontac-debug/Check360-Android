CHECK 360 COVIRÁN - v1.1.0

Pasos para generar la APK:

1. Abrir CMD en la carpeta Check360_Android_preparado.
2. Ejecutar:

   npm install
   npx cap sync android
   cd android
   gradlew assembleDebug

3. La APK queda en:

   android\app\build\outputs\apk\debug\app-debug.apk

Notas:
- Esta versión añade @capacitor/camera. Por eso es importante ejecutar npm install antes de sync.
- Instala la APK encima de la anterior. Android la reconocerá como actualización porque se mantiene el mismo appId.
- Si Android pide permisos de cámara, aceptarlos.
