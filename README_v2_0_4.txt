CoviTools Android v2.0.4

Cambios:
- Si existe un Check360 en curso, la app muestra una pantalla clara con tres opciones:
  Continuar chequeo / Descartar y empezar nuevo / Volver al inicio.
- El botón Check360 ya no borra ni sustituye un borrador sin ofrecer opciones.
- Se conserva la sección donde se dejó el chequeo.
- Versión interna actualizada a 2.0.4.

Compilación:
npm install --registry=https://registry.npmjs.org/
npx cap sync android
cd android
gradlew clean
gradlew assembleDebug
