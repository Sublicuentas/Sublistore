// =========================================================
// SUBLISTORE — Catálogo de productos (datos reales del catálogo)
// Precios en Lempiras (HNL). "meses" = duraciones disponibles.
// planesFijos:true = el producto ya trae sus propios planes con
// precio propio (no aplica el selector genérico de 1/3/6/12 meses).
// =========================================================

export const CATEGORIAS = [
  { id: "ofertas", nombre: "Ofertas", icono: "🔥" },
  { id: "tv", nombre: "Cine y series", icono: "🎬" },
  { id: "musica", nombre: "Música", icono: "🎵" },
  { id: "iptv", nombre: "TV digital", icono: "📺" },
  { id: "juegos", nombre: "Recargas Gaming", icono: "🎮" },
  { id: "ia", nombre: "IA y educación", icono: "🎓" },
  { id: "diseno", nombre: "Zona creativa", icono: "🎨" },
  { id: "software", nombre: "Antivirus y Software", icono: "💻" }
];

// -------------------- CINE Y SERIES (streaming) --------------------
// Nota: estas plataformas usan "planes" propios (perfil/PIN vs VIP,
// básico vs premium) — NO usan el selector de 1/3/6/12 meses.
export const PRODUCTOS_TV = [
  {
    id: "netflix", nombre: "Netflix", logo: "netflix", planesFijos: true,
    planes: [
      { nombre: "Cuenta Premium", precio: 130, periodo: "mes",
        detalles: ["1 dispositivo · Perfil con PIN", "Acceso por código - no se brinda correo ni clave", "Código hogar cada 20 días"] },
      { nombre: "VIP ⭐", precio: 150, periodo: "mes", badge: "Premium",
        detalles: ["Perfil personal · Se brinda correo y clave", "Multidispositivo · Visualiza en uno a la vez", "Sin código hogar"] }
    ]
  },
  {
    id: "disney", nombre: "Disney+", logo: "disney", planesFijos: true,
    planes: [
      { nombre: "Premium", precio: 100, periodo: "mes",
        detalles: ["1 dispositivo · Perfil con PIN · Acceso por código", "Todo el catálogo Disney y Hulu", "Todos los canales ESPN y deportes"] },
      { nombre: "Básico", precio: 70, periodo: "mes", badge: "Popular",
        detalles: ["1 dispositivo · Perfil con PIN · Acceso por código", "Marvel, Star Wars, Pixar, Hulu, Fox, National Geographic", "Sin canales ESPN"] }
    ]
  },
  { id: "hbo", nombre: "HBO Max", logo: "hbo", precioBase: 80,
    detalles: ["1 dispositivo · 30 días · Full HD", "Acceso por código - no se brinda correo/clave", "Estrenos y originales exclusivos · Garantía"] },
  { id: "prime", nombre: "Prime Video", logo: "prime", precioBase: 80,
    detalles: ["1 dispositivo · 30 días · Acceso por código", "Full HD · Series y películas exclusivas", "Solo catálogo Prime - no incluye compras ni rentas"] },
  {
    id: "crunchyroll", nombre: "Crunchyroll", logo: "crunchyroll", planesFijos: true,
    incluye: "Estrenos simultáneos con Japón · Todo el catálogo oficial de anime en HD · Soporte todo el año",
    planes: [
      { nombre: "Plan Mega Fan · 1 Dispositivo", tabla: [
        { d: "1 mes", p: 80 }, { d: "2 meses", p: 150 },
        { d: "3 meses", p: 220, bono: "+5 días" },
        { d: "6 meses", p: 420, bono: "+15 días" }
      ]}
    ]
  },
  { id: "vix", nombre: "Vix", logo: "vix", precioBase: 70,
    detalles: ["Se brinda correo y contraseña · 30 días", "Películas, series y novelas mexicanas de todas las épocas", "Garantía incluida", "Canales en vivo · Noticias · Deportes latinos"] },
  { id: "paramount", nombre: "Paramount+", logo: "paramount", precioBase: 80,
    detalles: ["1 dispositivo · 30 días · Acceso por código · Garantía", "UFC en vivo · Eventos de artes marciales mixtas", "Series Paramount Originals · CBS · Películas de estreno"] },
  { id: "viki", nombre: "Viki Rakuten", logo: "viki", precioBase: 80,
    detalles: ["1 dispositivo · 30 días", "Acceso a todo el catálogo Viki - K-dramas, doramas, anime", "Contenido en idioma natal con subtítulos en español", "Sin doblaje latino - solo subtitulado · Garantía"] }
];

