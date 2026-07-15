// =========================================================
// SUBLISTORE — Cloud Functions (correos transaccionales)
// Se despliega con: firebase deploy --only functions
// =========================================================
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const { Resend } = require("resend");

admin.initializeApp();

// La llave de Resend NUNCA queda escrita en este archivo ni en GitHub.
// Se guarda aparte con: firebase functions:secrets:set RESEND_API_KEY
const RESEND_API_KEY = defineSecret("RESEND_API_KEY");

const FROM = "SubliStore <bienvenida@imitatiko.lat>";
const LOGO_URL = "https://sublistore.imitatiko.lat/assets/mascot.png";

// ---------------------------------------------------------
// Plantilla base (header negro + logo, footer) para todos los correos
// ---------------------------------------------------------
function layout(contenidoHTML) {
  return `
  <div style="background:#FDF7F6;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #ECE3E0;">
      <div style="background:#0D0D0D;padding:22px;text-align:center;">
        <img src="${LOGO_URL}" width="46" alt="Sublicuentas" style="display:block;margin:0 auto 8px;border-radius:10px;" />
        <span style="color:#ffffff;font-weight:800;font-size:19px;font-family:Arial,sans-serif;">
          Subli<span style="color:#E50914;">cuentas</span>
        </span>
      </div>
      <div style="padding:30px 26px;color:#171310;">
        ${contenidoHTML}
      </div>
      <div style="background:#FDF7F6;padding:16px;text-align:center;font-size:12px;color:#A79F9A;">
        Sublicuentas · SubliStore &copy; 2026
      </div>
    </div>
  </div>`;
}

// ---------------------------------------------------------
// 1) CORREO DE BIENVENIDA
// El cliente (app.js) llama a esta función justo después de un
// registro exitoso, pasando { nombre, correo }.
// ---------------------------------------------------------
exports.enviarBienvenida = onCall({ secrets: [RESEND_API_KEY] }, async (request) => {
  const { nombre, correo } = request.data || {};
  console.log("[bienvenida] Solicitud recibida para:", correo);

  if (!correo) {
    throw new HttpsError("invalid-argument", "Falta el correo del destinatario.");
  }

  const resend = new Resend(RESEND_API_KEY.value());

  const html = layout(`
    <h1 style="font-size:22px;margin:0 0 14px;font-family:Arial,sans-serif;">
      ¡Bienvenido${nombre ? ", " + nombre.split(" ")[0] : ""}! 🎉
    </h1>
    <p style="font-size:15px;line-height:1.55;color:#4A4642;margin:0 0 14px;">
      Tu cuenta en <b>SubliStore</b> ya está lista. Desde ahora podés comprar cuentas
      premium de streaming, IPTV, recargas gaming, herramientas de IA y mucho más,
      directo desde la app.
    </p>
    <p style="font-size:15px;line-height:1.55;color:#4A4642;margin:0 0 14px;">
      Y no es todo: por cada <b>L20 que compres, ganás 1 punto VIP</b> 🌟, que después
      podés canjear por descuentos y beneficios exclusivos.
    </p>
    <a href="https://sublistore.imitatiko.lat/shop.html"
       style="display:inline-block;margin-top:10px;background:#E50914;color:#ffffff;
              font-weight:800;padding:13px 28px;border-radius:11px;text-decoration:none;
              font-family:Arial,sans-serif;font-size:14px;">
      Ir a la tienda
    </a>
  `);

  try {
    const resultado = await resend.emails.send({
      from: FROM,
      to: correo,
      subject: "¡Bienvenido a SubliStore! 🎉",
      html
    });
    console.log("[bienvenida] Respuesta de Resend:", JSON.stringify(resultado));
  } catch (err) {
    console.error("[bienvenida] ERROR al enviar con Resend:", err.message, JSON.stringify(err));
    throw new HttpsError("internal", "No se pudo enviar el correo: " + err.message);
  }

  return { ok: true };
});

// ---------------------------------------------------------
// 2) RESET DE CONTRASEÑA (con nuestra marca, en vez del correo
// genérico de Firebase)
// El cliente llama a esta función con { correo } cuando alguien
// toca "¿Olvidaste tu contraseña?".
// ---------------------------------------------------------
exports.solicitarResetPassword = onCall({ secrets: [RESEND_API_KEY] }, async (request) => {
  const { correo } = request.data || {};
  console.log("[reset] Solicitud recibida para:", correo);

  if (!correo) {
    throw new HttpsError("invalid-argument", "Falta el correo.");
  }

  let link;
  try {
    link = await admin.auth().generatePasswordResetLink(correo, {
      url: "https://sublistore.imitatiko.lat/index.html#login"
    });
    console.log("[reset] Link generado correctamente para:", correo);
  } catch (err) {
    console.warn("[reset] Correo no registrado o error generando link:", correo, err.message);
    return { ok: true };
  }

  const resend = new Resend(RESEND_API_KEY.value());

  const html = layout(`
    <h1 style="font-size:22px;margin:0 0 14px;font-family:Arial,sans-serif;">
      Restablecé tu contraseña
    </h1>
    <p style="font-size:15px;line-height:1.55;color:#4A4642;margin:0 0 14px;">
      Recibimos una solicitud para cambiar la contraseña de tu cuenta en SubliStore.
      Tocá el botón de abajo para elegir una nueva.
    </p>
    <a href="${link}"
       style="display:inline-block;margin-top:6px;background:#E50914;color:#ffffff;
              font-weight:800;padding:13px 28px;border-radius:11px;text-decoration:none;
              font-family:Arial,sans-serif;font-size:14px;">
      Cambiar contraseña
    </a>
    <p style="font-size:12.5px;color:#A79F9A;margin-top:20px;">
      Si vos no pediste esto, podés ignorar este correo con confianza — tu cuenta sigue segura.
    </p>
  `);

  try {
    const resultado = await resend.emails.send({
      from: FROM,
      to: correo,
      subject: "Restablecé tu contraseña — SubliStore",
      html
    });
    console.log("[reset] Respuesta de Resend:", JSON.stringify(resultado));
  } catch (err) {
    console.error("[reset] ERROR al enviar con Resend:", err.message, JSON.stringify(err));
    throw new HttpsError("internal", "No se pudo enviar el correo: " + err.message);
  }

  return { ok: true };
});
