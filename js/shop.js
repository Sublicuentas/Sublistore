import { CATEGORIAS, CATALOGO, OFERTAS } from "./products-data.js?v=8";
import { LOGOS } from "./logos.js?v=8";
import { CAT_ICONS } from "./cat-icons.js?v=8";
import { BANNERS } from "./banners.js?v=8";
import { NAV_ICONS } from "./nav-icons.js?v=8";

/* ---------------------------------------------------------
   Navbar inferior: íconos reales, el que está activo se pinta
   de rojo con un filtro CSS (no hace falta un ícono por color).
--------------------------------------------------------- */
const NAV_BTNS = {
  navInicio: "iconInicio",
  navCategorias: "iconCategorias",
  navCarrito: "iconCarrito",
  navPerfil: "iconPerfil"
};
Object.entries(NAV_BTNS).forEach(([btnId, imgId]) => {
  const imgEl = document.getElementById(imgId);
  const key = imgId.replace("icon", "").toLowerCase();
  if (imgEl && NAV_ICONS[key]) imgEl.src = NAV_ICONS[key];
});
import { initCurrency, montarSelectorMoneda, refrescarPreciosDuales } from "./currency.js?v=8";

function catIconHtml(catId, cls) {
  const src = CAT_ICONS[catId];
  return src ? `<img class="${cls}" src="${src}" alt=""/>` : "";
}

/* ---------------------------------------------------------
   Moneda: selector + tasas en vivo
--------------------------------------------------------- */
montarSelectorMoneda(document.getElementById("currPicker"));
initCurrency();

function dualPriceHtml(precioLps) {
  const n = parseFloat(precioLps);
  if (isNaN(n)) return "";
  return `<span class="dual-price" data-lps="${n}"></span>`;
}

/* ---------------------------------------------------------
   Helpers de render
--------------------------------------------------------- */
function precioDesde(prod) {
  if (prod.noDisponible) return "No disponible";
  if (prod.planesFijos) {
    const primerPlan = prod.planes[0];
    if (primerPlan.tabla) return `Desde L${primerPlan.tabla[0].p}`;
    if (primerPlan.precio) return `L${primerPlan.precio}/${primerPlan.periodo}`;
  }
  if (prod.precioBase) return `L${prod.precioBase}/${prod.periodoBase || "mes"}`;
  return "";
}

function precioNumero(prod) {
  if (prod.noDisponible) return null;
  if (prod.planesFijos) {
    const primerPlan = prod.planes[0];
    if (primerPlan.tabla) return primerPlan.tabla[0].p;
    if (primerPlan.precio) return primerPlan.precio;
  }
  if (prod.precioBase) return prod.precioBase;
  return null;
}

function logoOrEmoji(prod) {
  // Combo (dos plataformas en un mismo producto): mostrar ambos logos
  if (prod.logo && prod.logo2 && LOGOS[prod.logo] && LOGOS[prod.logo2]) {
    return `<span class="prod-combo-logo">
      <img src="${LOGOS[prod.logo]}" alt="${prod.nombre}"/>
      <img src="${LOGOS[prod.logo2]}" alt="${prod.nombre}"/>
    </span>`;
  }
  // Logo real (base64/URL) si está disponible en logos.js
  if (prod.logo && LOGOS[prod.logo]) {
    return `<img class="prod-logo-img" src="${LOGOS[prod.logo]}" alt="${prod.nombre}" decoding="async"/>`;
  }
  // Emoji directo (ej. liontv: "🦁")
  if (prod.logo && prod.logo.length <= 2) {
    return `<span class="prod-fallback">${prod.logo}</span>`;
  }
  // Última opción: inicial del nombre
  return `<span class="prod-fallback">${(prod.nombre || "?").charAt(0)}</span>`;
}

/* ---------------------------------------------------------
   Grid de categorías
--------------------------------------------------------- */
const catGrid = document.getElementById("catGrid");
CATEGORIAS.forEach((cat) => {
  const btn = document.createElement("div");
  btn.className = "cat-tile" + (cat.id === "vip" ? " vip" : "");
  btn.innerHTML = `${catIconHtml(cat.id, "ic-img")}<span>${cat.nombre}</span>`;
  btn.addEventListener("click", () => abrirCategoria(cat.id));
  catGrid.appendChild(btn);
});