// -------------------- MÚSICA --------------------
export const PRODUCTOS_MUSICA = [
  { id: "spotify", nombre: "Spotify Premium", logo: "spotify", precioBase: 110,
    detalles: ["Cuenta individual · Sin anuncios", "Descarga música offline", "Calidad de audio alta"] },
  { id: "deezer", nombre: "Deezer Premium", logo: "deezer", precioBase: 80,
    detalles: ["1 plan disponible", "Sin anuncios · Descarga offline"] },
  { id: "youtube", nombre: "YouTube Premium", logo: "youtube", precioBase: 90,
    detalles: ["Sin anuncios en YouTube y YouTube Music", "Reproducción en segundo plano"] }
];

// -------------------- IPTV --------------------
// Estos SÍ traen tabla de planes con duración/precio propia (no tocar).
export const PRODUCTOS_IPTV = [
  {
    id: "oleada", nombre: "Oleada TV", logo: "oleada", planesFijos: true,
    activacionTV: "Para Smart TV LG y Samsung: se instala mediante la app SmartOne IPTV (activación Lps. 80/año, incluye 1 activación de regalo). Para Android, TV Box, TV Stick o celular: se asigna usuario y contraseña directo en la app oficial, sin costo extra.",
    compatibilidad: {
      ok: "Android · Android TV · TV Box · TV Stick · Versión Web",
      no: "Smart TV Samsung · Smart TV LG · iPhone/iPad (solo modo web)"
    },
    planes: [
      { nombre: "Personal · 1 Dispositivo", tabla: [
        { d: "1 mes", p: 90 }, { d: "3 meses", p: 250 },
        { d: "6 meses", p: 450, bono: "+1 mes GRATIS" },
        { d: "12 meses", p: 850, bono: "+2 meses GRATIS" }
      ]},
      { nombre: "Familiar · 3 Dispositivos", tabla: [
        { d: "1 mes", p: 200 }, { d: "3 meses", p: 550 },
        { d: "6 meses", p: 1000, bono: "+1 mes GRATIS" },
        { d: "12 meses", p: 1900, bono: "+2 meses GRATIS" }
      ]}
    ]
  },
  {
    id: "latintv", nombre: "Latin TV", logo: "latintv", planesFijos: true,
    activacionTV: "Para Smart TV LG y Samsung: se instala mediante la app SmartOne IPTV (activación Lps. 80/año, incluye 1 activación de regalo). Para Android, TV Box, TV Stick o celular: se asigna usuario y contraseña directo en la app oficial, sin costo extra.",
    catalogo: "+5,000 canales en vivo · +19,000 películas · +5,000 series",
    incluye: "Canales HD/FHD · Deportes en vivo · Contenido Premium · Acceso inmediato · Demo gratis 6 horas",
    planes: [
      { nombre: "Plan 1 · 1 Pantalla", tabla: [
        { d: "1 mes", p: 99 }, { d: "4 meses", p: 299, bono: "Paga 3" },
        { d: "7 meses", p: 699, bono: "Lleva 8" }, { d: "9 meses", p: 899, bono: "Lleva 12" }
      ]},
      { nombre: "Plan 2 · 2 Pantallas", tabla: [
        { d: "1 mes", p: 149 }, { d: "4 meses", p: 449, bono: "Paga 3" },
        { d: "7 meses", p: 1049, bono: "Lleva 8" }, { d: "9 meses", p: 1349, bono: "Lleva 12" }
      ]},
      { nombre: "Plan 3 · 3 Pantallas", tabla: [
        { d: "1 mes", p: 199 }, { d: "4 meses", p: 599, bono: "Paga 3" },
        { d: "7 meses", p: 1399, bono: "Lleva 8" }, { d: "9 meses", p: 1799, bono: "Lleva 12" }
      ]},
      { nombre: "Plan 4 · 4 Pantallas", tabla: [
        { d: "1 mes", p: 249 }, { d: "4 meses", p: 749, bono: "Paga 3" },
        { d: "7 meses", p: 1749, bono: "Lleva 8" }, { d: "9 meses", p: 2249, bono: "Lleva 12" }
      ]}
    ]
  },
  {
    id: "liontv", nombre: "Lion TV", logo: "🦁", planesFijos: true,
    activacionTV: "Para Smart TV LG y Samsung: se instala mediante la app SmartOne IPTV (activación Lps. 80/año, incluye 1 activación de regalo). Para Android, TV Box, TV Stick o celular: se asigna usuario y contraseña directo en la app oficial, sin costo extra.",
    incluye: "Activación inmediata · Servicio estable sin interrupciones · Soporte especializado · Demo gratis de 6 horas",
    planes: [
      { nombre: "Plan 1 · 1 Conexión", tabla: [
        { d: "1 mes", p: 250 }, { d: "3 meses", p: 750, bono: "+15 días" },
        { d: "5 meses", p: 1250, bono: "+1 mes" }, { d: "10 meses", p: 2500, bono: "+2 meses" }
      ]},
      { nombre: "Plan 2 · 2 Conexiones", tabla: [
        { d: "1 mes", p: 275 }, { d: "3 meses", p: 825, bono: "+15 días" },
        { d: "5 meses", p: 1375, bono: "+1 mes" }, { d: "10 meses", p: 2750, bono: "+2 meses" }
      ]},
      { nombre: "Plan 3 · 3 Conexiones", tabla: [
        { d: "1 mes", p: 300 }, { d: "3 meses", p: 900, bono: "+15 días" },
        { d: "5 meses", p: 1500, bono: "+1 mes" }, { d: "10 meses", p: 3000, bono: "+2 meses" }
      ]},
      { nombre: "Plan 5 · 5 Conexiones", tabla: [
        { d: "1 mes", p: 400 }, { d: "3 meses", p: 1200, bono: "+15 días" },
        { d: "5 meses", p: 2000, bono: "+1 mes" }, { d: "10 meses", p: 4000, bono: "+2 meses" }
      ]}
    ]
  }
];

