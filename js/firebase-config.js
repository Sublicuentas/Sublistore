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

// 🔧 Config real del proyecto sublicuentasbot (mismo que el bot/CRM):
const firebaseConfig = {
  apiKey: "AIzaSyA_b1a0Zo4OIAj4KayD5ChtPWToANQ1nrA",
  authDomain: "sublicuentasbot.firebaseapp.com",
  projectId: "sublicuentasbot",
  storageBucket: "sublicuentasbot.firebasestorage.app",
  messagingSenderId: "17227154881",
  appId: "1:17227154881:web:533ca1b4a97da4acd95b40"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// URL a la que se vuelve cuando el usuario toca "Volver al Catálogo"
// y también a donde se redirige tras iniciar sesión / registrarse.
export const CATALOGO_URL = "https://catalogo.imitatiko.lat";
