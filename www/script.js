const VERSION_APP = "2.3.1";

/*
  Actualizaciones
  ----------------
  Android no permite actualizar una APK de forma totalmente silenciosa si no se
  distribuye por Google Play, Intune/MDM o una tienda corporativa. Lo que sí
  dejamos preparado es el flujo interno: la app comprueba una URL privada con
  la última versión, descarga/abre la APK y Android pide confirmar la
  actualización. El usuario no desinstala nada: actualiza encima.

  Cuando tengamos una URL definitiva, sustituiremos el valor de abajo por el
  manifiesto real, por ejemplo:
  https://tudominio.com/check360/update.json
*/
const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbxFfUdBA6xKFSY1VKlpUPizhAXvniwK27lVPAN3p_Zt4l7biBVJcAkLGmaEunT3m5tU/exec";
const UPDATE_MANIFEST_RAW_URL = "https://raw.githubusercontent.com/jscontac-debug/Check360-Android/main/version.json";
const CLAVE_HISTORIAL = "historialCheck360";

const CLAVE_PENDIENTES = "visitasPendientesCheck360";
const CLAVE_BORRADOR = "check360_borrador";

let paginas = [
  {
    titulo: "Datos de contacto",
    imagen: "img/portada.png",
    botonActualizar: false,
    campos: [
      { id: "socio", pregunta: "Número de Socio y nombre", tipo: "texto" },
      { id: "poblacion", pregunta: "Población", tipo: "texto" },
      { id: "interlocutor", pregunta: "Interlocutor de la visita", tipo: "texto" },
      { id: "email", pregunta: "Correo donde recibir el resumen", tipo: "email" }
    ]
  },

  {
    titulo: "{{MODO}}º Negocio - Visión global de la tienda",
    categoria: "{{MODO}}º Negocio",
    imagen: "img/portada.png",
    campos: [
      { id: "integracion_tienda", pregunta: "Dato de integración tienda", tipo: "texto" },
      { id: "integracion_zona", pregunta: "Dato integración zona", tipo: "texto" },
      { id: "ventas", pregunta: "Evolución ventas tienda acumulada", tipo: "texto" },
      { id: "compras", pregunta: "Evolución compras tienda acumulada (plataforma+refacturación)", tipo: "texto" },
      { id: "familias", pregunta: "Familias que decrecen y que crecen especialmente", ayuda: "Indicar familia y %", tipo: "textarea" },
      { id: "marca_propia", pregunta: "Participación marca propia", tipo: "texto" },
      { id: "refacturacion", pregunta: "Refacturación proveedores", ayuda: "Preguntar qué proveedor no refactura y el motivo", tipo: "textarea" },
      { id: "preventas", pregunta: "¿Hace preventas?", tipo: "select", opciones: ["Sí", "No"] },
      { id: "sugerencias_preventas", pregunta: "Sugerencias sobre las preventas", tipo: "textarea" },
      { id: "novedades_marca_propia", pregunta: "¿Tiene las novedades de marca propia implantadas?", ayuda: "Alguna novedad introducida seis meses atrás", tipo: "score" },
      { id: "cuenta_resultados", pregunta: "¿Le interesa elaborar y estudiar la cuenta de resultados de su negocio?", ayuda: "Es imprescindible estar dispuesto a plasmar la realidad.", tipo: "textarea" },
      { id: "acciones_360", pregunta: "Sugerencias y planes de acción sobre algunos de los puntos anteriores", tipo: "textarea" },
      { id: "top_congelados", pregunta: "Artículos top 10 por familia - CONGELADOS", tipo: "score" },
      { id: "top_drogueria", pregunta: "DROGUERÍA", tipo: "score" },
      { id: "top_perfumeria", pregunta: "PERFUMERÍA", tipo: "score" },
      { id: "top_ultramarinos", pregunta: "ULTRAMARINOS", tipo: "score" },
      { id: "top_bebidas", pregunta: "BEBIDAS", tipo: "score" },
      { id: "top_charcuteria_corte", pregunta: "CHARCUTERÍA AL CORTE", tipo: "score" }
    ]
  },

  {
    titulo: "Frutería",
    categoria: "Frutería",
    imagen: "img/fruteria.jpg",
    campos: [
      { id: "fruta_oferta", pregunta: "¿Tiene productos de oferta?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "fruta_frescura", pregunta: "Frescura/Rotación", tipo: "score" },
      { id: "fruta_implantacion", pregunta: "Estructura implantación - cumple criterios lógicos", tipo: "score" },
      { id: "fruta_sugerencias", pregunta: "Sugerencias sobre la implantación - faltan precios, criterio lógico, etc.", tipo: "textarea" },
      { id: "foto_fruteria", pregunta: "Foto Frutería", tipo: "foto" }
    ]
  },

  {
    titulo: "Carnicería - Asistida y libre servicio",
    categoria: "Carnicería",
    imagen: "img/carniceria.jpg",
    campos: [
      { id: "carne_oferta", pregunta: "¿Tiene los productos de oferta?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "carne_frescura", pregunta: "Frescura/rotación", tipo: "score" },
      { id: "aves", pregunta: "Aves", tipo: "score" },
      { id: "cerdo", pregunta: "Cerdo", tipo: "score" },
      { id: "ternera", pregunta: "Ternera", tipo: "score" },
      { id: "elaborados", pregunta: "Elaborados/platos preparados", tipo: "score" },
      { id: "carne_implantacion", pregunta: "Sugerencias sobre la implantación - faltan precios, criterio lógico, etc.", tipo: "textarea" },
      { id: "carne_surtido", pregunta: "Sugerencias sobre el surtido", tipo: "textarea" },
      { id: "foto_carniceria", pregunta: "Foto Carnicería", tipo: "foto" }
    ]
  },

  {
    titulo: "Charcutería - Asistida",
    categoria: "Charcutería",
    imagen: "img/charcuteria.jpg",
    campos: [
      { id: "charcuteria_oferta", pregunta: "¿Tiene productos de oferta?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "charcuteria_frescura", pregunta: "Frescura/rotación", tipo: "score" },
      { id: "ibericos_pates", pregunta: "¿Trabaja ibéricos o patés?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "charcuteria_implantacion", pregunta: "Estructura implantación - cumple criterios lógicos", tipo: "score" },
      { id: "charcuteria_sugerencias", pregunta: "Sugerencias sobre la implantación - faltan precios, criterio lógico, etc.", tipo: "textarea" },
      { id: "foto_charcuteria", pregunta: "Foto Charcutería", tipo: "foto" }
    ]
  },

  {
    titulo: "Panadería",
    categoria: "Panadería",
    imagen: "img/panaderia.jpg",
    campos: [
      { id: "pan_oferta", pregunta: "¿Tiene productos de oferta?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "pan_tipo", pregunta: "¿La panadería es libre servicio o asistida?", tipo: "select", opciones: ["Libre servicio", "Asistida", "Ambas"] },
      { id: "pan_horno", pregunta: "¿Tienen horno y lo usan?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "pan_implantacion", pregunta: "Implantación de la familia (libre servicio o asistida)", tipo: "score" },
      { id: "bolleria", pregunta: "¿Trabajan bollería/pastelería?", tipo: "select", opciones: ["Sí", "No", "Sólo en fechas señaladas"], puntos: { "Sí": 3, "Sólo en fechas señaladas": 2, "No": 1 } },
      { id: "pan_sugerencias", pregunta: "Sugerencias/consideraciones sobre la implantación", tipo: "textarea" },
      { id: "foto_panaderia", pregunta: "Foto Panadería", tipo: "foto" }
    ]
  },

  {
    titulo: "Murales de libre servicio",
    categoria: "Murales de libre servicio",
    imagen: "img/libre_servicio.jpg",
    campos: [
      { id: "murales_oferta", pregunta: "¿Tiene productos de oferta?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "murales_huecos", pregunta: "¿Tiene faltas/huecos?", tipo: "select", opciones: ["Menos de 10", "Menos de 20", "Más de 20"], puntos: { "Menos de 10": 3, "Menos de 20": 2, "Más de 20": 1 } },
      { id: "murales_caducados", pregunta: "¿Tiene caducados?", tipo: "select", opciones: ["Sí", "No"], puntos: { "No": 3, "Sí": 1 } },
      { id: "murales_frenteado", pregunta: "¿Está frenteado?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
{ id: "murales_consideraciones", pregunta: "Consideraciones sobre los murales", tipo: "textarea" },
      { id: "foto_murales", pregunta: "Foto Murales de libre servicio", tipo: "foto" }
    ]
  },

  {
    titulo: "Congelados",
    categoria: "Congelados",
    imagen: "img/congelados.jpg",
    campos: [
      { id: "congelados_oferta", pregunta: "¿Tiene productos de oferta?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "congelados_huecos", pregunta: "¿Tiene faltas/huecos?", tipo: "select", opciones: ["Menos de 10", "Menos de 20", "Más de 20"], puntos: { "Menos de 10": 3, "Menos de 20": 2, "Más de 20": 1 } },
      { id: "congelados_caducados", pregunta: "¿Tiene caducados?", tipo: "select", opciones: ["Sí", "No"], puntos: { "No": 3, "Sí": 1 } },
      { id: "congelados_frenteado", pregunta: "¿Está frenteado?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "congelados_limpieza", pregunta: "¿Se realiza limpieza y mantenimiento?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "congelados_consideraciones", pregunta: "Consideraciones sobre los congelados", tipo: "textarea" },
      { id: "foto_congelados", pregunta: "Foto Congelados", tipo: "foto" }
    ]
  },

  {
    titulo: "Operativa tienda",
    categoria: "Operativa tienda",
    imagen: "img/operativa_tienda.png",
    campos: [
      { id: "frenteo", pregunta: "Frenteo", tipo: "score" },
      { id: "huecos_faltas", pregunta: "Gestión de huecos/faltas", tipo: "select", opciones: ["Bien (menos de 10)", "Regular (menos de 20)", "Mal (más de 20)"], puntos: { "Bien (menos de 10)": 3, "Regular (menos de 20)": 2, "Mal (más de 20)": 1 } },
      { id: "huecos_sugerencias", pregunta: "Sugerencias/consideraciones sobre huecos/faltas", tipo: "textarea" },
      { id: "caducados", pregunta: "Caducados (un caducado es mal, cero bien)", tipo: "select", opciones: ["Bien", "Mal"], puntos: { "Bien": 3, "Mal": 1 } },
      { id: "rotacion_reposicion", pregunta: "Rotación en reposición (más de cero fallos, mal)", tipo: "select", opciones: ["Bien", "Mal"], puntos: { "Bien": 3, "Mal": 1 } },
      { id: "revision_albaranes", pregunta: "Revisión albaranes", tipo: "select", opciones: ["Bien", "Mal"], puntos: { "Bien": 3, "Mal": 1 } },
      { id: "tareas_empleados", pregunta: "¿Tienen los empleados las tareas programadas y organizadas?", tipo: "score" },
      { id: "calidad_visual", pregunta: "Calidad visual y orden de exposición", tipo: "score" },
      { id: "calidad_visual_sugerencias", pregunta: "Consideraciones/sugerencias de calidad visual", tipo: "textarea" },
      { id: "piladas", pregunta: "Gestión de piladas/cabeceras/expositores", tipo: "score" },
      { id: "piladas_sugerencias", pregunta: "Sugerencias/consideraciones sobre gestión de piladas/expositores", tipo: "textarea" },
      { id: "mueble_caja", pregunta: "Orden y limpieza de mueble caja", tipo: "score" },
      { id: "mueble_caja_sugerencias", pregunta: "Sugerencias/consideraciones sobre orden y limpieza de muebles caja", tipo: "textarea" },
      { id: "atencion_caja", pregunta: "Atención al cliente en caja", tipo: "score" },
      { id: "club_familia", pregunta: "¿Pide la tarjeta Club Familia?", tipo: "select", opciones: ["Sí", "No", "No procede"], puntos: { "Sí": 3, "No": 1, "No procede": null } },
      { id: "sistema_autocontrol", pregunta: "¿Tienen Sistema de Autocontrol?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "autocontrol_dia", pregunta: "¿Llevan al día el Sistema de Autocontrol?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "prl", pregunta: "Prevención de riesgos laborales", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "manipuladores", pregunta: "¿Tienen copia a mano de los diplomas de manipuladores de alimentos?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "control_horario", pregunta: "¿Disponen de control horario?", tipo: "select", opciones: ["Sí, escrito en papel", "Sí, de forma digital", "No"], puntos: { "Sí, de forma digital": 3, "Sí, escrito en papel": 2, "No": 1 } },
      { id: "hojas_reclamaciones", pregunta: "¿Disponen de hojas de reclamaciones?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "carteleria_legal", pregunta: "¿Tiene instalada la cartelería obligatoria por ley?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "seguro_rc", pregunta: "¿Llevan al día el seguro de responsabilidad civil?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "mantenimiento", pregunta: "¿Realizan mantenimiento preventivo?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "balanzas_dia", pregunta: "¿Verificación de balanzas al día?", tipo: "select", opciones: ["Sí", "No"], puntos: { "Sí": 3, "No": 1 } },
      { id: "almacen", pregunta: "¿Tiene el almacén organizado y limpio?", tipo: "score" },
      { id: "operativa_consideraciones", pregunta: "Consideraciones de operativa tienda", tipo: "textarea" }
    ]
  },

  {
    titulo: "Otros/Servicios",
    imagen: "img/servicios.jpg",
    campos: [
      { id: "acuerdos_coviran", pregunta: "¿Conoces los acuerdos de Coviran? Automoción, bancarios, seguros...", ayuda: "Proponer realizar propuesta", tipo: "textarea" },
      { id: "presupuestos", pregunta: "¿Tienes presupuestos por recibir?", tipo: "select", opciones: ["Sí", "No"] },
      { id: "formacion", pregunta: "¿Crees que necesitas tú o tu equipo alguna formación?", tipo: "textarea" }
    ]
  },

  {
    titulo: "Extra - Comunicación",
    categoria: "Extra - Comunicación",
    imagen: "img/servicios.jpg",
    campos: [
      { id: "portal_socio", pregunta: "¿Con qué frecuencia entras en el portal del socio?", tipo: "select", opciones: ["Diariamente", "Semanalmente", "Mensualmente", "Casi nunca", "Nunca"] },
      { id: "lee_comunicados", pregunta: "¿Lees los comunicados?", tipo: "select", opciones: ["Sí", "No", "A veces"] },
      { id: "omnio", pregunta: "¿Conoces o usas Omnio?", tipo: "select", opciones: ["Lo conozco y lo uso", "Lo conozco pero no lo uso", "No lo conozco"] },
      { id: "canal_comunicacion", pregunta: "¿Qué canal de comunicación prefieres?", tipo: "texto" },
      { id: "folleto", pregunta: "¿Consideras el folleto quincenal atractivo?", tipo: "select", opciones: ["Sí", "No", "Es muy grande", "Demasiada frecuencia"], puntos: { "Sí": 3, "Es muy grande": 2, "Demasiada frecuencia": 2, "No": 1 } }
    ]
  },

  {
    titulo: "Compromisos",
    imagen: "img/portada.png",
    campos: [
      { id: "compromisos", pregunta: "Acciones/compromisos para llevar a cabo en tienda", tipo: "textarea" }
    ]
  },

  {
    titulo: "Resumen de la visita",
    imagen: "img/portada.png",
    campos: [
      { id: "resumen_visita", pregunta: "Aspectos destacados y resumidos de la visita (para entregar al socio)", tipo: "textarea" },
      { id: "foto_resumen", pregunta: "Foto resumen de la visita", tipo: "foto" }
    ]
  }
];


/*
  Configuración funcional v1.5.0
  -------------------------------
  Se ocultan apartados y preguntas que ya no deben aparecer en la revisión.
  No se borran del código base para poder recuperarlos en el futuro si hiciera falta.
*/
const SECCIONES_OCULTAS = new Set([
  "Otros/Servicios",
  "Extra - Comunicación",
  "Compromisos"
]);

function campoOculto(campo) {
  const textoPregunta = String(campo.pregunta || "").toLowerCase();
  return (
    String(campo.id || "").startsWith("top_") ||
    textoPregunta.includes("artículos top 10 por familia")
  );
}

paginas = paginas
  .filter(pagina => !SECCIONES_OCULTAS.has(pagina.titulo))
  .map(pagina => ({
    ...pagina,
    campos: (pagina.campos || []).filter(campo => !campoOculto(campo))
  }));


/*
  Plantillas de revisión
  ----------------------
  Check360 y Check180 usan el mismo formulario y el mismo sistema de puntuación.
  En Check180 se ocultan, dentro de Operativa tienda, la pregunta "¿Pide la tarjeta
  Club Familia?" y todas las preguntas posteriores de esa sección.
*/
const PLANTILLAS_REVISION = {
  check360: {
    nombre: "Check360",
    etiqueta: "CHECK 360",
    descripcion: "Revisión completa de tienda",
    estado: "Activa"
  },
  check180: {
    nombre: "Check180",
    etiqueta: "CHECK 180",
    descripcion: "Revisión rápida de tienda",
    estado: "Activa"
  }
};

const PAGINAS_CHECK360 = paginas.map(pagina => ({
  ...pagina,
  campos: [...(pagina.campos || [])]
}));

function normalizarTipoRevision(tipo) {
  return tipo === "check180" ? "check180" : "check360";
}

function obtenerPlantillaActual() {
  return normalizarTipoRevision(datos.tipoRevision);
}

function obtenerEtiquetaRevision(tipo = obtenerPlantillaActual()) {
  return PLANTILLAS_REVISION[normalizarTipoRevision(tipo)].etiqueta;
}

function obtenerNombreRevision(tipo = obtenerPlantillaActual()) {
  return PLANTILLAS_REVISION[normalizarTipoRevision(tipo)].nombre;
}

function construirPaginasRevision(tipo) {
  const tipoNormalizado = normalizarTipoRevision(tipo);
  // La sección "{{MODO}}º Negocio" es de contenido compartido entre Check360
  // y Check180: aquí sustituimos la plantilla por el número real (180 o 360)
  // para que el título/categoría de la sección coincida con la revisión activa.
  const modoNumero = tipoNormalizado === "check180" ? "180" : "360";

  return PAGINAS_CHECK360.map(pagina => {
    let campos = [...(pagina.campos || [])];

    if (tipoNormalizado === "check180" && pagina.titulo === "Operativa tienda") {
      const indiceClubFamilia = campos.findIndex(campo => campo.id === "club_familia");
      if (indiceClubFamilia >= 0) {
        campos = campos.slice(0, indiceClubFamilia);
      }
    }

    const titulo = String(pagina.titulo || "").split("{{MODO}}").join(modoNumero);
    const categoria = pagina.categoria
      ? String(pagina.categoria).split("{{MODO}}").join(modoNumero)
      : pagina.categoria;

    return { ...pagina, titulo, categoria, campos };
  });
}

function actualizarPaginasRevision() {
  paginas = construirPaginasRevision(obtenerPlantillaActual());
  if (paginaActual > paginas.length - 1) {
    paginaActual = paginas.length - 1;
  }
}

paginas = construirPaginasRevision("check360");

function seleccionarPlantilla(tipo) {
  datos.tipoRevision = normalizarTipoRevision(tipo);
  actualizarPaginasRevision();
  guardarBorrador();
  pintarPagina();
}

function pintarSelectorPlantilla() {
  const plantillaActual = obtenerPlantillaActual();
  return `
    <div class="selector-plantilla" aria-label="Tipo de revisión">
      <button type="button" class="plantilla-card ${plantillaActual === "check360" ? "activa" : ""}" onclick="seleccionarPlantilla('check360')">
        <span class="plantilla-etiqueta">${plantillaActual === "check360" ? "Activo" : "Completo"}</span>
        <strong>Check360</strong>
        <small>Revisión completa de tienda</small>
      </button>
      <button type="button" class="plantilla-card ${plantillaActual === "check180" ? "activa" : ""}" onclick="seleccionarPlantilla('check180')">
        <span class="plantilla-etiqueta secundaria">${plantillaActual === "check180" ? "Activo" : "Rápido"}</span>
        <strong>Check180</strong>
        <small>Oculta Club Familia y bloque legal final</small>
      </button>
    </div>
  `;
}

const respuestasScore = [
  { texto: "Bien", valor: 3 },
  { texto: "Regular", valor: 2 },
  { texto: "Mal", valor: 1 }
];

let paginaActual = 0;
let datos = {};

/* Guarda el progreso actual (página + respuestas) en el dispositivo.
   Las fotos NO se guardan aquí: ya se guardan aparte en IndexedDB en el
   momento en que se seleccionan (ver guardarPagina), así que en "datos"
   solo queda el texto "[FOTO_GUARDADA_EN_DISPOSITIVO]", que es ligero. */
function guardarBorrador() {
  try {
    localStorage.setItem(
      CLAVE_BORRADOR,
      JSON.stringify({ paginaActual, datos })
    );
  } catch (error) {
    console.error("No se pudo guardar el borrador en este paso:", error);
  }
}

/* Recupera el borrador si existe (por ejemplo, tras recargar la app
   después de un cierre inesperado) para no perder lo ya rellenado. */
function cargarBorrador() {
  try {
    const guardado = localStorage.getItem(CLAVE_BORRADOR);

    if (guardado) {
      const datosGuardados = JSON.parse(guardado);
      datos = datosGuardados.datos || {};
      datos.tipoRevision = normalizarTipoRevision(datos.tipoRevision);
      paginaActual = datosGuardados.paginaActual || 0;
    }
  } catch (error) {
    console.error("No se pudo leer el borrador guardado:", error);
  }

  // Toda visita, desde que se empieza a rellenar, tiene un idVisita estable
  // desde el primer momento: así las fotos que se vayan guardando en
  // IndexedDB durante la encuesta usan siempre la misma clave.
  if (!datos.idVisita) {
    datos.idVisita = crearIdVisita();
  }

  datos.tipoRevision = normalizarTipoRevision(datos.tipoRevision);
  actualizarPaginasRevision();
}

function borrarBorrador() {
  localStorage.removeItem(CLAVE_BORRADOR);
}

cargarBorrador();

const contenedor = document.getElementById("formulario");
const resultado = document.getElementById("resultado");

function debounce(fn, espera) {
  let temporizador;
  return function (...args) {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn.apply(this, args), espera);
  };
}

const guardarBorradorConRetraso = debounce(guardarBorrador, 500);

/* GUARDADO EN VIVO: no esperamos a "Siguiente"/"Atrás" para no perder nada
   si la app se refresca o se cierra a mitad de rellenar una página. */
contenedor.addEventListener("input", (evento) => {
  const el = evento.target;
  if (!el.name || el.type === "file" || el.type === "radio") return;

  datos[el.name] = el.value;
  guardarBorradorConRetraso();
});

contenedor.addEventListener("change", async (evento) => {
  const el = evento.target;
  if (!el.name) return;

  if (el.type === "radio") {
    if (el.checked) {
      datos[el.name] = el.value;
      datos[el.name + "_texto"] = el.dataset.texto;
      guardarBorrador();
    }
    return;
  }

  if (el.type === "file") {
    const archivo = el.files[0];
    if (!archivo) return;

    // La foto se guarda en IndexedDB justo al elegirla, no al pulsar "Siguiente".
    const base64 = await leerArchivoComoBase64(archivo);
    await guardarFotoIndexedDB(datos.idVisita, el.name, base64);

    datos[el.name] = "[FOTO_GUARDADA_EN_DISPOSITIVO]";
    datos[el.name + "_nombre"] = archivo.name;
    datos[el.name + "_tipo"] = archivo.type;

    guardarBorrador();
    pintarPagina(); // repinta para mostrar "Foto cargada correctamente"
    return;
  }

  // select y otros campos que solo disparan "change"
  datos[el.name] = el.value;
  guardarBorrador();
});

/* Evita que texto escrito por el usuario rompa el HTML al re-pintar el formulario */
function escapeHTML(valor) {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function hayBorradorActivo() {
  return Boolean(localStorage.getItem(CLAVE_BORRADOR));
}

function nombreSocioActual() {
  const valor = datos.socio || "";
  return valor ? escapeHTML(valor) : "Sin tienda indicada";
}

function obtenerUltimaVisita() {
  const historial = obtenerHistorial();
  return historial.length ? historial[0] : null;
}

function mostrarInicio() {
  resultado.classList.add("oculto");
  contenedor.classList.remove("oculto");

  const pendientes = obtenerPendientes();
  const historial = obtenerHistorial();
  const ultima = obtenerUltimaVisita();
  const borrador = hayBorradorActivo();
  const fotosGuardadas = contarFotos();

  contenedor.innerHTML = `
    <section class="dashboard-v2">
      <div class="dashboard-hero-v2">
        <div>
          <span class="etiqueta-paso">Panel de trabajo</span>
          <h2>CoviTools</h2>
          <p>Gestiona Check360, Check180, tickets, incidencias, historial y actualizaciones desde un único inicio.</p>
        </div>
        <div class="version-pill-v2">
          <strong>${VERSION_APP}</strong>
          <span>instalada</span>
        </div>
      </div>

      <div class="dashboard-section-v2">
        <div class="dashboard-section-title">
          <span>Herramientas de trabajo</span>
        </div>
        <div class="dashboard-grid-v2 herramientas-grid">
          <button type="button" class="modulo-card principal" onclick="abrirCheck360()">
            <span class="modulo-icono">360</span>
            <strong>Check360</strong>
            <small>Modelo tienda Covirán completo</small>
          </button>

          <button type="button" class="modulo-card" onclick="abrirCheck180()">
            <span class="modulo-icono">180</span>
            <strong>Check180</strong>
            <small>Revisión rápida sin bloque legal final</small>
          </button>

          <button type="button" class="modulo-card modulo-proximamente" onclick="abrirModuloTickets()">
            <span class="modulo-icono">🧾</span>
            <strong>Tickets</strong>
            <small>Dietas, parking y gastos asociados</small>
          </button>

          <button type="button" class="modulo-card modulo-proximamente" onclick="abrirModuloIncidencias()">
            <span class="modulo-icono">⚠</span>
            <strong>Incidencias</strong>
            <small>Registro y seguimiento de incidencias</small>
          </button>
        </div>
      </div>

      <div class="dashboard-section-v2 gestion-grid-wrap">
        <div class="dashboard-section-title">
          <span>Gestión de la app</span>
          <small>Estado, versiones y datos guardados</small>
        </div>
        <div class="dashboard-grid-v2 gestion-grid">
          ${borrador && datos.socio ? `
            <button type="button" class="modulo-card gestion-card continuar-card" onclick="continuarVisita()">
              <span class="modulo-icono">↩</span>
              <strong>Continuar chequeo</strong>
              <small>${nombreSocioActual()}</small>
            </button>` : ""}

          <button type="button" class="modulo-card gestion-card" onclick="mostrarHistorial()">
            <span class="modulo-icono">☰</span>
            <strong>Historial</strong>
            <small>${historial.length} chequeos guardados</small>
          </button>

          <button type="button" class="modulo-card gestion-card" onclick="mostrarConfiguracion()">
            <span class="modulo-icono">↻</span>
            <strong>Actualizaciones</strong>
            <small>Buscar nueva versión</small>
          </button>
        </div>
      </div>

      <div class="dashboard-stats-v2">
        <div><strong>${pendientes.length}</strong><span>envíos pendientes</span></div>
        <div><strong>${historial.length}</strong><span>chequeos guardados</span></div>
        <div><strong>${VERSION_APP}</strong><span>versión instalada</span></div>
      </div>

      <div class="ultima-visita-v2">
        <h3>Último chequeo</h3>
        ${ultima ? `
          <div class="historial-item compacta">
            <div class="historial-main">
              <strong>${escapeHTML(ultima.socio || "Sin tienda indicada")}</strong>
              <small>${formatearFechaLocal(ultima.fecha)} · ${escapeHTML(ultima.estado || "pendiente")}</small>
            </div>
            <span class="estado-chip ${ultima.estado === "enviado" ? "enviado" : "pendiente"}">${escapeHTML(ultima.estado || "pendiente")}</span>
          </div>` : `
          <div class="empty-state"><strong>Aún no hay visitas en el historial</strong><span>Cuando finalices un chequeo aparecerá aquí.</span></div>`}
      </div>
    </section>
  `;
}


function volverAlPanelTrabajo() {
  guardarBorrador();
  mostrarInicio();
  window.scrollTo(0, 0);
}

function obtenerInfoBorrador() {
  try {
    const guardado = localStorage.getItem(CLAVE_BORRADOR);
    if (!guardado) return null;

    const borrador = JSON.parse(guardado);
    const datosBorrador = borrador.datos || {};
    datosBorrador.tipoRevision = normalizarTipoRevision(datosBorrador.tipoRevision);
    const paginasBorrador = construirPaginasRevision(datosBorrador.tipoRevision);
    const paginaBorrador = Number.isInteger(borrador.paginaActual) ? borrador.paginaActual : 0;
    const paginaSegura = Math.min(Math.max(paginaBorrador, 0), paginasBorrador.length - 1);

    return {
      paginaActual: paginaSegura,
      datos: datosBorrador,
      socio: datosBorrador.socio || "",
      tituloPagina: paginasBorrador[paginaSegura]?.titulo || "Datos de contacto",
      seccion: paginaSegura + 1,
      totalSecciones: paginasBorrador.length,
      tipoRevision: datosBorrador.tipoRevision,
      tipoChequeo: obtenerEtiquetaRevision(datosBorrador.tipoRevision)
    };
  } catch (error) {
    console.error("No se pudo interpretar el borrador guardado:", error);
    return null;
  }
}

function abrirCheck360() {
  const info = obtenerInfoBorrador();

  if (info) {
    mostrarBorradorEnCurso(info);
    return;
  }

  empezarNuevaVisita("check360");
}

function abrirCheck180() {
  const info = obtenerInfoBorrador();

  if (info) {
    mostrarBorradorEnCurso(info);
    return;
  }

  empezarNuevaVisita("check180");
}

function mostrarBorradorEnCurso(info) {
  resultado.classList.add("oculto");
  contenedor.classList.remove("oculto");

  const tienda = info.socio ? escapeHTML(info.socio) : "Aún sin tienda indicada";

  contenedor.innerHTML = `
    <section class="dashboard-v2">
      <div class="dashboard-hero-v2">
        <div>
          <span class="etiqueta-paso">${escapeHTML(info.tipoChequeo || "CHECK 360")} en curso</span>
          <h2>Hay un chequeo sin finalizar</h2>
          <p>Puedes retomarlo exactamente donde lo dejaste, descartarlo y empezar uno nuevo, o volver al panel principal.</p>
        </div>
        <div class="version-pill-v2">
          <strong>${info.seccion}/${info.totalSecciones || paginas.length}</strong>
          <span>sección</span>
        </div>
      </div>

      <div class="update-panel borrador-panel">
        <h3>${tienda}</h3>
        <p><strong>Última sección:</strong> ${escapeHTML(info.tituloPagina)}</p>
        <p>El borrador se guarda en este dispositivo para no perder respuestas ni fotos si cierras la app.</p>
      </div>

      <div class="nav nav-borrador">
        <button type="button" class="primario" onclick="continuarVisita()">Continuar chequeo</button>
        <button type="button" class="secundario" onclick="descartarBorradorYEmpezar('${info.tipoRevision || "check360"}')">Descartar y empezar nuevo</button>
        <button type="button" class="secundario" onclick="mostrarInicio()">Volver al inicio</button>
      </div>
    </section>
  `;

  window.scrollTo(0, 0);
}

function empezarNuevaVisita(tipo = "check360") {
  borrarBorrador();
  datos = {
    idVisita: crearIdVisita(),
    tipoRevision: normalizarTipoRevision(tipo)
  };
  paginaActual = 0;
  actualizarPaginasRevision();
  guardarBorrador();
  pintarPagina();
  window.scrollTo(0, 0);
}

function descartarBorradorYEmpezar(tipo = "check360") {
  const confirma = confirm("Se borrará el chequeo que está en curso y se empezará uno nuevo.\n\n¿Quieres continuar?");
  if (!confirma) return;
  empezarNuevaVisita(tipo);
}

function continuarVisita() {
  cargarBorrador();
  actualizarPaginasRevision();
  pintarPagina();
  window.scrollTo(0, 0);
}

function mostrarModuloProximamente(nombre, descripcion) {
  resultado.classList.remove("oculto");
  contenedor.classList.add("oculto");
  resultado.innerHTML = `
    <div class="pantalla-config modulo-en-preparacion">
      <div class="topbar-visita">
        <div>
          <span class="etiqueta-paso">Módulo en preparación</span>
          <h2>${escapeHTML(nombre)}</h2>
        </div>
      </div>
      <div class="update-panel">
        <h3>${escapeHTML(nombre)}</h3>
        <p>${escapeHTML(descripcion)}</p>
        <p>El acceso queda incorporado al panel principal para que podamos completar este módulo sin cambiar la estructura de la app.</p>
      </div>
      <div class="nav">
        <button type="button" class="primario" onclick="mostrarInicio()">Volver al panel</button>
      </div>
    </div>
  `;
  window.scrollTo(0, 0);
}

function abrirModuloCheck180() {
  abrirCheck180();
}

function abrirModuloTickets() {
  mostrarTicketsInicio();
}

function abrirModuloIncidencias() {
  mostrarModuloProximamente("Incidencias", "Aquí registraremos incidencias de tienda, seguimiento y estado de resolución.");
}

function pintarPagina() {
  actualizarPaginasRevision();
  const pagina = paginas[paginaActual];
  const pendientes = obtenerPendientes();
  const nombreRevision = obtenerNombreRevision();
  const etiquetaRevision = obtenerEtiquetaRevision();
  const progreso = Math.round(((paginaActual + 1) / paginas.length) * 100);
  const fotosGuardadas = contarFotos();

  contenedor.innerHTML = `
    <div class="topbar-visita topbar-visita-con-salida">
      <div>
        <span class="etiqueta-paso">${nombreRevision} · Sección ${paginaActual + 1} de ${paginas.length}</span>
        <h2>${pagina.titulo}</h2>
      </div>
      <div class="topbar-actions-visita">
        <button type="button" class="boton-inicio-visita" onclick="volverAlPanelTrabajo()">Inicio</button>
        <div class="porcentaje-progreso"><strong>${progreso}%</strong><span>completado</span></div>
      </div>
    </div>

    <div class="barra-progreso" aria-label="Progreso de la visita">
      <div style="width: ${progreso}%"></div>
    </div>

    ${pagina.imagen ? `<img class="imagen-bloque" src="${pagina.imagen}" alt="${pagina.titulo}">` : ""}

    ${
      pagina.botonActualizar
        ? `
          <div class="panel-inicio">
            <div class="hero-card">
              <div class="hero-icon">${nombreRevision === "Check180" ? "C180" : "C360"}</div>
              <div>
                <span class="subtitulo-panel">Herramienta de campo</span>
                <h3>${nombreRevision}</h3>
                <p>Completa la revisión, guarda fotografías y envía el informe ${etiquetaRevision} al correo indicado.</p>
              </div>
            </div>

            ${pintarSelectorPlantilla()}

            <div class="metricas-grid">
              <div class="quick-card">
                <span class="quick-icon">Pendientes</span>
                <strong>${pendientes.length}</strong>
                <small>visitas por enviar</small>
              </div>
            </div>
          </div>
          <div class="version-box">
            <p><strong>Versión instalada:</strong> ${VERSION_APP}</p>
            <button type="button" class="boton-actualizar" onclick="mostrarHistorial()">Historial de chequeos</button>
            <button type="button" class="boton-actualizar" onclick="actualizarVersion()">Comprobar actualización</button>
            <button type="button" class="boton-actualizar" onclick="reenviarPendientesManual()">Reenviar pendientes (${pendientes.length})</button>
            <button type="button" class="boton-actualizar boton-config" onclick="mostrarConfiguracion()">Configuración</button>
          </div>
        `
        : ""
    }

    <div class="campos-wrapper">
      ${pagina.campos.map(campo => pintarCampo(campo)).join("")}
    </div>

    <div class="nav">
      ${paginaActual > 0 ? `<button type="button" class="secundario" onclick="anterior()">Atrás</button>` : ""}

      ${
        paginaActual < paginas.length - 1
          ? `<button type="button" class="primario" onclick="siguiente()">Siguiente →</button>`
          : `<button type="button" class="primario" onclick="finalizar()">Calcular diagnóstico</button>`
      }
    </div>
  `;
}

function pintarCampo(campo) {
  const ayuda = campo.ayuda ? `<div class="ayuda">${campo.ayuda}</div>` : "";

  if (campo.tipo === "texto" || campo.tipo === "email") {
    return `
      <div class="campo">
        <div class="pregunta">${campo.pregunta}</div>
        ${ayuda}
        <input type="${campo.tipo === "email" ? "email" : "text"}" name="${campo.id}" value="${escapeHTML(datos[campo.id])}">
      </div>
    `;
  }

  if (campo.tipo === "textarea") {
    return `
      <div class="campo">
        <div class="pregunta">${campo.pregunta}</div>
        ${ayuda}
        <textarea name="${campo.id}">${escapeHTML(datos[campo.id])}</textarea>
      </div>
    `;
  }

  if (campo.tipo === "select") {
    return `
      <div class="campo">
        <div class="pregunta">${campo.pregunta}</div>
        ${ayuda}
        <select name="${campo.id}">
          <option value="">Selecciona la respuesta</option>
          ${campo.opciones.map(opcion => `
            <option value="${opcion}" ${datos[campo.id] === opcion ? "selected" : ""}>${opcion}</option>
          `).join("")}
        </select>
      </div>
    `;
  }

  if (campo.tipo === "foto") {
    return `
      <div class="campo campo-foto">
        <div class="pregunta">${campo.pregunta}</div>
        ${ayuda}

        <div class="foto-botones">
          <button type="button" class="boton-foto primario" onclick="capturarFoto('${campo.id}', 'camera')"><span>📷</span><strong>Hacer foto</strong><small>Usar cámara</small></button>
          <button type="button" class="boton-foto secundario" onclick="capturarFoto('${campo.id}', 'photos')"><span>🖼</span><strong>Elegir de galería</strong><small>Seleccionar imagen</small></button>
        </div>

        <input
          class="foto-fallback"
          type="file"
          accept="image/*"
          name="${campo.id}"
          data-foto-fallback="${campo.id}">

        ${
          datos[campo.id]
            ? `<p class="foto-cargada">Foto cargada correctamente</p>`
            : `<p class="ayuda">Puedes hacer una foto desde el móvil o adjuntar una imagen desde la galería.</p>`
        }
      </div>
    `;
  }

  if (campo.tipo === "score") {
    return `
      <div class="campo">
        <div class="pregunta">${campo.pregunta}</div>
        ${ayuda}
        <div class="opciones">
          ${respuestasScore.map(opcion => `
            <label class="opcion-score opcion-${opcion.texto.toLowerCase()}">
              <input type="radio" name="${campo.id}" value="${opcion.valor}" data-texto="${opcion.texto}" ${datos[campo.id] == opcion.valor ? "checked" : ""}>
              <span>${opcion.texto}</span>
            </label>
          `).join("")}
        </div>
      </div>
    `;
  }

  return "";
}

function comprimirImagenBase64(base64, opciones = {}) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const maxAncho = opciones.maxAncho || 1200;
    const calidad = opciones.calidad || 0.65;

    img.onload = function() {
      const canvas = document.createElement("canvas");
      const escala = Math.min(1, maxAncho / img.width);

      canvas.width = Math.round(img.width * escala);
      canvas.height = Math.round(img.height * escala);

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      resolve(canvas.toDataURL("image/jpeg", calidad));
    };

    img.onerror = reject;
    img.src = base64;
  });
}

function leerArchivoComoBase64(archivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async function(event) {
      try {
        const imagenComprimida = await comprimirImagenBase64(event.target.result);
        resolve(imagenComprimida);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = reject;
    reader.readAsDataURL(archivo);
  });
}

async function guardarFotoBase64(nombreCampo, base64, origen) {
  const imagenComprimida = await comprimirImagenBase64(base64);

  await guardarFotoIndexedDB(datos.idVisita, nombreCampo, imagenComprimida);

  datos[nombreCampo] = "[FOTO_GUARDADA_EN_DISPOSITIVO]";
  datos[nombreCampo + "_nombre"] = `${nombreCampo}_${Date.now()}.jpg`;
  datos[nombreCampo + "_tipo"] = "image/jpeg";
  datos[nombreCampo + "_origen"] = origen || "android";

  guardarBorrador();
  pintarPagina();
}

async function capturarFoto(nombreCampo, origen) {
  try {
    const capacitor = window.Capacitor;
    const cameraPlugin = capacitor?.Plugins?.Camera;

    if (cameraPlugin) {
      const foto = await cameraPlugin.getPhoto({
        quality: 75,
        allowEditing: false,
        resultType: "dataUrl",
        source: origen === "camera" ? "CAMERA" : "PHOTOS",
        correctOrientation: true,
        saveToGallery: false
      });

      if (foto?.dataUrl) {
        await guardarFotoBase64(nombreCampo, foto.dataUrl, origen);
        return;
      }
    }

    const inputFallback = document.querySelector(`input[data-foto-fallback="${nombreCampo}"]`);
    if (inputFallback) inputFallback.click();
  } catch (error) {
    console.error("No se pudo capturar/seleccionar la foto", error);
    alert("No se pudo abrir la cámara o la galería. Revisa los permisos de la app.");
  }
}

async function guardarPagina() {
  const elementos = contenedor.querySelectorAll("input, textarea, select");

  for (const elemento of elementos) {
    if (elemento.type === "radio") {
      if (elemento.checked) {
        datos[elemento.name] = elemento.value;
        datos[elemento.name + "_texto"] = elemento.dataset.texto;
      }
    } else if (elemento.type === "file") {
      const archivo = elemento.files[0];

      if (archivo) {
        const base64 = await leerArchivoComoBase64(archivo);

        // La foto se guarda en IndexedDB AHORA, no se espera al final de la
        // encuesta. Así, si algo falla más adelante, la foto ya está a salvo.
        await guardarFotoIndexedDB(datos.idVisita, elemento.name, base64);

        datos[elemento.name] = "[FOTO_GUARDADA_EN_DISPOSITIVO]";
        datos[elemento.name + "_nombre"] = archivo.name;
        datos[elemento.name + "_tipo"] = archivo.type;
      }
    } else {
      datos[elemento.name] = elemento.value;
    }
  }

  // Tras cada página (Siguiente/Atrás) dejamos el progreso guardado en el
  // dispositivo, para no perder la encuesta si pasa algo más adelante.
  guardarBorrador();
}

/* Devuelve true si el email es válido; si no, avisa y deja al usuario en la página de contacto */
function validarEmailObligatorio() {
  if (!datos.email || !datos.email.includes("@")) {
    alert("Debes indicar un correo válido para recibir el informe.");
    paginaActual = 0;
    pintarPagina();
    window.scrollTo(0, 0);
    return false;
  }
  return true;
}

async function siguiente() {
  await guardarPagina();
  if (!validarEmailObligatorio()) return;
  paginaActual++;
  pintarPagina();
  window.scrollTo(0, 0);
}

async function anterior() {
  await guardarPagina();
  paginaActual--;
  pintarPagina();
  window.scrollTo(0, 0);
}

function obtenerValorCampo(campo) {
  if (campo.tipo === "score") {
    const valor = Number(datos[campo.id]);
    if (!valor) return null;
    return { valor, maximo: 3, texto: datos[campo.id + "_texto"] || "" };
  }

  if (campo.puntos) {
    const respuesta = datos[campo.id];
    if (!respuesta || !(respuesta in campo.puntos)) return null;

    const valor = campo.puntos[respuesta];

    if (valor === null || valor === undefined) return null;

    const maximo = Math.max(
      ...Object.values(campo.puntos).filter(v => typeof v === "number")
    );

    return { valor, maximo, texto: respuesta };
  }

  return null;
}

function valorarTienda(porcentaje, puntosCriticos, integracionTienda) {
  const integracionNum = parseFloat(
    String(integracionTienda || "")
      .replace("%", "")
      .replace(",", ".")
  );

  let estadoIntegracion = "";
  let estadoScoring = "";
  let estadoFinal = "";

  if (!isNaN(integracionNum)) {
    if (integracionNum < 60) {
      estadoIntegracion = "🔴 Integración crítica";
    } else if (integracionNum < 80) {
      estadoIntegracion = "🟡 Integración mejorable";
    } else {
      estadoIntegracion = "🟢 Integración excelente";
    }
  } else {
    estadoIntegracion = "Sin dato de integración";
  }

  if (porcentaje >= 85) {
    estadoScoring = "🟢 Operativa excelente";
  } else if (porcentaje >= 70) {
    estadoScoring = "🟡 Operativa mejorable";
  } else {
    estadoScoring = "🔴 Operativa crítica";
  }

  if (!isNaN(integracionNum)) {
    if (integracionNum < 60) {
      estadoFinal = "🔴 Crítico";
    } else if (integracionNum < 80) {
      estadoFinal = "🟡 Mejorable";
    } else {
      estadoFinal = porcentaje >= 85 ? "🟢 Excelente" : porcentaje >= 70 ? "🟡 Mejorable" : "🔴 Crítico";
    }
  } else {
    estadoFinal = porcentaje >= 85 ? "🟢 Excelente" : porcentaje >= 70 ? "🟡 Mejorable" : "🔴 Crítico";
  }

  return {
    puntuacionFinal: porcentaje.toFixed(2),
    estado: estadoFinal,
    estadoIntegracion,
    estadoScoring
  };
}

async function finalizar() {
  await guardarPagina();
  if (!validarEmailObligatorio()) return;
  actualizarPaginasRevision();
  const tipoRevisionActual = obtenerPlantillaActual();
  const etiquetaRevisionActual = obtenerEtiquetaRevision(tipoRevisionActual);
  const camposEvaluables = paginas.flatMap(pagina =>
    pagina.campos.map(campo => ({ ...campo, categoria: pagina.categoria || "General" }))
  );

  let total = 0;
  let maximo = 0;
  let puntosCriticos = [];
  let puntuacionBloques = {};

  camposEvaluables.forEach(campo => {
    const evaluacion = obtenerValorCampo(campo);
    if (!evaluacion) return;

    total += evaluacion.valor;
    maximo += evaluacion.maximo;

    if (!puntuacionBloques[campo.categoria]) {
      puntuacionBloques[campo.categoria] = { total: 0, maximo: 0, mal: 0 };
    }

    puntuacionBloques[campo.categoria].total += evaluacion.valor;
    puntuacionBloques[campo.categoria].maximo += evaluacion.maximo;

    if (evaluacion.valor <= 1) {
      puntosCriticos.push({
        categoria: campo.categoria,
        pregunta: campo.pregunta,
        respuesta: evaluacion.texto
      });

      puntuacionBloques[campo.categoria].mal++;
    }
  });

  const porcentaje = maximo > 0 ? (total / maximo) * 100 : 0;
  const valoracion = valorarTienda(porcentaje, puntosCriticos, datos.integracion_tienda);

  const datosFinales = {
    ...datos,
    idVisita: datos.idVisita || crearIdVisita(),
    fechaCreacionLocal: new Date().toISOString(),
    tipoRevision: tipoRevisionActual,
    tipoRevisionNombre: obtenerNombreRevision(tipoRevisionActual),
    tipoChequeo: etiquetaRevisionActual,
    tituloInforme: etiquetaRevisionActual,
    versionApp: VERSION_APP,
    score: valoracion.puntuacionFinal,
    puntuacion: `${total} / ${maximo}`,
    estado: valoracion.estado,
    estadoIntegracion: valoracion.estadoIntegracion,
    estadoScoring: valoracion.estadoScoring,
    puntosCriticos,
    bloques: puntuacionBloques
  };

  const datosParaGuardar = await separarFotosParaGuardar(datosFinales);
  guardarVisitaPendiente(datosParaGuardar);
  registrarHistorial(datosFinales, "pendiente");

  // A partir de aquí la visita ya vive en la cola de pendientes (con sus
  // fotos en IndexedDB), así que el borrador "en progreso" ya no hace falta.
  borrarBorrador();

  enviarVisitaPendiente(datosFinales.idVisita);

  datos = { idVisita: crearIdVisita() };
  paginaActual = 0;
  resultado.classList.remove("oculto");
  resultado.innerHTML = `
    <div class="toast-guardado">
      <strong>Chequeo guardado correctamente</strong>
      <span>La visita se ha añadido al historial y se enviará automáticamente cuando haya conexión.</span>
    </div>
  `;
  setTimeout(() => {
    resultado.innerHTML = "";
    resultado.classList.add("oculto");
    mostrarInicio();
  }, 1200);
  window.scrollTo(0, 0);
}

function obtenerHistorial() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_HISTORIAL) || "[]");
  } catch (error) {
    console.error("No se pudo leer el historial", error);
    return [];
  }
}

function guardarHistorial(historial) {
  localStorage.setItem(CLAVE_HISTORIAL, JSON.stringify(historial));
}

function registrarHistorial(datosFinales, estado = "pendiente") {
  const historial = obtenerHistorial();
  const resumen = {
    idVisita: datosFinales.idVisita,
    socio: datosFinales.socio || "Sin socio",
    poblacion: datosFinales.poblacion || "",
    interlocutor: datosFinales.interlocutor || "",
    email: datosFinales.email || "",
    fecha: datosFinales.fechaCreacionLocal || new Date().toISOString(),
    fechaEnvio: datosFinales.fechaEnvio || "",
    estado,
    tipoRevision: datosFinales.tipoRevision || "check360",
    tipoChequeo: datosFinales.tipoChequeo || obtenerEtiquetaRevision(datosFinales.tipoRevision),
    score: datosFinales.score || "",
    valoracion: datosFinales.estado || "",
    versionApp: VERSION_APP
  };

  const indice = historial.findIndex(item => item.idVisita === resumen.idVisita);
  if (indice >= 0) {
    historial[indice] = { ...historial[indice], ...resumen };
  } else {
    historial.unshift(resumen);
  }

  guardarHistorial(historial.slice(0, 250));
}

function actualizarEstadoHistorial(idVisita, estado) {
  const historial = obtenerHistorial();
  const item = historial.find(h => h.idVisita === idVisita);
  if (item) {
    item.estado = estado;
    if (estado === "enviado") item.fechaEnvio = new Date().toISOString();
    guardarHistorial(historial);
  }
}

function formatearFechaLocal(fechaIso) {
  if (!fechaIso) return "";
  try {
    return new Date(fechaIso).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return fechaIso;
  }
}

function filtrarHistorial(texto) {
  const q = String(texto || "").toLowerCase().trim();
  document.querySelectorAll(".historial-item").forEach(item => {
    const contenido = item.textContent.toLowerCase();
    item.style.display = !q || contenido.includes(q) ? "" : "none";
  });
}

function mostrarHistorial() {
  const historial = obtenerHistorial();
  const pendientes = new Set(obtenerPendientes().map(item => item.idVisita));

  resultado.classList.add("oculto");
  contenedor.classList.remove("oculto");

  contenedor.innerHTML = `
    <div class="topbar-visita">
      <div>
        <span class="etiqueta-paso">Historial de chequeos</span>
        <h2>Visitas guardadas</h2>
      </div>
      <div class="porcentaje-progreso"><strong>${historial.length}</strong><span>visitas</span></div>
    </div>

    <div class="historial-toolbar historial-toolbar-v2">
      <input type="text" class="buscador-historial" placeholder="Buscar por socio, tienda, fecha o estado…" oninput="filtrarHistorial(this.value)">
      <button type="button" class="boton-actualizar" onclick="mostrarInicio()">Inicio</button>
      <button type="button" class="boton-actualizar" onclick="reenviarPendientesManual()">Reenviar pendientes</button>
    </div>

    ${historial.length === 0
      ? `<div class="empty-state"><strong>No hay chequeos guardados.</strong><span>Finaliza una visita para que aparezca aquí.</span></div>`
      : `<div class="historial-lista">
          ${historial.map(item => {
            const estadoReal = pendientes.has(item.idVisita) ? "pendiente" : item.estado;
            const claseEstado = estadoReal === "enviado" ? "enviado" : "pendiente";
            return `
              <article class="historial-item">
                <div class="historial-main">
                  <strong>${escapeHTML(item.socio || "Sin tienda indicada")}</strong>
                  <small>${formatearFechaLocal(item.fecha)} · ${escapeHTML(item.tipoChequeo || "CHECK 360")}</small>
                  <small>${escapeHTML(item.poblacion || "")}</small>
                  <small>Score: ${escapeHTML(item.score || "-")} · ${escapeHTML(item.valoracion || "")}</small>
                </div>
                <div class="historial-actions">
                  <span class="estado-chip ${claseEstado}">${estadoReal === "enviado" ? "Enviado" : "Pendiente"}</span>
                  ${estadoReal !== "enviado" ? `<button type="button" class="boton-actualizar" onclick="enviarVisitaPendiente('${item.idVisita}')">Enviar</button>` : ""}
                </div>
              </article>`;
          }).join("")}
        </div>`}
  `;
  window.scrollTo(0, 0);
}

function crearIdVisita() {
  return "visita_" + Date.now() + "_" + Math.random().toString(36).substring(2, 10);
}

function obtenerPendientes() {
  return JSON.parse(localStorage.getItem(CLAVE_PENDIENTES) || "[]");
}

function guardarPendientes(pendientes) {
  localStorage.setItem(CLAVE_PENDIENTES, JSON.stringify(pendientes));
}

function guardarVisitaPendiente(datosFinales) {
  const pendientes = obtenerPendientes();

  const existe = pendientes.some(item => item.idVisita === datosFinales.idVisita);

  if (!existe) {
    pendientes.push({
      idVisita: datosFinales.idVisita,
      fechaGuardado: new Date().toISOString(),
      datos: datosFinales
    });

    guardarPendientes(pendientes);
  }
}

function eliminarVisitaPendiente(idVisita) {
  const pendientes = obtenerPendientes().filter(item => item.idVisita !== idVisita);
  guardarPendientes(pendientes);
}

/* Evita que la misma visita se envíe dos veces a la vez si coinciden
   varios disparadores de reintento (online + temporizador + botón manual) */
const enviosEnCurso = new Set();

async function enviarVisitaPendiente(idVisita) {
  if (enviosEnCurso.has(idVisita)) return; // ya se está intentando enviar esta visita

  const pendientes = obtenerPendientes();
  const item = pendientes.find(p => p.idVisita === idVisita);

  if (!item) return;

  enviosEnCurso.add(idVisita);

  try {
    const datosConFotos = await reconstruirFotosParaEnviar(item.datos);

    const respuesta = await fetch(URL_APPS_SCRIPT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(datosConFotos)
    });

    if (!respuesta.ok) {
      throw new Error("El servidor respondió con error HTTP " + respuesta.status);
    }

    // IMPORTANTE: solo damos la visita por enviada si el servidor lo confirma
    // explícitamente con { ok: true }. El Apps Script debe devolver eso.
    // Si no podemos confirmarlo, NO se borra nada: se reintentará más tarde.
    let confirmado = false;
    try {
      const resultado = await respuesta.json();
      confirmado = !!(resultado && resultado.ok === true);
    } catch (errorParseo) {
      console.warn(
        "La respuesta del Apps Script no es JSON válido. Revisa que devuelva { ok: true }.",
        errorParseo
      );
    }

    if (!confirmado) {
      throw new Error("El servidor no confirmó el guardado de la visita " + idVisita);
    }

    actualizarEstadoHistorial(idVisita, "enviado");
    eliminarVisitaPendiente(idVisita);
    await borrarFotosIndexedDB(idVisita);
    pintarPagina();
    console.log("Visita enviada y confirmada por el servidor:", idVisita);

  } catch (error) {
    // Cualquier fallo (sin red, servidor caído, error de Apps Script, etc.)
    // deja la visita intacta en la cola de pendientes para reintentar después.
    console.error("No se pudo confirmar el envío. Sigue pendiente:", idVisita, error);
  } finally {
    enviosEnCurso.delete(idVisita);
  }
}

function reenviarPendientes() {
  if (navigator.onLine === false) return; // sin conexión, ni lo intentamos
  const pendientes = obtenerPendientes();

  pendientes.forEach(item => {
    enviarVisitaPendiente(item.idVisita);
  });
}

function reenviarPendientesManual() {
  reenviarPendientes();
  alert("Intentando reenviar visitas pendientes.");
  pintarPagina();
}

/* Varios disparadores de reintento, porque el evento "online" del navegador
   no es 100% fiable (puede haber conexión "aparente" sin acceso real):
   - al recuperar conexión
   - al volver a abrir/enfocar la app
   - cada 30s mientras la app esté abierta, como red de seguridad */
window.addEventListener("online", reenviarPendientes);

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    reenviarPendientes();
    comprobarActualizacionAlAbrir();
  }
});