// -------------------- IA Y EDUCACIÓN --------------------
export const PRODUCTOS_IA = [
  { id: "chatgpt", nombre: "ChatGPT Plus", logo: "chatgpt", noDisponible: true },
  { id: "gemini", nombre: "Gemini Pro", logo: "gemini", precioBase: 170,
    detalles: ["Potencia tu productividad con el modelo de IA más avanzado de Google", "Activación segura: invitación directa a tu correo personal", "Duración: 1 mes completo de acceso premium y privado"] },
  { id: "perplexity", nombre: "Perplexity", logo: "perplexity", precioBase: 600, periodoBase: "año",
    detalles: ["Se renueva cuenta existente", "Solo aplica si nunca ha tenido suscripción Plus previa"] },
  { id: "duolingo", nombre: "Duolingo Plus", logo: "duolingo", precioBase: 100,
    detalles: ["Aprende sin límites: cero anuncios, vidas infinitas y repaso de errores", "Activación rápida: invitación oficial a tu cuenta actual", "Duración: 1 mes de aprendizaje intensivo"] }
];

// -------------------- ZONA CREATIVA (Diseño) --------------------
export const PRODUCTOS_DISENO = [
  {
    id: "canva", nombre: "Canva Edu Pro", logo: "canva", planesFijos: true,
    detalles: ["Acceso completo a Canva Pro · Millones de templates premium", "Descarga sin marca de agua · Garantía incluida", "Invitación al correo personal", "Ingresa en el dispositivo de tu preferencia"],
    planes: [{ nombre: "Planes", tabla: [
      { d: "1 mes", p: 69 }, { d: "3 meses", p: 179 },
      { d: "6 meses", p: 339 }, { d: "12 meses", p: 639 }
    ]}]
  }
];

// -------------------- ANTIVIRUS Y SOFTWARE --------------------
export const PRODUCTOS_SOFTWARE = [
  { id: "office365", nombre: "Office 365", logo: "office", precioBase: 350, periodoBase: "año", badge: "5 Dispositivos",
    detalles: ["Vigencia de 1 año · Hasta 5 dispositivos", "Word, Excel, PowerPoint, Outlook, OneNote y más", "1 TB en OneDrive · Compatible Windows, Mac, iOS y Android", "Siempre actualizado · Garantía incluida"] }
];

export const CATALOGO = {
  tv: PRODUCTOS_TV,
  musica: PRODUCTOS_MUSICA,
  iptv: PRODUCTOS_IPTV,
  ia: PRODUCTOS_IA,
  diseno: PRODUCTOS_DISENO,
  software: PRODUCTOS_SOFTWARE
  // juegos: pendiente de extraer del catálogo (recargas gaming)
};

// Ofertas: referencias (catId + id) a productos reales del catálogo que
// ya traen descuento/bono por duración. No duplica datos — apunta a los
// mismos productos, la categoría "Ofertas" solo los agrupa.
export const OFERTAS = [
  { catId: "tv", id: "crunchyroll", tag: "+15 días gratis" },
  { catId: "iptv", id: "latintv", tag: "Paga 3, lleva 4" },
  { catId: "iptv", id: "liontv", tag: "+2 meses gratis" },
  { catId: "iptv", id: "oleada", tag: "+2 meses GRATIS" },
  { catId: "diseno", id: "canva", tag: "Ahorra en el plan anual" }
];

// Duraciones genéricas para productos "simples" (precioBase) que SÍ
// admiten selector de 1/3/6/12 meses (todo excepto TV Digital/streaming,
// que usa sus planes propios o precio fijo mensual único).
export const DURACIONES_GENERICAS = [
  { meses: 1, factor: 1, bono: null },
  { meses: 3, factor: 2.85, bono: null },
  { meses: 6, factor: 5.4, bono: "+15 días de regalo" },
  { meses: 12, factor: 10, bono: "+1 mes GRATIS" }
];

export function whatsappLink(texto) {
  return "https://wa.me/50432126332?text=" + encodeURIComponent(texto);
}
