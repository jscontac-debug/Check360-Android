let currentStep = 1;
const totalSteps = 7;
const STORAGE_KEY = "check360_visita";

/* 🔗 URL DEL FLOW DE POWER AUTOMATE (LA PEGARÁS LUEGO) */
const FLOW_URL = "https://default700ad6cc78f64423ab0cc921082973.90.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/db4a0ad01a194c99a37d8bd2cc191ca3/triggers/manual/paths/invoke?api-version=1";

/* ESTADO */
let visita = {};

/* CARGAR VISITA */
function loadVisita() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    visita = JSON.parse(data);
    Object.keys(visita).forEach(key => {
      const el = document.getElementById(key);
      if (el) el.value = visita[key];
    });
  }
}

/* GUARDAR VISITA */
function saveVisita() {
  document.querySelectorAll("input, textarea, select").forEach(el => {
    if (el.id) visita[el.id] = el.value;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(visita));
}

/* MOSTRAR PASO */
function showStep(step) {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.querySelector(`.step[data-step='${step}']`).classList.add("active");

  document.querySelector(".step-indicator").textContent = `${step}/${totalSteps}`;
  document.getElementById("prev").disabled = step === 1;
  document.getElementById("next").textContent =
    step === totalSteps ? "Finalizar" : "Siguiente";
}

/* ENVIAR A POWER AUTOMATE */
async function enviarVisita() {
  try {
    await fetch(FLOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visita)
    });

    alert("✅ Visita enviada correctamente");
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    alert("❌ Error al enviar la visita. Se mantiene guardada.");
  }
}

/* EVENTOS */
document.addEventListener("DOMContentLoaded", () => {
  loadVisita();
  showStep(currentStep);

  document.getElementById("next").addEventListener("click", async () => {
    saveVisita();

    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
      loadVisita();
    } else {
      await enviarVisita();
    }
  });

  document.getElementById("prev").addEventListener("click", () => {
    saveVisita();
    if (currentStep > 1) {
      currentStep--;
      showStep(currentStep);
      loadVisita();
    }
  });
});