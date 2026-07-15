// =========================================================
// SUBLISTORE — Navegación de vistas + wiring de formularios
// =========================================================
import {
  initPasswordToggles,
  initWhatsappInput,
  showAlert,
  hideAlert,
  setFieldError,
  clearFieldError,
  setLoading,
  traducirErrorFirebase,
  registrarUsuario,
  iniciarSesion,
  recuperarContrasena,
  irACatalogoTrasAuth,
  volverAlCatalogo
} from "./auth.js";

/* ---------------------------------------------------------
   Cambio de vistas (landing / login / registro)
   - Desktop: landing siempre oculta (CSS), login/registro se
     alternan por tabs dentro del mismo panel.
   - Mobile: una vista a la vez, con back arrow.
--------------------------------------------------------- */
const views = {
  landing: document.getElementById("view-landing"),
  login: document.getElementById("view-login"),
  register: document.getElementById("view-register")
};
const mobileTopbar = document.getElementById("mobileTopbar");
const btnMobileBack = document.getElementById("btnMobileBack");

let currentView = "landing"; // solo relevante en mobile
let cameFromLanding = true;

function isMobile() {
  return window.matchMedia("(max-width: 900px)").matches;
}

function showView(name) {
  Object.entries(views).forEach(([key, el]) => {
    if (!el) return;
    el.classList.toggle("active", key === name);
  });
  currentView = name;

  // Los botones de tab solo reflejan login/registro (no aplica a landing)
  syncTabButtons(name === "register" ? "register" : "login");

  // Topbar de "volver" solo tiene sentido en mobile
  mobileTopbar.style.display = isMobile() ? "flex" : "none";

  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

function syncTabButtons(which) {
  const isLogin = which === "login";
  document.getElementById("tabLogin")?.classList.toggle("active", isLogin);
  document.getElementById("tabRegister")?.classList.toggle("active", !isLogin);
  document.getElementById("tabLogin2")?.classList.toggle("active", isLogin);
  document.getElementById("tabRegister2")?.classList.toggle("active", !isLogin);
}

function goLogin() { cameFromLanding = currentView === "landing"; showView("login"); }
function goRegister() { cameFromLanding = currentView === "landing"; showView("register"); }
function goLanding() { showView("landing"); }

// Botón "back" de mobile: desde login/registro vuelve a landing,
// desde landing vuelve al catálogo (cierra el iframe modal).
btnMobileBack.addEventListener("click", () => {
  if (currentView === "landing") {
    volverAlCatalogo();
  } else {
    goLanding();
  }
});

document.getElementById("btnGoLoginMobile")?.addEventListener("click", goLogin);
document.getElementById("btnGoRegisterMobile")?.addEventListener("click", goRegister);
document.getElementById("linkGoRegister")?.addEventListener("click", (e) => { e.preventDefault(); goRegister(); });
document.getElementById("linkGoLogin")?.addEventListener("click", (e) => { e.preventDefault(); goLogin(); });
document.getElementById("tabLogin")?.addEventListener("click", goLogin);
document.getElementById("tabRegister")?.addEventListener("click", goRegister);
document.getElementById("tabLogin2")?.addEventListener("click", goLogin);
document.getElementById("tabRegister2")?.addEventListener("click", goRegister);

window.addEventListener("resize", () => showView(currentView));

// Estado inicial (respeta #login / #register si llegan por enlace directo)
const hashView = window.location.hash.replace("#", "");
if (hashView === "register") {
  showView("register");
} else if (hashView === "login") {
  showView("login");
} else {
  showView(isMobile() ? "landing" : "login");
}

/* ---------------------------------------------------------
   Toggles de contraseña + input de WhatsApp
--------------------------------------------------------- */
initPasswordToggles();
const whatsappInput = document.getElementById("whatsapp");
initWhatsappInput(whatsappInput);

/* ---------------------------------------------------------
   FORM: Iniciar sesión
--------------------------------------------------------- */
const loginForm = document.getElementById("loginForm");
const alertLogin = document.getElementById("alertBoxLogin");
const btnIngresar = document.getElementById("btnIngresar");
const loginCorreo = document.getElementById("loginCorreo");
const loginPassword = document.getElementById("loginPassword");
const shellLoginCorreo = document.getElementById("shellLoginCorreo");
const shellLoginPassword = document.getElementById("shellLoginPassword");
const errLoginCorreo = document.getElementById("errLoginCorreo");
const errLoginPassword = document.getElementById("errLoginPassword");

function validarLogin() {
  let ok = true;
  clearFieldError(shellLoginCorreo, errLoginCorreo);
  clearFieldError(shellLoginPassword, errLoginPassword);

  if (!loginCorreo.value.trim() || !loginCorreo.value.includes("@")) {
    setFieldError(shellLoginCorreo, errLoginCorreo, "Escribí un correo válido.");
    ok = false;
  }
  if (!loginPassword.value) {
    setFieldError(shellLoginPassword, errLoginPassword, "Escribí tu contraseña.");
    ok = false;
  }
  return ok;
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideAlert(alertLogin);
  if (!validarLogin()) return;

  setLoading(btnIngresar, true);
  try {
    await iniciarSesion({ correo: loginCorreo.value.trim(), password: loginPassword.value });
    showAlert(alertLogin, "¡Bienvenido! Redirigiendo…", "success");
    setTimeout(irACatalogoTrasAuth, 700);
  } catch (err) {
    showAlert(alertLogin, traducirErrorFirebase(err), "error");
  } finally {
    setLoading(btnIngresar, false);
  }
});

