import { CATEGORIAS, CATALOGO } from "./products-data.js";
import { LOGOS } from "./logos.js";

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

function logoOrEmoji(prod) {
  // Logo real (base64/URL) si está disponible en logos.js
  if (prod.logo && LOGOS[prod.logo]) {
    return `<img class="prod-logo-img" src="${LOGOS[prod.logo]}" alt="${prod.nombre}"/>`;
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
  btn.className = "cat-tile";
  btn.innerHTML = `<span class="ic">${cat.icono}</span><span>${cat.nombre}</span>`;
  btn.addEventListener("click", () => abrirCategoria(cat.id));
  catGrid.appendChild(btn);
});
// Tile de Puntos VIP al final de la grilla (acceso directo)
const vipTile = document.createElement("div");
vipTile.className = "cat-tile vip";
vipTile.innerHTML = `<span class="ic">⭐</span><span>Puntos VIP</span>`;
vipTile.addEventListener("click", () => alert("Puntos VIP: próximamente en esta demo."));
catGrid.appendChild(vipTile);

/* ---------------------------------------------------------
   Servicios destacados (los más pedidos, tomados del catálogo)
--------------------------------------------------------- */
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
  card.innerHTML = `
    ${logoOrEmoji(prod)}
    <b>${prod.nombre}</b>
    <span class="price">${precioDesde(prod)}</span>
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
  const productos = CATALOGO[catId] || [];
  catTitle.textContent = cat ? cat.nombre : "Categoría";
  catList.innerHTML = "";

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
        }</p>
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

  showView("cat");
}

document.getElementById("navInicio").addEventListener("click", () => showView("home"));
document.getElementById("navCategorias").addEventListener("click", () => {
  catTitle.textContent = "Todas las categorías";
  catList.innerHTML = "";
  CATEGORIAS.forEach((cat) => {
    const row = document.createElement("div");
    row.className = "prod-card";
    row.innerHTML = `<span class="prod-fallback">${cat.icono}</span>
      <div class="info"><h3>${cat.nombre}</h3></div><span class="arrow">›</span>`;
    row.addEventListener("click", () => abrirCategoria(cat.id));
    catList.appendChild(row);
  });
  showView("cat");
});
document.getElementById("btnBackFromCat").addEventListener("click", () => showView("home"));
document.getElementById("navCarrito").addEventListener("click", () => {
  window.location.href = "carrito.html";
});
document.getElementById("navPerfil").addEventListener("click", () => {
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
        <div class="info"><h3>${prod.nombre}</h3><p>${precioDesde(prod)}</p></div>
        <span class="arrow">›</span>`;
      row.addEventListener("click", () => { window.location.href = `producto.html?cat=${catId}&id=${prod.id}`; });
      catList.appendChild(row);
    });
  }
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
