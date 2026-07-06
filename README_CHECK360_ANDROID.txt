CHECK 360 COVIRAN - PRUEBA ANDROID PARALELA

Este paquete NO sustituye a la app web actual.
Es una base paralela para generar una APK con Capacitor.

ESTRUCTURA:
- www/ contiene la app web actual.
- package.json define Capacitor.
- capacitor.config.json define el nombre e identificador Android.

PASOS EN TU PC:
1) Instalar Node.js LTS.
2) Instalar Android Studio.
3) Abrir terminal dentro de esta carpeta.
4) Ejecutar:
   npm install
   npx cap add android
   npx cap sync android
   npx cap open android
5) En Android Studio: Build > Build Bundle(s) / APK(s) > Build APK(s).

ENVIO DE EMAIL/PDF:
La app mantiene el endpoint actual de Google Apps Script:
script.js -> URL_APPS_SCRIPT
La APK enviará los datos al mismo servidor. No mete contraseñas de correo dentro de la app.

NOTAS:
- Para Microsoft Outlook/Excel habría que hacer fase 2 con Microsoft Entra/Graph.
- Para probar ahora no hace falta Google Play.
