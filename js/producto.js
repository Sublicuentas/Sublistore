import { CATALOGO, DURACIONES_GENERICAS } from "./products-data.js";

const params = new URLSearchParams(window.location.search);
const catId = params.get("cat");
const prodId = params.get("id");
const prod = (CATALOGO[catId] || []).find((p) => p.id === prodId);

const els = {
  logo: document.getElementById("prodLogo"),
  nombre: document.getElementById("prodNombre"),
  sub: document.getElementById("prodSub"),
  cardPlanes: document.getElementById("cardPlanes"),
  planesTitulo: document.getElementById("planesTitulo"),
  planGrid: document.getElementById("planGrid"),
  cardDuracion: document.getElementById("cardDuracion"),
  duracionTitulo: document.getElementById("duracionTitulo"),
  durRow: document.getElementById("durRow"),
  cardInfo: document.getElementById("cardInfo"),
  detalleList: document.getElementById("detalleList"),
  cardExpand: document.getElementById("cardExpand"),
  detCompat: document.getElementById("detCompat"),
  compatContent: document.getElementById("compatContent"),
  detCatalogo: document.getElementById("detCatalogo"),
  catalogoContent: document.getElementById("catalogoContent"),
  totalPrecio: document.getElementById("totalPrecio"),
  btnAgregar: document.getElementById("btnAgregar")
};

if (!prod) {
  els.nombre.textContent = "Producto no encontrado";
  els.sub.textContent = "Volvé al catálogo e intentá de nuevo.";
  els.btnAgregar.disabled = true;
}

/* ---------------------------------------------------------
   Estado de la selección actual
--------------------------------------------------------- */
let seleccion = { plan: null, duracion: null, precio: 0, etiquetaDuracion: "" };

if (prod) {
  render();
}

document.getElementById("btnBack").addEventListener("click", () => history.back());
document.getElementById("btnCart").addEventListener("click", () => { window.location.href = "carrito.html"; });

function render() {
  els.logo.textContent = (prod.logo && prod.logo.length <= 2) ? prod.logo : prod.nombre.charAt(0);
  els.nombre.textContent = prod.nombre;
  els.sub.textContent = "Elegí tu plan ideal y agregalo al carrito";

  // -------- Caso 1: planes con tabla de duración (IPTV / Canva) --------
  if (prod.planesFijos && prod.planes[0].tabla) {
    els.cardPlanes.style.display = "block";
    els.planesTitulo.textContent = "Elige tu plan";
    prod.planes.forEach((plan, i) => {
      const opt = document.createElement("div");
      opt.className = "plan-opt" + (i === 0 ? " active" : "");
      opt.innerHTML = `<b>${plan.nombre}</b><span class="price">Desde L${plan.tabla[0].p}</span>`;
      opt.addEventListener("click", () => {
        document.querySelectorAll("#planGrid .plan-opt").forEach((e) => e.classList.remove("active"));
        opt.classList.add("active");
        renderDuraciones(plan.tabla);
      });
      els.planGrid.appendChild(opt);
    });
    renderDuraciones(prod.planes[0].tabla);

    if (prod.compatibilidad) {
      els.cardExpand.style.display = "block";
      els.detCompat.style.display = "block";
      els.compatContent.innerHTML = `<b style="color:#178A46">✓ Compatible:</b> ${prod.compatibilidad.ok}<br><br><b style="color:#B30E20">✗ No compatible:</b> ${prod.compatibilidad.no}`;
    }
    if (prod.catalogo || prod.incluye) {
      els.cardExpand.style.display = "block";
      els.detCatalogo.style.display = "block";
      els.catalogoContent.textContent = [prod.catalogo, prod.incluye].filter(Boolean).join(" · ");
    }
  }

  // -------- Caso 2: planes fijos simples (Netflix / Disney) --------
  else if (prod.planesFijos && prod.planes[0].precio) {
    els.cardPlanes.style.display = "block";
    els.planesTitulo.textContent = "Elige tu plan";
    prod.planes.forEach((plan, i) => {
      const opt = document.createElement("div");
      opt.className = "plan-opt" + (i === 0 ? " active" : "");
      opt.innerHTML = `
        ${plan.badge ? `<span class="badge">${plan.badge}</span>` : ""}
        <b>${plan.nombre}</b>
        <span class="price">L${plan.precio}<small>/${plan.periodo}</small></span>
      `;
      opt.addEventListener("click", () => {
        document.querySelectorAll("#planGrid .plan-opt").forEach((e) => e.classList.remove("active"));
        opt.classList.add("active");
        seleccion = { plan: plan.nombre, duracion: null, precio: plan.precio, etiquetaDuracion: "1 " + plan.periodo };
        actualizarTotal();
        renderDetalles(plan.detalles);
      });
      els.planGrid.appendChild(opt);
    });
    const primero = prod.planes[0];
    seleccion = { plan: primero.nombre, duracion: null, precio: primero.precio, etiquetaDuracion: "1 " + primero.periodo };
    renderDetalles(primero.detalles);
  }

  // -------- Caso 3: producto simple con precioBase (selector 1/3/6/12) --------
  else if (prod.precioBase) {
    els.cardDuracion.style.display = "block";
    els.duracionTitulo.textContent = "Elige la duración";
    els.durRow.innerHTML = "";
    DURACIONES_GENERICAS.forEach((d, i) => {
      const precio = Math.round(prod.precioBase * d.factor);
      const opt = document.createElement("div");
      opt.className = "dur-opt" + (i === 0 ? " active" : "");
      opt.innerHTML = `
        <span class="m">${d.meses} mes${d.meses > 1 ? "es" : ""}</span>
        <span class="p">L${precio}</span>
        ${d.bono ? `<span class="bono">${d.bono}</span>` : ""}
      `;
      opt.addEventListener("click", () => {
        document.querySelectorAll("#durRow .dur-opt").forEach((e) => e.classList.remove("active"));
        opt.classList.add("active");
        seleccion = { plan: null, duracion: d.meses, precio, etiquetaDuracion: `${d.meses} mes${d.meses > 1 ? "es" : ""}` };
        actualizarTotal();
      });
      els.durRow.appendChild(opt);
    });
    const d0 = DURACIONES_GENERICAS[0];
    seleccion = { plan: null, duracion: d0.meses, precio: prod.precioBase, etiquetaDuracion: "1 mes" };
    if (prod.detalles) renderDetalles(prod.detalles);
  }

  actualizarTotal();
}