/* ---------------------------------------------------------
   Servicios destacados (los más pedidos, tomados del catálogo)
--------------------------------------------------------- */
// Gradientes de marca para las tarjetas de "Servicios destacados"
const GRADIENTES = {
  netflix: "linear-gradient(155deg,#3a0308,#000)",
  disney: "linear-gradient(155deg,#083a56,#001322)",
  hbo: "linear-gradient(155deg,#2b0d4a,#0a0116)",
  prime: "linear-gradient(155deg,#0a2b4a,#001018)",
  crunchyroll: "linear-gradient(155deg,#3a2600,#150e00)",
  vix: "linear-gradient(155deg,#4a0d0d,#160303)",
  spotify: "linear-gradient(155deg,#0d3a1a,#031607)",
  latintv: "linear-gradient(155deg,#0d2a4a,#030f18)",
  liontv: "linear-gradient(155deg,#4a2a0d,#160e03)",
  oleada: "linear-gradient(155deg,#04324a,#010f16)",
  duolingo: "linear-gradient(155deg,#0d3a1a,#031607)"
};
const GRADIENTE_DEFAULT = "linear-gradient(155deg,#2a0608,#0a0102)";

const DESTACADOS = [
  { cat: "tv", id: "netflix" },
  { cat: "tv", id: "disney" },
  { cat: "tv", id: "hbo" },
  { cat: "iptv", id: "latintv" },
  { cat: "musica", id: "spotify" },
  { cat: "ia", id: "duolingo" }
];

const svcRow = document.getElementById("svcRow");
DESTACADOS.forEach(({ cat, id }) => {
  const prod = (CATALOGO[cat] || []).find((p) => p.id === id);
  if (!prod) return;
  const card = document.createElement("div");
  card.className = "svc-card";
  const fondoReal = BANNERS[id];
  const estiloFondo = fondoReal
    ? `background-image:url('${fondoReal}');background-size:cover;background-position:center`
    : `background:${GRADIENTES[id] || GRADIENTE_DEFAULT}`;
  card.innerHTML = `
    <div class="svc-photo${fondoReal ? " svc-photo-real" : ""}" style="${estiloFondo}">
      ${logoOrEmoji(prod)}
    </div>
    <div class="svc-info">
      <b>${prod.nombre}</b>
      <span class="price">${precioDesde(prod)}${dualPriceHtml(precioNumero(prod))}</span>
    </div>
  `;
  card.addEventListener("click", () => abrirCategoria(cat, id));
  svcRow.appendChild(card);
});

/* ---------------------------------------------------------
   Navegación entre vistas
--------------------------------------------------------- */
const views = {
  home: document.getElementById("view-home"),
  cat: document.getElementById("view-cat")
};
function showView(name) {
  Object.entries(views).forEach(([k, el]) => el.classList.toggle("active", k === name));
  document.getElementById("navInicio").classList.toggle("active", name === "home");
  document.getElementById("navCategorias").classList.toggle("active", name === "cat");
  window.scrollTo(0, 0);
}

const catTitle = document.getElementById("catTitle");
const catList = document.getElementById("catList");

function abrirCategoria(catId, scrollToId) {
  const cat = CATEGORIAS.find((c) => c.id === catId);
  catTitle.textContent = cat ? cat.nombre : "Categoría";
  catList.innerHTML = "";

  // Categoría virtual "Ofertas": agrupa productos reales de otras categorías
  if (catId === "ofertas") {
    OFERTAS.forEach(({ catId: realCat, id, tag }) => {
      const prod = (CATALOGO[realCat] || []).find((p) => p.id === id);
      if (!prod) return;
      const row = document.createElement("div");
      row.className = "prod-card";
      row.innerHTML = `
        ${logoOrEmoji(prod)}
        <div class="info">
          <h3>${prod.nombre}</h3>
          <p>${precioDesde(prod)}${dualPriceHtml(precioNumero(prod))} <span class="offer-tag">${tag}</span></p>
        </div>
        <span class="arrow">›</span>
      `;
      row.addEventListener("click", () => {
        window.location.href = `producto.html?cat=${realCat}&id=${prod.id}`;
      });
      catList.appendChild(row);
    });
    refrescarPreciosDuales();
    showView("cat");
    return;
  }

  const productos = CATALOGO[catId] || [];

  if (productos.length === 0) {
    catList.innerHTML = `<p style="text-align:center;color:var(--muted);padding:30px 0">
      Esta categoría todavía no tiene productos cargados en la tienda.<br>
      Escribinos por WhatsApp mientras la completamos.
    </p>`;
    showView("cat");
    return;
  }

  productos.forEach((prod) => {
    const row = document.createElement("div");
    row.className = "prod-card";
    row.innerHTML = `
      ${logoOrEmoji(prod)}
      <div class="info">
        <h3>${prod.nombre}</h3>
        <p class="${prod.noDisponible ? "na" : ""}">${
          prod.noDisponible ? "No disponible" : precioDesde(prod)
        }${prod.noDisponible ? "" : dualPriceHtml(precioNumero(prod))}</p>
      </div>
      <span class="arrow">›</span>
    `;
    if (!prod.noDisponible) {
      row.addEventListener("click", () => {
        window.location.href = `producto.html?cat=${catId}&id=${prod.id}`;
      });
    }
    catList.appendChild(row);
  });

  refrescarPreciosDuales();
  showView("cat");
}

