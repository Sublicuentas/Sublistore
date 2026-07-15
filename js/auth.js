// =========================================================
// SUBLISTORE — Lógica de autenticación (Firebase)
// =========================================================
import { auth, db, CATALOGO_URL } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ---------------------------------------------------------
   Utilidades de UI
--------------------------------------------------------- */

// Alterna mostrar/ocultar contraseña en cualquier input con data-toggle-eye
export function initPasswordToggles() {
  document.querySelectorAll("[data-toggle-eye]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-toggle-eye");
      const input = document.getElementById(targetId);
      if (!input) return;
      const showing = input.type === "text";
      input.type = showing ? "password" : "text";
      btn.classList.toggle("is-open", !showing);
    });
  });
}

// Solo permite dígitos en el campo de WhatsApp (sin el +504)
export function initWhatsappInput(inputEl) {
  if (!inputEl) return;
  inputEl.addEventListener("input", () => {
    inputEl.value = inputEl.value.replace(/\D/g, "").slice(0, 10);
  });
}

export function showAlert(el, message, type = "error") {
  if (!el) return;
  el.textContent = "";
  const icon = document.createElement("span");
  icon.innerHTML =
    type === "error"
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;
  el.appendChild(icon);
  const span = document.createElement("span");
  span.textContent = message;
  el.appendChild(span);
  el.className = `alert show ${type === "error" ? "alert-error" : "alert-success"}`;
}

export function hideAlert(el) {
  if (!el) return;
  el.className = "alert";
}

export function setFieldError(inputShellEl, errorEl, message) {
  if (inputShellEl) inputShellEl.classList.add("has-error");
  if (errorEl) errorEl.textContent = message;
}

export function clearFieldError(inputShellEl, errorEl) {
  if (inputShellEl) inputShellEl.classList.remove("has-error");
  if (errorEl) errorEl.textContent = "";
}

export function setLoading(btnEl, isLoading) {
  if (!btnEl) return;
  btnEl.disabled = isLoading;
  btnEl.classList.toggle("loading", isLoading);
}

// Traduce los códigos de error de Firebase a mensajes claros en español
export function traducirErrorFirebase(error) {
  const code = error?.code || "";
  const map = {
    "auth/email-already-in-use": "Ese correo ya tiene una cuenta. Iniciá sesión en su lugar.",
    "auth/invalid-email": "El correo electrónico no es válido.",
    "auth/weak-password": "La contraseña debe tener al menos 8 caracteres.",
    "auth/user-not-found": "No encontramos una cuenta con ese correo.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/invalid-credential": "Correo o contraseña incorrectos.",
    "auth/too-many-requests": "Demasiados intentos. Esperá un momento y volvé a intentar.",
    "auth/network-request-failed": "Sin conexión. Revisá tu internet e intentá de nuevo.",
    "auth/missing-password": "Escribí tu contraseña."
  };
  return map[code] || "Ocurrió un error. Intentá de nuevo en unos segundos.";
}

/* ---------------------------------------------------------
   Registro: crea usuario en Auth + documento en Firestore
--------------------------------------------------------- */
export async function registrarUsuario({ nombre, whatsapp, codigoPais, correo, password, fechaNacimiento }) {
  const cred = await createUserWithEmailAndPassword(auth, correo, password);

  await updateProfile(cred.user, { displayName: nombre });

  await setDoc(doc(db, "usuarios", cred.user.uid), {
    nombre,
    whatsapp: `+${codigoPais || "504"}${whatsapp}`,
    correo,
    fechaNacimiento,
    puntos: 0,
    categoria: "sublistore",
    creadoEn: serverTimestamp()
  });

  return cred.user;
}

/* ---------------------------------------------------------
   Login
--------------------------------------------------------- */
export async function iniciarSesion({ correo, password }) {
  const cred = await signInWithEmailAndPassword(auth, correo, password);
  return cred.user;
}

/* ---------------------------------------------------------
   Recuperar contraseña por correo
--------------------------------------------------------- */
export async function recuperarContrasena(correo) {
  await sendPasswordResetEmail(auth, correo);
}

/* ---------------------------------------------------------
   Navegación de vuelta al catálogo
   - Si SubliStore corre DENTRO del iframe del catálogo (integración
     "seamless"), le avisamos al padre por postMessage para que cierre
     el modal — así nunca se ve una URL distinta ni una recarga.
   - Si alguien entra directo a sublistore.imitatiko.lat (fuera del
     iframe), navegamos normal al catálogo.
--------------------------------------------------------- */
function estaEnIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

export function volverAlCatalogo() {
  if (estaEnIframe()) {
    window.parent.postMessage({ tipo: "cerrar-substore" }, "*");
  } else {
    window.location.href = CATALOGO_URL;
  }
}

export function irACatalogoTrasAuth() {
  window.location.href = "shop.html";
}
