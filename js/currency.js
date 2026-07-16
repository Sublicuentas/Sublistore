// =========================================================
// SUBLISTORE — Conversión de moneda en vivo (Lempira + local)
// Base de precios: SIEMPRE Lempiras (HNL). Este módulo agrega
// la conversión aproximada a la moneda del país del visitante,
// usando el tipo de cambio actual del dólar.
// =========================================================

export const MONEDAS = [
  { code: "HNL", nombre: "Lempira", simbolo: "L", bandera: "🇭🇳" },
  { code: "USD", nombre: "Dólar US", simbolo: "$", bandera: "🇺🇸" },
  { code: "GTQ", nombre: "Quetzal", simbolo: "Q", bandera: "🇬🇹" },
  { code: "NIO", nombre: "Córdoba", simbolo: "C$", bandera: "🇳🇮" },
  { code: "CRC", nombre: "Colón", simbolo: "₡", bandera: "🇨🇷" },
  { code: "PAB", nombre: "Balboa", simbolo: "B/.", bandera: "🇵🇦" },
  { code: "MXN", nombre: "Peso Mexicano", simbolo: "$", bandera: "🇲🇽" },
  { code: "COP", nombre: "Peso Colombiano", simbolo: "$", bandera: "🇨🇴" },
  { code: "VES", nombre: "Bolívar", simbolo: "Bs.D", bandera: "🇻🇪" },
  { code: "BOB", nombre: "Boliviano", simbolo: "Bs", bandera: "🇧🇴" },
  { code: "PYG", nombre: "Guaraní", simbolo: "₲", bandera: "🇵🇾" },
  { code: "PEN", nombre: "Sol", simbolo: "S/.", bandera: "🇵🇪" },
  { code: "ARS", nombre: "Peso Argentino", simbolo: "$", bandera: "🇦🇷" }
];

// Tasas de respaldo (unidades por 1 USD) por si la API de tipo de cambio
// no responde. Se actualizan aproximadamente; la app siempre intenta
// primero traer la tasa real.
const TASAS_RESPALDO_USD = {
  HNL: 24.7, USD: 1, GTQ: 7.75, NIO: 36.6, CRC: 505, PAB: 1,
  MXN: 18.8, COP: 4050, VES: 190, BOB: 6.9, PYG: 7550, PEN: 3.75, ARS: 1290
};

const RATES_KEY = "subli_rates_usd_v1";
const CURR_KEY = "subli_currency";
const RATES_TTL_MS = 60 * 60 * 1000; // 1 hora

let ratesUsd = null;       // { HNL: 24.7, USD: 1, ... } unidades por 1 USD
let monedaActual = null;   // código de moneda elegido/detectado

/* ---------------------------------------------------------
   Tasas de cambio en vivo (base USD)
--------------------------------------------------------- */
async function cargarTasas() {
  try {
    const cache = JSON.parse(sessionStorage.getItem(RATES_KEY) || "null");
    if (cache && Date.now() - cache.ts < RATES_TTL_MS) {
      ratesUsd = cache.rates;
      return ratesUsd;
    }
  } catch (e) {}

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    const data = await res.json();
    if (data && data.rates) {
      ratesUsd = data.rates;
      sessionStorage.setItem(RATES_KEY, JSON.stringify({ ts: Date.now(), rates: ratesUsd }));
      return ratesUsd;
    }
  } catch (e) {}

  ratesUsd = TASAS_RESPALDO_USD;
  return ratesUsd;
}

/* ---------------------------------------------------------
   Detección de país / moneda del visitante
--------------------------------------------------------- */
async function detectarMoneda() {
  const guardada = sessionStorage.getItem(CURR_KEY);
  if (guardada) {
    monedaActual = guardada;
    return monedaActual;
  }
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();
    const code = (data && data.currency) ? data.currency.toUpperCase() : "HNL";
    monedaActual = MONEDAS.some((m) => m.code === code) ? code : "HNL";
  } catch (e) {
    monedaActual = "HNL";
  }
  sessionStorage.setItem(CURR_KEY, monedaActual);
  return monedaActual;
}