setInterval(reenviarPendientes, 30000);


function contarFotos() {
  return Object.keys(datos).filter(key =>
    key.startsWith("foto_") &&
    !key.endsWith("_nombre") &&
    !key.endsWith("_tipo") &&
    !!datos[key]
  ).length;
}

function reiniciarEncuesta() {
  const tipoActual = obtenerPlantillaActual();
  borrarBorrador();
  datos = { idVisita: crearIdVisita(), tipoRevision: tipoActual };
  paginaActual = 0;
  actualizarPaginasRevision();
  resultado.innerHTML = "";
  resultado.classList.add("oculto");
  pintarPagina();
  window.scrollTo(0, 0);
}

function compararVersiones(a, b) {
  const pa = String(a || "0").split(".").map(n => parseInt(n, 10) || 0);
  const pb = String(b || "0").split(".").map(n => parseInt(n, 10) || 0);
  const longitud = Math.max(pa.length, pb.length);

  for (let i = 0; i < longitud; i++) {
    const va = pa[i] || 0;
    const vb = pb[i] || 0;
    if (va > vb) return 1;
    if (va < vb) return -1;
  }

  return 0;
}

function limpiarTextoActualizacion(texto) {
  return escapeHTML(texto || "").replace(/\n/g, "<br>");
}

