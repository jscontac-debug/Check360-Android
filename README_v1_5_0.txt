Check360 Android v1.5.0
=======================

Cambios incluidos:

1) Se ocultan del formulario:
   - Todas las preguntas "Artículos top 10 por familia".
   - La sección "Otros/Servicios".
   - La sección "Extra - Comunicación".
   - La sección "Compromisos".

2) Historial de chequeos:
   - Cada visita finalizada queda registrada en el dispositivo.
   - El historial muestra socio, población, fecha, score, valoración y estado.
   - Si la visita aún no se ha enviado, aparece como "Pendiente".
   - Cuando el servidor confirma el envío, pasa a "Enviado".

3) Actualizaciones:
   - Se ha integrado la estructura de actualización dentro de la app.
   - Falta conectar una URL privada UPDATE_MANIFEST_URL en www/script.js.
   - Android NO permite actualizar una APK de forma totalmente silenciosa salvo Google Play, Intune/MDM o tienda corporativa.
   - Con este sistema, la app podrá comprobar versión, descargar la APK y Android pedirá confirmar la actualización.

Comandos de compilación:

npm install
npx cap sync android
cd android
gradlew clean
gradlew assembleDebug

Ruta APK:
android\app\build\outputs\apk\debug\app-debug.apk
