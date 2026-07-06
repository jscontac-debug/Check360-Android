CoviTools Android v2.1.1

Cambios:
- Actualizador consulta version.json desde raw.githubusercontent.com.
- Se elimina dependencia de GitHub Pages/Actions para actualizaciones.
- Anti-cache mantenido con timestamp único en cada consulta.
- Version interna 2.1.1 / versionCode 211.

Compilación:
npm install --registry=https://registry.npmjs.org/
npx cap sync android
cd android
gradlew clean
gradlew assembleDebug
