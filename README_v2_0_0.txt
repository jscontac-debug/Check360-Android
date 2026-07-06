Check360 Android v2.0.0

Cambios principales:
- Nueva pantalla de inicio tipo dashboard.
- Acceso directo a nueva visita, continuar, historial y actualizaciones.
- Historial de chequeos con buscador local.
- Interfaz preparada para módulos futuros.
- Mantiene sistema OTA GitHub Pages y cola de pendientes.

Compilación recomendada:
1) npm install --registry=https://registry.npmjs.org/
2) npx cap sync android
3) cd android
4) gradlew clean
5) gradlew assembleDebug

Si npm vuelve a intentar usar un registry incorrecto, borra package-lock.json y node_modules antes de npm install.
