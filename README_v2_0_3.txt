CoviTools Android v2.0.3

Cambios:
- Botón principal renombrado a Check360.
- Panel de inicio separado en Herramientas de trabajo y Gestión de la app.
- Check360, Check180, Tickets e Incidencias quedan juntos como herramientas de trabajo.
- Historial y Actualizaciones quedan como gestión de la app.
- El botón Continuar solo aparece cuando hay un borrador con tienda/socio indicado.
- Añadido botón Inicio dentro de Check360 para volver al panel sin cerrar la app.

Compilación:
npm install --registry=https://registry.npmjs.org/
npx cap sync android
cd android
gradlew clean
gradlew assembleDebug
