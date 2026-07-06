CoviTools v2.0.2

Cambios:
- Nombre visible de la app: CoviTools.
- Recuperado acceso Check180.
- Se mantienen Tickets e Incidencias.
- Se mantiene subtítulo: Modelo tienda Covirán.
- Retirado texto de fotos guardadas localmente.

Compilar:
npm install --registry=https://registry.npmjs.org/
npx cap sync android
cd android
gradlew clean
gradlew assembleDebug
