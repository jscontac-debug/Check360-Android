(function () {
  async function fetchVersionJson() {
    const url = "https://raw.githubusercontent.com/jscontac-debug/Check360-Android/main/version.json?ts=" + Date.now();
    const respuesta = await fetch(url, { method: "GET", cache: "no-store" });

    if (!respuesta.ok) {
      throw new Error("GitHub RAW respondió HTTP " + respuesta.status);
    }

    return respuesta.json();
  }

  window.consultarActualizacion = async function () {
    const info = await fetchVersionJson();

    if (!info || !info.version) {
      throw new Error("version.json no contiene una versión válida.");
    }

    localStorage.setItem("covitools_ultima_version_json", JSON.stringify({
      fecha: new Date().toISOString(),
      fuente: "github-raw",
      version: info.version || "",
      versionCode: info.versionCode || 0
    }));

    return info;
  };

  window.mostrarConfiguracion = function () {
    renderizarEstadoActualizacion(`
      <h3>Actualizaciones</h3>
      <p>Desde aquí puedes comprobar si existe una nueva versión de CoviTools.</p>
    `);
  };
})();