document.getElementById("navInicio").addEventListener("click", () => showView("home"));
document.getElementById("navCategorias").addEventListener("click", () => {
  catTitle.textContent = "Todas las categorías";
  catList.innerHTML = "";
  CATEGORIAS.forEach((cat) => {
    const row = document.createElement("div");
    row.className = "prod-card";
    row.innerHTML = `<span class="prod-fallback cat-fallback">${catIconHtml(cat.id, "ic-img-sm")}</span>
      <div class="info"><h3>${cat.nombre}</h3></div><span class="arrow">›</span>`;
    row.addEventListener("click", () => abrirCategoria(cat.id));
    catList.appendChild(row);
  });
  showView("cat");
});
document.getElementById("btnBackFromCat").addEventListener("click", () => showView("home"));
document.getElementById("navCarrito").addEventListener("click", () => {
  document.querySelectorAll(".shop-nav-btn").forEach((b) => b.classList.remove("active"));
  document.getElementById("navCarrito").classList.add("active");
  window.location.href = "carrito.html";
});
document.getElementById("navPerfil").addEventListener("click", () => {
  document.querySelectorAll(".shop-nav-btn").forEach((b) => b.classList.remove("active"));
  document.getElementById("navPerfil").classList.add("active");
  window.location.href = "perfil.html";
});
document.getElementById("btnCartTop").addEventListener("click", () => {
  window.location.href = "carrito.html";
});

/* ---------------------------------------------------------
   Buscador simple (filtra por nombre en todo el catálogo)
--------------------------------------------------------- */
document.getElementById("searchInput").addEventListener("input", (e) => {
  const q = e.target.value.trim().toLowerCase();
  if (!q) return;
  const resultados = [];
  Object.entries(CATALOGO).forEach(([catId, productos]) => {
    productos.forEach((p) => {
      if (p.nombre.toLowerCase().includes(q)) resultados.push({ catId, prod: p });
    });
  });
  catTitle.textContent = `Resultados para "${q}"`;
  catList.innerHTML = "";
  if (resultados.length === 0) {
    catList.innerHTML = `<p style="text-align:center;color:var(--muted);padding:30px 0">Sin resultados.</p>`;
  } else {
    resultados.forEach(({ catId, prod }) => {
      const row = document.createElement("div");
      row.className = "prod-card";
      row.innerHTML = `${logoOrEmoji(prod)}
        <div class="info"><h3>${prod.nombre}</h3><p>${precioDesde(prod)}${dualPriceHtml(precioNumero(prod))}</p></div>
        <span class="arrow">›</span>`;
      row.addEventListener("click", () => { window.location.href = `producto.html?cat=${catId}&id=${prod.id}`; });
      catList.appendChild(row);
    });
  }
  refrescarPreciosDuales();
  showView("cat");
});

/* ---------------------------------------------------------
   Badge del carrito (lee localStorage compartido con carrito.html)
--------------------------------------------------------- */
function actualizarBadgeCarrito() {
  let carrito = [];
  try { carrito = JSON.parse(sessionStorage.getItem("subli_carrito") || "[]"); } catch (e) {}
  const n = carrito.reduce((sum, it) => sum + (it.cantidad || 1), 0);
  const top = document.getElementById("cartBadgeTop");
  const nav = document.getElementById("cartBadgeNav");
  [top, nav].forEach((el) => {
    if (!el) return;
    el.style.display = n > 0 ? "flex" : "none";
    el.textContent = n;
  });
}
actualizarBadgeCarrito();

/* ---------------------------------------------------------
   Si llegamos con ?cat=X (volviendo de la pantalla de producto),
   abrir directo esa categoría en vez de mostrar el inicio.
--------------------------------------------------------- */
(function restaurarCategoriaAlVolver() {
  const catDeRegreso = new URLSearchParams(window.location.search).get("cat");
  if (catDeRegreso) {
    abrirCategoria(catDeRegreso);
  }
})();
