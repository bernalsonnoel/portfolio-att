// script.js
// Salva e atualiza votos no localStorage
const STORAGE_KEY = "votacao_uber_onibus_v1";

const defaultState = {
  uber: 0,
  onibus: 0,
  voted: false // indica se já votou nesta aba (evita votar várias vezes sem reset)
};

function readState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {...defaultState};
    return {...defaultState, ...JSON.parse(raw)};
  } catch (e) {
    console.error("Erro ao ler storage:", e);
    return {...defaultState};
  }
}

function writeState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Atualiza interface com os números
function render() {
  const state = readState();
  const total = state.uber + state.onibus;
  document.getElementById("count-uber").textContent = state.uber;
  document.getElementById("count-onibus").textContent = state.onibus;
  document.getElementById("total-votos").textContent = total;

  const pctUber = total === 0 ? 0 : Math.round((state.uber / total) * 100);
  const pctOnibus = total === 0 ? 0 : Math.round((state.onibus / total) * 100);

  document.getElementById("pct-uber").textContent = pctUber + "%";
  document.getElementById("pct-onibus").textContent = pctOnibus + "%";

  document.getElementById("bar-uber").style.width = pctUber + "%";
  document.getElementById("bar-onibus").style.width = pctOnibus + "%";

  // desabilita botões se já votou
  const voted = !!state.voted;
  document.querySelectorAll(".vote-btn").forEach(btn => {
    btn.disabled = voted;
  });
}

// Lógica de votação com confirmação
function vote(candidate) {
  const state = readState();
  if (state.voted) {
    alert("Você já votou (nesta aba). Reset para votar novamente.");
    return;
  }

  const ok = confirm(`Confirma o voto em "${candidate === "uber" ? "Uber" : "Ônibus"}"?`);
  if (!ok) return;

  if (candidate === "uber") state.uber += 1;
  if (candidate === "onibus") state.onibus += 1;
  state.voted = true;
  writeState(state);
  render();
}

// Reset (apaga storage)
function resetAll() {
  if (!confirm("Tem certeza que quer resetar a votação? Isso apagará todos os votos salvos neste navegador.")) return;
  localStorage.removeItem(STORAGE_KEY);
  render();
}

// eventos
document.addEventListener("DOMContentLoaded", () => {
  render();

  document.querySelectorAll(".vote-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const candidate = btn.getAttribute("data-candidate");
      vote(candidate);
    });
  });

  document.getElementById("reset-btn").addEventListener("click", resetAll);
});

