Check360 Android v1.6.0

Sistema de actualizaciones integrado.

Servidor de versiones:
https://jscontac-debug.github.io/Check360-Android/version.json

Cambios:
- Botón real para Buscar actualización.
- Consulta version.json en GitHub Pages.
- Compara versión instalada con versión publicada.
- Muestra novedades y actualización recomendada/obligatoria.
- Abre la URL de descarga de la APK desde GitHub Releases.
- Comprobación automática al abrir, como máximo cada 6 horas.

Importante:
Android pedirá confirmar la instalación de la APK. Esto es normal.
No se puede actualizar en silencio fuera de Google Play, Intune/MDM o una tienda corporativa.

Para publicar una nueva versión:
1. Cambia VERSION_APP en www/script.js.
2. Cambia versionCode/versionName en android/app/build.gradle.
3. Compila la APK.
4. Sube la APK a GitHub Releases.
5. Actualiza version.json en Check360-Android.