function construirUrlSinCache(urlBase) {
  const separador = urlBase.includes("?") ? "&" : "?";
  return `${urlBase}${separador}ts=${Date.now()}&rnd=${Math.random().toString(36).slice(2)}`;
}

async function fetchJsonSinCache(urlBase, opciones = {}) {
  const respuesta = await fetch(construirUrlSinCache(urlBase), {
    method: "GET",
    cache: "no-store",
    headers: {
      "Accept": "application/json",
      "Cache-Control": "no-cache, no-store, max-age=0",
      "Pragma": "no-cache",
      ...(opciones.headers || {})
    }
  });

  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status}`);
  }

  return respuesta.json();
}

async function consultarActualizacion() {
  const info = await fetchJsonSinCache(UPDATE_MANIFEST_RAW_URL);

  if (info && info.version) {
    guardarUltimaVersionConsultada(info, "github-raw");
    return info;
  }

  throw new Error("GitHub RAW no devolvió una versión válida.");
}
function guardarUltimaVersionConsultada(info, fuente) {
  localStorage.setItem("covitools_ultima_version_json", JSON.stringify({
    fecha: new Date().toISOString(),
    fuente,
    version: info.version || "",
    versionCode: info.versionCode || 0
  }));
}

async function abrirUrlExterna(url) {
  const browserPlugin = window.Capacitor?.Plugins?.Browser;

  if (browserPlugin?.open) {
    await browserPlugin.open({ url });
    return;
  }

  window.open(url, "_system");
}

function renderizarEstadoActualizacion(estadoHtml) {
  const pendientes = obtenerPendientes().length;

  resultado.classList.remove("oculto");
  resultado.innerHTML = `
    <div class="pantalla-config">
      <div class="topbar-visita">
        <div>
          <span class="etiqueta-paso">Centro de actualizaciones</span>
          <h2>CoviTools</h2>
        </div>
        <div class="porcentaje-progreso"><strong>${VERSION_APP}</strong><span>instalada</span></div>
      </div>

      <div class="config-grid">
        <div class="config-card">
          <strong>Versión instalada</strong>
          <span>${VERSION_APP}</span>
        </div>
        <div class="config-card">
          <strong>Visitas pendientes</strong>
          <span>${pendientes}</span>
        </div>
      </div>

      <div class="update-panel">
        ${estadoHtml}
      </div>

      <div class="nav">
        <button type="button" class="secundario" onclick="cerrarPanelResultado()">Volver</button>
        <button type="button" class="primario" onclick="actualizarVersion()">Buscar actualización</button>
      </div>
    </div>
  `;

  // El estado/botón importante (resultado de la comprobación, botón de
  // descarga) queda más abajo en la pantalla: llevamos la vista ahí en vez
  // de dejarla arriba del todo, que es lo que pasaba antes.
  const zonaAccion = resultado.querySelector(".update-panel") || resultado.querySelector(".nav");
  if (zonaAccion) {
    zonaAccion.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function cerrarPanelResultado() {
  resultado.innerHTML = "";
  resultado.classList.add("oculto");
  pintarPagina();
}

function mostrarConfiguracion() {
  renderizarEstadoActualizacion(`
    <h3>Configuración</h3>
    <p>Desde aquí puedes comprobar si existe una nueva versión de CoviTools.</p>
  `);
}

async function descargarActualizacion(apkUrl) {
  if (!apkUrl) {
    alert("La actualización no tiene enlace de descarga.");
    return;
  }

  const confirma = confirm(
    "Se abrirá la descarga de la nueva APK.\n\n" +
    "Cuando Android termine la descarga, pulsa el archivo y confirma Actualizar."
  );

  if (!confirma) return;

  try {
    await abrirUrlExterna(apkUrl);
  } catch (error) {
    console.error("No se pudo abrir la URL de actualización", error);
    alert("No se pudo abrir la descarga. Revisa la conexión o prueba más tarde.");
  }
}

async function actualizarVersion() {
  renderizarEstadoActualizacion(`
    <h3>Buscando actualizaciones…</h3>
    <p>Consultando repositorio de actualizaciones.</p>
  `);

  try {
    const info = await consultarActualizacion();
    const versionServidor = info.version || "0.0.0";
    const hayNueva = compararVersiones(versionServidor, VERSION_APP) > 0;

    if (!hayNueva) {
      renderizarEstadoActualizacion(`
        <h3>La app está actualizada</h3>
        <p>Versión instalada: <strong>${VERSION_APP}</strong></p>
        <p>Última versión publicada: <strong>${escapeHTML(versionServidor)}</strong></p>
      `);
      return;
    }

    const mensaje = limpiarTextoActualizacion(info.message || "Hay una nueva versión disponible.");
    const obligatoria = info.mandatory ? `<span class="update-badge obligatorio">Obligatoria</span>` : `<span class="update-badge">Recomendada</span>`;

    renderizarEstadoActualizacion(`
      <div class="update-head">
        <h3>${escapeHTML(info.title || "Nueva versión disponible")}</h3>
        ${obligatoria}
      </div>
      <p><strong>Instalada:</strong> ${VERSION_APP}</p>
      <p><strong>Disponible:</strong> ${escapeHTML(versionServidor)}</p>
      <div class="update-message">${mensaje}</div>
      <button type="button" class="primario boton-ancho" onclick="descargarActualizacion('${escapeHTML(info.apkUrl || info.apk || "")}')">Descargar actualización</button>
      <p class="ayuda">Android pedirá confirmar la instalación. Es normal: fuera de Google Play o Intune no se puede actualizar en silencio.</p>
    `);
  } catch (error) {
    console.error("Error al comprobar actualizaciones", error);
    renderizarEstadoActualizacion(`
      <h3>No se pudo comprobar la actualización</h3>
      <p>${escapeHTML(error.message || "Error desconocido")}</p>
      <p class="ayuda">Comprueba que existe version.json en el repositorio y que el móvil tiene conexión. El sistema consulta GitHub RAW.</p>
    `);
  }
}

async function comprobarActualizacionAlAbrir() {
  try {
    const ultimaComprobacion = Number(localStorage.getItem("check360_ultima_comprobacion_update") || 0);
    const ahora = Date.now();
    const unaHora = 60 * 60 * 1000;

    if (ahora - ultimaComprobacion < unaHora) return;
    localStorage.setItem("check360_ultima_comprobacion_update", String(ahora));

    const info = await consultarActualizacion();
    if (compararVersiones(info.version, VERSION_APP) > 0) {
      const ver = confirm(`Nueva versión disponible: ${info.version}\n\n${info.title || "Actualización de Check360"}\n\n¿Quieres verla ahora?`);
      if (ver) actualizarVersion();
    }
  } catch (error) {
    console.warn("Comprobación automática de actualización omitida:", error.message || error);
  }
}
const DB_NAME = "Check360FotosDB";
const DB_STORE = "fotosPendientes";

function abrirDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = function(event) {
      const db = event.target.result;

      if (!db.objectStoreNames.contains(DB_STORE)) {
        db.createObjectStore(DB_STORE, { keyPath: "id" });
      }
    };

    request.onsuccess = function(event) {
      resolve(event.target.result);
    };

    request.onerror = function(event) {
      reject(event.target.error);
    };
  });
}

async function guardarFotoIndexedDB(idVisita, campo, dataUrl) {
  const db = await abrirDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    const store = tx.objectStore(DB_STORE);

    store.put({
      id: idVisita + "_" + campo,
      idVisita: idVisita,
      campo: campo,
      dataUrl: dataUrl
    });

    tx.oncomplete = function() {
      resolve();
    };

    tx.onerror = function(event) {
      reject(event.target.error);
    };
  });
}

async function leerFotoIndexedDB(idVisita, campo) {
  const db = await abrirDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readonly");
    const store = tx.objectStore(DB_STORE);
    const request = store.get(idVisita + "_" + campo);

    request.onsuccess = function() {
      resolve(request.result ? request.result.dataUrl : null);
    };

    request.onerror = function(event) {
      reject(event.target.error);
    };
  });
}

async function borrarFotosIndexedDB(idVisita) {
  const db = await abrirDB();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(DB_STORE, "readwrite");
    const store = tx.objectStore(DB_STORE);
    const request = store.openCursor();

    request.onsuccess = function(event) {
      const cursor = event.target.result;

      if (cursor) {
        if (cursor.value.idVisita === idVisita) {
          cursor.delete();
        }

        cursor.continue();
      }
    };

    tx.oncomplete = function() {
      resolve();
    };

    tx.onerror = function(event) {
      reject(event.target.error);
    };
  });
}

async function separarFotosParaGuardar(datosFinales) {
  const copia = { ...datosFinales };

  const fotos = Object.keys(copia).filter(key =>
    key.startsWith("foto_") &&
    String(copia[key]).startsWith("data:image")
  );

  for (const campo of fotos) {
    await guardarFotoIndexedDB(datosFinales.idVisita, campo, copia[campo]);
    copia[campo] = "[FOTO_GUARDADA_EN_DISPOSITIVO]";
  }

  return copia;
}

async function reconstruirFotosParaEnviar(datosGuardados) {
  const copia = { ...datosGuardados };

  const posiblesFotos = [
    "foto_fruteria",
    "foto_carniceria",
    "foto_charcuteria",
    "foto_panaderia",
    "foto_murales",
    "foto_congelados",
    "foto_resumen"
  ];

  for (const campo of posiblesFotos) {
    const foto = await leerFotoIndexedDB(datosGuardados.idVisita, campo);

    if (foto) {
      copia[campo] = foto;
    }
  }

  return copia;
}

/* Al arrancar la app, intentamos vaciar la cola de pendientes de inmediato */
reenviarPendientes();
comprobarActualizacionAlAbrir();
mostrarInicio();

/* =========================================================
   MÓDULO TICKETS v2.3.0
   Integrado en CoviTools sin tocar Check360/Check180.
   ========================================================= */
const TICKETS_DB_NAME = "ticketsSemanaDB_v10";
const TICKETS_STORE_NAME = "tickets";
let ticketsDB = null;
let ticketsManageSection = null;
let ticketsWeeklyOffset = 0;
let ticketsMonthlyOffset = 0;

const TICKETS_SECCIONES = ["Desayuno", "Comida", "Cena", "Tickets gasoil", "Parking"];
const TICKETS_SECCIONES_SEMANALES = ["Desayuno", "Comida", "Cena", "Parking"];
const TICKETS_SECCIONES_MENSUALES = ["Tickets gasoil"];
const TICKETS_DIETAS = { "Desayuno": 4, "Comida": 18, "Cena": 13, "Tickets gasoil": 0, "Parking": 0 };

async function abrirTicketsDB() {
  if (ticketsDB) return ticketsDB;
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(TICKETS_DB_NAME, 1);
    request.onupgradeneeded = event => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(TICKETS_STORE_NAME)) {
        db.createObjectStore(TICKETS_STORE_NAME, { keyPath: "id" });
      }
    };
    request.onsuccess = event => {
      ticketsDB = event.target.result;
      resolve(ticketsDB);
    };
    request.onerror = () => reject(new Error("No se pudo abrir la memoria local de tickets"));
  });
}

async function mostrarTicketsInicio() {
  resultado.classList.add("oculto");
  contenedor.classList.remove("oculto");
  await abrirTicketsDB();

  contenedor.innerHTML = `
    <section class="dashboard-v2 tickets-modulo">
      <style>
        .tickets-modulo .tickets-toolbar{display:grid;gap:14px;margin:18px 0}
        .tickets-modulo .periodBox{background:#fff;border:1px solid #e5e7eb;border-radius:22px;padding:18px;margin:0 0 18px;box-shadow:0 8px 24px rgba(15,23,42,.06)}
        .tickets-modulo .periodBox label{display:block;font-size:16px;font-weight:800;margin:0 0 8px;color:#111827}
        .tickets-modulo .periodSelect{width:100%;border:1px solid #d1d5db;border-radius:14px;padding:14px;font-size:18px;background:#fff;margin-bottom:12px}
        .tickets-modulo .sectionCard{background:#fff;border:1px solid #e5e7eb;border-radius:22px;padding:18px;margin-bottom:18px;box-shadow:0 8px 24px rgba(15,23,42,.06)}
        .tickets-modulo .sectionTitle{font-size:22px;font-weight:900;text-transform:uppercase;margin-bottom:14px;color:#111827;text-align:center}
        .tickets-modulo .actionGrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
        .tickets-modulo .fileBtn{position:relative;border-radius:18px;padding:20px 10px;background:#00843D;color:white;font-size:18px;font-weight:900;text-align:center;overflow:hidden;box-shadow:0 3px 8px rgba(0,0,0,.10)}
        .tickets-modulo .fileBtn.gallery{background:#0057b8}
        .tickets-modulo .fileBtn input[type=file]{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:100px}
        .tickets-modulo .tickets-btn{display:block;width:100%;border:none;border-radius:18px;padding:18px;margin-bottom:12px;color:white;font-size:18px;font-weight:900;cursor:pointer;text-transform:uppercase;text-align:center}
        .tickets-modulo .tickets-btn.secondary{background:#2f2f2f}.tickets-modulo .tickets-btn.calc{background:#0057b8}.tickets-modulo .tickets-btn.warning{background:#d97706}.tickets-modulo .tickets-btn.danger{background:#c9002b}.tickets-modulo .tickets-btn.green{background:#00843D}.tickets-modulo .tickets-btn.edit{background:#6d28d9}
        .tickets-modulo .tickets-counter{background:#fff;border:1px solid #e5e7eb;border-radius:22px;padding:18px;margin:18px 0;font-size:18px;line-height:1.8;box-shadow:0 8px 24px rgba(15,23,42,.06)}
        .tickets-modal{position:fixed;inset:0;display:none;background:rgba(0,0,0,.55);z-index:10000;padding:18px;overflow:auto}
        .tickets-modalBox{background:white;border-radius:20px;padding:22px;max-width:720px;margin:24px auto;box-shadow:0 8px 24px rgba(0,0,0,.25)}
        .tickets-modalBox h2{margin-top:0;text-align:center}
        .tickets-ticketCard{background:#fff;border-radius:16px;padding:12px;box-shadow:0 3px 8px rgba(0,0,0,.1);margin-bottom:16px}
        .tickets-ticketCard img{width:100%;max-height:320px;object-fit:contain;background:#eee;border-radius:12px;display:block}
        .tickets-ticketInfo{font-size:15px;margin:10px 0;line-height:1.4;color:#333}
        .tickets-rowBtns{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        .tickets-smallBtn{border:none;border-radius:12px;padding:12px;color:#fff;font-weight:800;font-size:14px;cursor:pointer}
        .tickets-smallBtn.rotate{background:#0057b8}.tickets-smallBtn.delete{background:#c9002b}.tickets-smallBtn.amount{background:#6d28d9}
        .tickets-resultTable{width:100%;border-collapse:collapse;font-size:15px}.tickets-resultTable th,.tickets-resultTable td{border-bottom:1px solid #ddd;padding:8px 4px;text-align:right}.tickets-resultTable th:first-child,.tickets-resultTable td:first-child{text-align:left}.tickets-totalRow{font-weight:bold;background:#f0f0f0}
      </style>
      <div class="topbar-visita topbar-visita-con-salida">
        <div>
          <span class="etiqueta-paso">Módulo Tickets</span>
          <h2>Tickets</h2>
        </div>
        <div class="topbar-actions-visita">
          <button type="button" class="boton-inicio-visita" onclick="mostrarInicio()">Inicio</button>
        </div>
      </div>

      <div class="dashboard-hero-v2">
        <div>
          <span class="etiqueta-paso">Dietas y gastos</span>
          <h2>Tickets Semana</h2>
          <p id="ticketsWeekInfo"></p>
        </div>
        <div class="version-pill-v2"><strong>v13</strong><span>integrado</span></div>
      </div>

      <div class="periodBox">
        <label for="ticketsWeeklyPeriodSelect">Periodo semanal para Desayuno, Comida, Cena y Parking</label>
        <select id="ticketsWeeklyPeriodSelect" class="periodSelect" onchange="ticketsChangeWeeklyPeriod(this.value)">
          <option value="0">Semana actual</option>
          <option value="-1">Semana pasada</option>
          <option value="-2">Hace 2 semanas</option>
          <option value="-3">Hace 3 semanas</option>
        </select>
        <label for="ticketsMonthlyPeriodSelect">Periodo mensual para Gasoil</label>
        <select id="ticketsMonthlyPeriodSelect" class="periodSelect" onchange="ticketsChangeMonthlyPeriod(this.value)">
          <option value="0">Mes actual</option>
          <option value="-1">Mes pasado</option>
          <option value="-2">Hace 2 meses</option>
          <option value="-3">Hace 3 meses</option>
        </select>
      </div>

      ${TICKETS_SECCIONES.map(seccion => `
        <div class="sectionCard">
          <div class="sectionTitle">${escapeHTML(seccion)}</div>
          <div class="actionGrid">
            <div class="fileBtn">Hacer foto<input type="file" accept="image/*" capture="environment" data-section="${escapeHTML(seccion)}" onchange="ticketsHandleFiles(event)"></div>
            <div class="fileBtn gallery">Galería<input type="file" accept="image/*" multiple data-section="${escapeHTML(seccion)}" onchange="ticketsHandleFiles(event)"></div>
          </div>
        </div>`).join("")}

      <div class="tickets-counter" id="ticketsCounterBox"></div>
      <button class="tickets-btn edit" onclick="ticketsOpenManagePicker()">Modificar / revisar tickets</button>
      <button class="tickets-btn calc" onclick="ticketsShowEconomicSummary()">Calcular importes</button>
      <button class="tickets-btn secondary" onclick="ticketsGenerateAllPDFs()">Generar PDFs</button>
      <button class="tickets-btn warning" onclick="ticketsClearWeeklyTickets()">Borrar tickets semanales</button>
      <button class="tickets-btn danger" onclick="ticketsClearMonthlyTickets()">Borrar tickets mensuales</button>

      <div class="tickets-modal" id="ticketsSummaryModal"><div class="tickets-modalBox"><h2>Resumen económico</h2><div id="ticketsSummaryContent"></div><button class="tickets-btn secondary" onclick="ticketsCloseSummary()">Cerrar</button></div></div>
      <div class="tickets-modal" id="ticketsManageModal"><div class="tickets-modalBox"><h2 id="ticketsManageTitle">Modificar tickets</h2><div id="ticketsManageContent"></div><button class="tickets-btn secondary" onclick="ticketsCloseManage()">Cerrar</button></div></div>
    </section>
  `;

  const weeklySelect = document.getElementById("ticketsWeeklyPeriodSelect");
  const monthlySelect = document.getElementById("ticketsMonthlyPeriodSelect");
  if (weeklySelect) weeklySelect.value = String(ticketsWeeklyOffset);
  if (monthlySelect) monthlySelect.value = String(ticketsMonthlyOffset);

  ticketsShowPeriodInfo();
  await ticketsUpdateCounters();
  window.scrollTo(0, 0);
}

function ticketsGetISOWeekData(date = new Date()) {
  const temp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = temp.getUTCDay() || 7;
  temp.setUTCDate(temp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(temp.getUTCFullYear(), 0, 1));
  const week = Math.ceil((((temp - yearStart) / 86400000) + 1) / 7);
  const year = temp.getUTCFullYear();
  const monday = new Date(date);
  const localDay = monday.getDay() || 7;
  monday.setDate(monday.getDate() - localDay + 1);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return { week, year, monday, sunday };
}

function ticketsGetMonthData(date = new Date()) {
  const year = date.getFullYear();
  const monthIndex = date.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  firstDay.setHours(0, 0, 0, 0);
  const lastDay = new Date(year, monthIndex + 1, 0);
  lastDay.setHours(23, 59, 59, 999);
  return {
    year,
    monthIndex,
    monthNumber: monthIndex + 1,
    monthName: date.toLocaleDateString("es-ES", { month: "long" }),
    firstDay,
    lastDay
  };
}

function ticketsGetWeekDataForOffset(offset = 0) {
  const date = new Date();
  date.setDate(date.getDate() + (Number(offset) || 0) * 7);
  return ticketsGetISOWeekData(date);
}

function ticketsGetMonthDataForOffset(offset = 0) {
  const date = new Date();
  date.setMonth(date.getMonth() + (Number(offset) || 0));
  return ticketsGetMonthData(date);
}

function ticketsFormatDate(date) {
  return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function ticketsFormatMoney(value) {
  return Number(value || 0).toFixed(2).replace(".", ",") + " €";
}

function ticketsParseAmount(value) {
  const num = parseFloat(String(value || "0").replace(",", "."));
  return Number.isFinite(num) ? num : 0;
}

function ticketsIsMonthlySection(section) {
  return section === "Tickets gasoil";
}

function ticketsShowPeriodInfo() {
  const week = ticketsGetWeekDataForOffset(ticketsWeeklyOffset);
  const month = ticketsGetMonthDataForOffset(ticketsMonthlyOffset);
  const el = document.getElementById("ticketsWeekInfo");
  if (!el) return;
  el.innerHTML = `Semana ${week.week}/${week.year}: ${ticketsFormatDate(week.monday)} - ${ticketsFormatDate(week.sunday)}<br>Gasoil: ${month.monthName} ${month.year}`;
}

async function ticketsChangeWeeklyPeriod(value) {
  ticketsWeeklyOffset = Number(value) || 0;
  ticketsShowPeriodInfo();
  await ticketsUpdateCounters();
  if (ticketsManageSection && !ticketsIsMonthlySection(ticketsManageSection)) await ticketsOpenManageSection(ticketsManageSection);
}

async function ticketsChangeMonthlyPeriod(value) {
  ticketsMonthlyOffset = Number(value) || 0;
  ticketsShowPeriodInfo();
  await ticketsUpdateCounters();
  if (ticketsManageSection && ticketsIsMonthlySection(ticketsManageSection)) await ticketsOpenManageSection(ticketsManageSection);
}

function ticketsFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ticketsCompressImage(base64, maxWidth = 1400, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = base64;
  });
}

async function ticketsHandleFiles(event) {
  const input = event.target;
  const section = input.dataset.section;
  const files = Array.from(input.files || []);
  if (!files.length || !section) return;
  await abrirTicketsDB();

  for (const file of files) {
    let base64 = await ticketsFileToBase64(file);
    base64 = await ticketsCompressImage(base64);
    await ticketsSaveTicket({
      id: "ticket_" + Date.now() + "_" + Math.random().toString(36).slice(2),
      section,
      image: base64,
      createdAt: new Date().toISOString(),
      week: ticketsGetWeekDataForOffset(ticketsWeeklyOffset).week,
      year: ticketsGetWeekDataForOffset(ticketsWeeklyOffset).year,
      month: ticketsGetMonthDataForOffset(ticketsMonthlyOffset).monthNumber,
      monthYear: ticketsGetMonthDataForOffset(ticketsMonthlyOffset).year,
      amount: 0,
      liters: 0,
      rotation: 0
    });
  }

  input.value = "";
  await ticketsUpdateCounters();
  alert("Acción completada");
}

async function ticketsSaveTicket(ticket) {
  await abrirTicketsDB();
  return new Promise((resolve, reject) => {
    const tx = ticketsDB.transaction(TICKETS_STORE_NAME, "readwrite");
    tx.objectStore(TICKETS_STORE_NAME).put(ticket);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(new Error("No se pudo guardar el ticket"));
  });
}

async function ticketsGetTickets() {
  await abrirTicketsDB();
  return new Promise((resolve, reject) => {
    const tx = ticketsDB.transaction(TICKETS_STORE_NAME, "readonly");
    const request = tx.objectStore(TICKETS_STORE_NAME).getAll();
    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(new Error("No se pudieron leer los tickets"));
  });
}

async function ticketsDeleteTicketById(id) {
  await abrirTicketsDB();
  return new Promise((resolve, reject) => {
    const tx = ticketsDB.transaction(TICKETS_STORE_NAME, "readwrite");
    tx.objectStore(TICKETS_STORE_NAME).delete(id);
    tx.oncomplete = resolve;
    tx.onerror = () => reject(new Error("No se pudo borrar el ticket"));
  });
}

function ticketsFilterPeriod(tickets, section) {
  if (ticketsIsMonthlySection(section)) {
    const month = ticketsGetMonthDataForOffset(ticketsMonthlyOffset);
    return tickets.filter(t => t.section === section).filter(t => {
      if (t.month && t.monthYear) return t.month === month.monthNumber && t.monthYear === month.year;
      const d = new Date(t.createdAt);
      return d >= month.firstDay && d <= month.lastDay;
    });
  }

  const week = ticketsGetWeekDataForOffset(ticketsWeeklyOffset);
  return tickets.filter(t => t.section === section && t.week === week.week && t.year === week.year);
}

async function ticketsUpdateCounters() {
  const all = await ticketsGetTickets();
  const lines = [];
  let totalTickets = 0;
  for (const section of TICKETS_SECCIONES) {
    const list = ticketsFilterPeriod(all, section);
    totalTickets += list.length;
    lines.push(`<strong>${escapeHTML(section)}:</strong> ${list.length}`);
  }
  const box = document.getElementById("ticketsCounterBox");
  if (box) box.innerHTML = lines.join("<br>") + `<br><br><strong>Total periodo:</strong> ${totalTickets}`;
}

function ticketsOpenManagePicker() {
  const modal = document.getElementById("ticketsManageModal");
  const title = document.getElementById("ticketsManageTitle");
  const content = document.getElementById("ticketsManageContent");
  if (!modal || !title || !content) return;
  title.textContent = "Modificar tickets";
  content.innerHTML = TICKETS_SECCIONES.map(section => `<button class="tickets-btn green" onclick="ticketsOpenManageSection('${section}')">${escapeHTML(section)}</button>`).join("");
  modal.style.display = "block";
}

async function ticketsOpenManageSection(section) {
  ticketsManageSection = section;
  const all = await ticketsGetTickets();
  const list = ticketsFilterPeriod(all, section).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const title = document.getElementById("ticketsManageTitle");
  const content = document.getElementById("ticketsManageContent");
  if (!title || !content) return;
  title.textContent = "Modificar " + section;
  if (!list.length) {
    content.innerHTML = `<p>No hay tickets guardados en este periodo.</p><button class="tickets-btn secondary" onclick="ticketsOpenManagePicker()">Volver</button>`;
    return;
  }
  content.innerHTML = list.map(t => `
    <div class="tickets-ticketCard">
      <img src="${t.image}" style="transform:rotate(${Number(t.rotation || 0)}deg)">
      <div class="tickets-ticketInfo">
        <strong>${escapeHTML(t.section)}</strong><br>
        ${new Date(t.createdAt).toLocaleString("es-ES")}<br>
        Importe: ${ticketsFormatMoney(t.amount || 0)}${t.section === "Tickets gasoil" ? `<br>Litros: ${Number(t.liters || 0).toFixed(2).replace(".", ",")}` : ""}
      </div>
      <div class="tickets-rowBtns">
        <button class="tickets-smallBtn rotate" onclick="ticketsRotateTicket('${t.id}')">Girar</button>
        <button class="tickets-smallBtn amount" onclick="ticketsEditAmount('${t.id}')">Importe</button>
        <button class="tickets-smallBtn delete" onclick="ticketsDeleteOneTicket('${t.id}')">Borrar</button>
      </div>
    </div>`).join("") + `<button class="tickets-btn secondary" onclick="ticketsOpenManagePicker()">Volver</button>`;
}

function ticketsCloseManage() {
  const modal = document.getElementById("ticketsManageModal");
  if (modal) modal.style.display = "none";
}

function ticketsCloseSummary() {
  const modal = document.getElementById("ticketsSummaryModal");
  if (modal) modal.style.display = "none";
}

async function ticketsFindTicket(id) {
  const all = await ticketsGetTickets();
  return all.find(t => t.id === id);
}

async function ticketsRotateTicket(id) {
  const ticket = await ticketsFindTicket(id);
  if (!ticket) return;
  ticket.rotation = (Number(ticket.rotation || 0) + 90) % 360;
  await ticketsSaveTicket(ticket);
  await ticketsOpenManageSection(ticketsManageSection);
}

async function ticketsEditAmount(id) {
  const ticket = await ticketsFindTicket(id);
  if (!ticket) return;
  if (ticket.section === "Tickets gasoil") {
    const litros = prompt("Litros de gasoil:", String(ticket.liters || 0).replace(".", ","));
    if (litros === null) return;
    ticket.liters = ticketsParseAmount(litros);
  }
  const importe = prompt("Importe:", String(ticket.amount || 0).replace(".", ","));
  if (importe === null) return;
  ticket.amount = ticketsParseAmount(importe);
  await ticketsSaveTicket(ticket);
  await ticketsOpenManageSection(ticketsManageSection);
  await ticketsUpdateCounters();
}

async function ticketsDeleteOneTicket(id) {
  if (!confirm("¿Borrar este ticket?")) return;
  await ticketsDeleteTicketById(id);
  await ticketsOpenManageSection(ticketsManageSection);
  await ticketsUpdateCounters();
}

async function ticketsShowEconomicSummary() {
  const all = await ticketsGetTickets();
  let totalImportes = 0;
  let totalDietas = 0;
  let html = `<table class="tickets-resultTable"><tr><th>Sección</th><th>Tickets</th><th>Importe</th><th>Dieta/abono</th><th>Resultado</th></tr>`;
  for (const section of TICKETS_SECCIONES) {
    const list = ticketsFilterPeriod(all, section);
    const importe = list.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const dieta = section === "Parking" ? importe : (section === "Tickets gasoil" ? 0 : list.length * TICKETS_DIETAS[section]);
    const resultado = section === "Tickets gasoil" || section === "Parking" ? 0 : dieta - importe;
    totalImportes += importe;
    totalDietas += dieta;
    html += `<tr><td>${escapeHTML(section)}</td><td>${list.length}</td><td>${ticketsFormatMoney(importe)}</td><td>${ticketsFormatMoney(dieta)}</td><td>${ticketsFormatMoney(resultado)}</td></tr>`;
  }
  html += `<tr class="tickets-totalRow"><td>Total</td><td></td><td>${ticketsFormatMoney(totalImportes)}</td><td>${ticketsFormatMoney(totalDietas)}</td><td>${ticketsFormatMoney(totalDietas - totalImportes)}</td></tr></table>`;
  const content = document.getElementById("ticketsSummaryContent");
  const modal = document.getElementById("ticketsSummaryModal");
  if (content) content.innerHTML = html;
  if (modal) modal.style.display = "block";
}

function ticketsLoadJsPDF() {
  return new Promise((resolve, reject) => {
    if (window.jspdf?.jsPDF) return resolve(window.jspdf.jsPDF);
    const existing = document.querySelector('script[data-jspdf="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(window.jspdf.jsPDF));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.dataset.jspdf = "true";
    script.onload = () => resolve(window.jspdf.jsPDF);
    script.onerror = () => reject(new Error("No se pudo cargar jsPDF. Revisa la conexión."));
    document.head.appendChild(script);
  });
}

async function ticketsGeneratePDFForSection(section) {
  const jsPDF = await ticketsLoadJsPDF();
  const all = await ticketsGetTickets();
  const list = ticketsFilterPeriod(all, section).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  if (!list.length) return false;

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const week = ticketsGetWeekDataForOffset(ticketsWeeklyOffset);
  const month = ticketsGetMonthDataForOffset(ticketsMonthlyOffset);
  const periodo = ticketsIsMonthlySection(section)
    ? `${month.monthName} ${month.year}`
    : `Semana ${week.week}/${week.year} (${ticketsFormatDate(week.monday)} - ${ticketsFormatDate(week.sunday)})`;

  doc.setFontSize(16);
  doc.text(`Tickets - ${section}`, 14, 16);
  doc.setFontSize(10);
  doc.text(periodo, 14, 23);

  let y = 32;
  for (let i = 0; i < list.length; i++) {
    const ticket = list[i];
    if (y > 240) {
      doc.addPage();
      y = 18;
    }
    doc.setFontSize(10);
    doc.text(`${i + 1}. ${new Date(ticket.createdAt).toLocaleDateString("es-ES")} · Importe: ${ticketsFormatMoney(ticket.amount || 0)}`, 14, y);
    y += 5;
    try {
      const imgProps = doc.getImageProperties(ticket.image);
      const width = 180;
      const height = Math.min(95, width * imgProps.height / imgProps.width);
      doc.addImage(ticket.image, "JPEG", 14, y, width, height, undefined, "FAST", Number(ticket.rotation || 0));
      y += height + 10;
    } catch (error) {
      doc.text("No se pudo insertar la imagen del ticket.", 14, y);
      y += 8;
    }
  }

  const safeSection = section.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
  const nombreArchivo = `tickets_${safeSection}_${Date.now()}.pdf`;

  // Dentro de la app empaquetada (Capacitor/Android) un <a download> no basta:
  // el WebView no tiene una carpeta de "Descargas" visible para el usuario y
  // el clic simulado no llega a ningún sitio. Si existe el plugin Filesystem,
  // guardamos el PDF de verdad en el dispositivo (y lo compartimos/abrimos si
  // hay plugin Share). Si no (navegador normal), usamos la descarga clásica.
  const guardadoNativo = await guardarPDFEnDispositivo(doc, nombreArchivo);

  if (!guardadoNativo) {
    const pdfBlob = doc.output("blob");
    const url = URL.createObjectURL(pdfBlob);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = nombreArchivo;
    document.body.appendChild(enlace);
    enlace.click();
    document.body.removeChild(enlace);

    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  return true;
}

/* Guarda el PDF con el plugin Filesystem de Capacitor cuando está disponible
   (app empaquetada). Devuelve true si se guardó por esta vía, false si hay
   que usar el método de descarga de navegador. */
async function guardarPDFEnDispositivo(doc, nombreArchivo) {
  const filesystem = window.Capacitor?.Plugins?.Filesystem;
  if (!filesystem) return false;

  try {
    const base64 = doc.output("datauristring").split(",")[1];

    const archivoGuardado = await filesystem.writeFile({
      path: nombreArchivo,
      data: base64,
      directory: "EXTERNAL_STORAGE",
      recursive: true
    });

    const sharePlugin = window.Capacitor?.Plugins?.Share;
    if (sharePlugin?.share) {
      await sharePlugin.share({
        title: nombreArchivo,
        url: archivoGuardado?.uri || undefined
      });
    } else {
      alert(`PDF guardado en Descargas/Documentos: ${nombreArchivo}`);
    }

    return true;
  } catch (error) {
    console.error("No se pudo guardar el PDF con Filesystem, se usará descarga de navegador.", error);
    return false;
  }
}

async function ticketsGenerateAllPDFs() {
  try {
    let generados = 0;
    for (const section of TICKETS_SECCIONES) {
      const ok = await ticketsGeneratePDFForSection(section);
      if (ok) generados++;
    }
    alert(generados ? `PDFs generados: ${generados}` : "No hay tickets guardados en el periodo seleccionado.");
  } catch (error) {
    alert("No se pudieron generar los PDFs: " + (error.message || error));
  }
}

async function ticketsClearWeeklyTickets() {
  if (!confirm("¿Borrar solo los tickets semanales? Se borrarán Desayuno, Comida, Cena y Parking de la semana seleccionada. No se borrará Gasoil.")) return;
  const all = await ticketsGetTickets();
  const week = ticketsGetWeekDataForOffset(ticketsWeeklyOffset);
  const ids = all
    .filter(t => TICKETS_SECCIONES_SEMANALES.includes(t.section))
    .filter(t => t.week === week.week && t.year === week.year)
    .map(t => t.id);
  for (const id of ids) await ticketsDeleteTicketById(id);
  await ticketsUpdateCounters();
  alert("Tickets semanales borrados");
}

async function ticketsClearMonthlyTickets() {
  if (!confirm("¿Borrar solo los tickets mensuales? Se borrará Gasoil del mes seleccionado.")) return;
  const all = await ticketsGetTickets();
  const month = ticketsGetMonthDataForOffset(ticketsMonthlyOffset);
  const ids = all
    .filter(t => TICKETS_SECCIONES_MENSUALES.includes(t.section))
    .filter(t => {
      if (t.month && t.monthYear) return t.month === month.monthNumber && t.monthYear === month.year;
      const d = new Date(t.createdAt);
      return d >= month.firstDay && d <= month.lastDay;
    })
    .map(t => t.id);
  for (const id of ids) await ticketsDeleteTicketById(id);
  await ticketsUpdateCounters();
  alert("Tickets mensuales borrados");
}