document.getElementById("btnOlvide").addEventListener("click", async (e) => {
  e.preventDefault();
  hideAlert(alertLogin);
  const correo = loginCorreo.value.trim();
  if (!correo || !correo.includes("@")) {
    setFieldError(shellLoginCorreo, errLoginCorreo, "Escribí tu correo arriba para recuperar la contraseña.");
    loginCorreo.focus();
    return;
  }
  try {
    await recuperarContrasena(correo);
    showAlert(alertLogin, "Te enviamos un correo para restablecer tu contraseña.", "success");
  } catch (err) {
    showAlert(alertLogin, traducirErrorFirebase(err), "error");
  }
});

/* ---------------------------------------------------------
   FORM: Crear cuenta
--------------------------------------------------------- */
const registerForm = document.getElementById("registerForm");
const alertRegister = document.getElementById("alertBoxRegister");
const btnCrear = document.getElementById("btnCrear");

const campos = {
  nombre: { input: document.getElementById("nombre"), shell: document.getElementById("shellNombre"), err: document.getElementById("errNombre") },
  whatsapp: { input: whatsappInput, shell: document.getElementById("shellWhatsapp"), err: document.getElementById("errWhatsapp") },
  correo: { input: document.getElementById("correo"), shell: document.getElementById("shellCorreo"), err: document.getElementById("errCorreo") },
  fechaNacimiento: { input: document.getElementById("fechaNacimiento"), shell: document.getElementById("shellFecha"), err: document.getElementById("errFecha") },
  password: { input: document.getElementById("password"), shell: document.getElementById("shellPassword"), err: document.getElementById("errPassword") }
};

function validarRegistro() {
  let ok = true;
  Object.values(campos).forEach(c => clearFieldError(c.shell, c.err));

  if (!campos.nombre.input.value.trim() || campos.nombre.input.value.trim().split(/\s+/).length < 2) {
    setFieldError(campos.nombre.shell, campos.nombre.err, "Escribí tu nombre y apellido.");
    ok = false;
  }
  if (campos.whatsapp.input.value.length < 6) {
    setFieldError(campos.whatsapp.shell, campos.whatsapp.err, "Escribí tu número completo.");
    ok = false;
  }
  if (!campos.correo.input.value.trim() || !campos.correo.input.value.includes("@")) {
    setFieldError(campos.correo.shell, campos.correo.err, "Escribí un correo válido.");
    ok = false;
  }
  if (!campos.fechaNacimiento.input.value) {
    setFieldError(campos.fechaNacimiento.shell, campos.fechaNacimiento.err, "Elegí tu fecha de nacimiento.");
    ok = false;
  }
  if (campos.password.input.value.length < 8) {
    setFieldError(campos.password.shell, campos.password.err, "La contraseña debe tener mínimo 8 caracteres.");
    ok = false;
  }
  return ok;
}

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  hideAlert(alertRegister);
  if (!validarRegistro()) return;

  setLoading(btnCrear, true);
  try {
    await registrarUsuario({
      nombre: campos.nombre.input.value.trim(),
      whatsapp: campos.whatsapp.input.value.trim(),
      codigoPais: document.getElementById("whatsappCountry").value,
      correo: campos.correo.input.value.trim(),
      password: campos.password.input.value,
      fechaNacimiento: campos.fechaNacimiento.input.value
    });
    showAlert(alertRegister, "¡Cuenta creada! Redirigiendo…", "success");
    setTimeout(irACatalogoTrasAuth, 900);
  } catch (err) {
    showAlert(alertRegister, traducirErrorFirebase(err), "error");
  } finally {
    setLoading(btnCrear, false);
  }
});