function renderDuraciones(tabla) {
  els.cardDuracion.style.display = "block";
  els.duracionTitulo.textContent = "Elige la duración";
  els.durRow.innerHTML = "";
  tabla.forEach((t, i) => {
    const opt = document.createElement("div");
    opt.className = "dur-opt" + (i === 0 ? " active" : "");
    opt.innerHTML = `
      <span class="m">${t.d}</span>
      <span class="p">L${t.p}</span>
      ${t.bono ? `<span class="bono">${t.bono}</span>` : ""}
    `;
    opt.addEventListener("click", () => {
      document.querySelectorAll("#durRow .dur-opt").forEach((e) => e.classList.remove("active"));
      opt.classList.add("active");
      seleccion.duracion = t.d;
      seleccion.precio = t.p;
      seleccion.etiquetaDuracion = t.d;
      actualizarTotal();
    });
    els.durRow.appendChild(opt);
  });
  const t0 = tabla[0];
  seleccion.duracion = t0.d;
  seleccion.precio = t0.p;
  seleccion.etiquetaDuracion = t0.d;
  actualizarTotal();
}

function renderDetalles(lista) {
  if (!lista) return;
  els.cardInfo.style.display = "block";
  els.detalleList.innerHTML = "";
  lista.forEach((texto) => {
    const li = document.createElement("li");
    li.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg><span>${texto}</span>`;
    els.detalleList.appendChild(li);
  });
}

function actualizarTotal() {
  els.totalPrecio.textContent = `L${seleccion.precio}`;
}

/* ---------------------------------------------------------
   Agregar al carrito (guardado en sessionStorage, lo lee carrito.html)
--------------------------------------------------------- */
els.btnAgregar.addEventListener("click", () => {
  let carrito = [];
  try { carrito = JSON.parse(sessionStorage.getItem("subli_carrito") || "[]"); } catch (e) {}

  carrito.push({
    catId,
    prodId,
    nombre: prod.nombre,
    logo: prod.logo,
    plan: seleccion.plan,
    duracion: seleccion.etiquetaDuracion,
    precio: seleccion.precio,
    cantidad: 1
  });

  sessionStorage.setItem("subli_carrito", JSON.stringify(carrito));

  els.btnAgregar.querySelector(".btn-label").textContent = "¡Agregado! ✓";
  setTimeout(() => {
    window.location.href = "carrito.html";
  }, 600);
});