export function setMoneda(code) {
  monedaActual = code;
  sessionStorage.setItem(CURR_KEY, code);
  document.dispatchEvent(new CustomEvent("subli:currency-changed", { detail: { code } }));
}

export function getMonedaActual() {
  return monedaActual || "HNL";
}

/* ---------------------------------------------------------
   Conversión: Lempiras -> moneda destino, redondeado al entero
   (0.5 hacia arriba, ej: 8.5 -> 9, 8.4 -> 8 — Math.round hace esto)
--------------------------------------------------------- */
export function convertirDeLempiras(precioLps, codeDestino) {
  if (!ratesUsd) return null;
  const code = codeDestino || getMonedaActual();
  if (code === "HNL") return null; // ya se muestra en Lempiras, no hace falta duplicar
  const tasaHNL = ratesUsd.HNL || TASAS_RESPALDO_USD.HNL;
  const tasaDestino = ratesUsd[code] || TASAS_RESPALDO_USD[code];
  if (!tasaHNL || !tasaDestino) return null;
  const enUsd = precioLps / tasaHNL;
  const valor = enUsd * tasaDestino;
  return Math.round(valor);
}

function simboloDe(code) {
  const m = MONEDAS.find((m) => m.code === code);
  return m ? m.simbolo : code;
}

/* ---------------------------------------------------------
   Refrescar todos los precios "duales" pintados en la página
   (elementos <span class="dual-price" data-lps="130">)
--------------------------------------------------------- */
export function refrescarPreciosDuales() {
  const code = getMonedaActual();
  document.querySelectorAll(".dual-price[data-lps]").forEach((el) => {
    const lps = parseFloat(el.getAttribute("data-lps"));
    if (isNaN(lps) || code === "HNL") {
      el.textContent = "";
      return;
    }
    const conv = convertirDeLempiras(lps, code);
    el.textContent = conv != null ? `≈ ${simboloDe(code)}${conv} ${code}` : "";
  });
}

/* ---------------------------------------------------------
   Selector de moneda (pastilla "🇭🇳 Lempira ▾" + lista desplegable)
--------------------------------------------------------- */
export function montarSelectorMoneda(contenedor) {
  const pill = document.createElement("button");
  pill.type = "button";
  pill.className = "curr-pill";
  contenedor.appendChild(pill);

  const dropdown = document.createElement("div");
  dropdown.className = "curr-dropdown";
  dropdown.style.display = "none";
  MONEDAS.forEach((m) => {
    const item = document.createElement("div");
    item.className = "curr-item";
    item.dataset.code = m.code;
    item.innerHTML = `<span class="flag">${m.bandera}</span><span class="name">${m.nombre}<small>${m.simbolo}</small></span><span class="code">${m.code}</span>`;
    item.addEventListener("click", () => {
      setMoneda(m.code);
      dropdown.style.display = "none";
      renderPill();
    });
    dropdown.appendChild(item);
  });
  contenedor.appendChild(dropdown);

  function renderPill() {
    const code = getMonedaActual();
    const m = MONEDAS.find((x) => x.code === code) || MONEDAS[0];
    pill.innerHTML = `${m.bandera} <span>${m.nombre}</span> ▾`;
    dropdown.querySelectorAll(".curr-item").forEach((it) => {
      it.classList.toggle("active", it.dataset.code === code);
    });
  }

  pill.addEventListener("click", () => {
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  });
  document.addEventListener("click", (e) => {
    if (!contenedor.contains(e.target)) dropdown.style.display = "none";
  });

  renderPill();
  document.addEventListener("subli:currency-changed", renderPill);
}

/* ---------------------------------------------------------
   Inicialización: carga tasas + detecta moneda, y refresca
   automáticamente cualquier precio dual ya pintado en pantalla.
--------------------------------------------------------- */
export async function initCurrency() {
  await Promise.all([cargarTasas(), detectarMoneda()]);
  refrescarPreciosDuales();
  document.addEventListener("subli:currency-changed", refrescarPreciosDuales);
  return { moneda: getMonedaActual() };
}
