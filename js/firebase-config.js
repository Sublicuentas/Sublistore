// =========================================================
// SUBLISTORE — Configuración de Firebase
// =========================================================
// 1) Andá a la consola de Firebase → Configuración del proyecto
//    → "Tus apps" → Config, y copiá los valores acá abajo.
// 2) Activá "Authentication" → método "Correo/Contraseña".
// 3) Creá una base de datos "Cloud Firestore" (modo producción
//    o prueba, según prefieras) y ajustá las reglas de acceso.
// =========================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔧 REEMPLAZÁ estos valores con los de tu proyecto de Firebase:
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO_ID",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// URL a la que se vuelve cuando el usuario toca "Volver al Catálogo"
// y también a donde se redirige tras iniciar sesión / registrarse.
export const CATALOGO_URL = "https://catalogo.imitatiko.lat";
