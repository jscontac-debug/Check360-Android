/**
 * CoviTools v3
 * Almacenamiento independiente de borradores Check360 / Check180
 */

window.CoviCheckStorage = {
  normalizarTipo(tipo) {
    return tipo === "check180" ? "check180" : "check360";
  },

  clave(tipo) {
    return this.normalizarTipo(tipo) === "check180"
      ? "check180_borrador"
      : "check360_borrador";
  },

  guardar(tipo, paginaActual, datos) {
    localStorage.setItem(
      this.clave(tipo),
      JSON.stringify({ paginaActual, datos })
    );
  },

  cargar(tipo) {
    const guardado = localStorage.getItem(this.clave(tipo));
    return guardado ? JSON.parse(guardado) : null;
  },

  borrar(tipo) {
    localStorage.removeItem(this.clave(tipo));
  },

  existe(tipo) {
    return Boolean(localStorage.getItem(this.clave(tipo)));
  }
};