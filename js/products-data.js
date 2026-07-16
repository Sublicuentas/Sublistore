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
  {
    id: "combo-disney-crunchy", nombre: "Combo Disney+ & Crunchyroll", logo: "disney", logo2: "crunchyroll",
    planesFijos: true,
    detalles: [
      "Incluye Disney+ Premium (sin ESPN) y Crunchyroll Mega Fan en un solo pago",
      "1 pantalla vigente por cada plataforma · Acceso por código",
      "Calidad 4K FHD · Garantía incluida"
    ],
    planes: [
      { nombre: "Combo 1 Pantalla", precio: 110, periodo: "mes", badge: "Oferta",
        detalles: [
          "Incluye Disney+ Premium (sin ESPN) y Crunchyroll Mega Fan",
          "1 pantalla vigente por cada plataforma · Acceso por código",
          "Calidad 4K FHD · Garantía incluida"
        ] }
    ]
  },
  {
    id: "hbo", nombre: "HBO Max", logo: "hbo", planesFijos: true,
    incluye: "Estrenos y originales exclusivos · Acceso por código - no se brinda correo/clave · Garantía incluida",
    detalles: ["1 dispositivo · Full HD", "Acceso por código - no se brinda correo ni clave", "Estrenos y originales exclusivos · Garantía incluida"],
    planes: [{ nombre: "1 Dispositivo", tabla: [
      { d: "1 mes", p: 80 },
      { d: "3 meses", p: 210 },
      { d: "4 meses", p: 270, bono: "+3 días" }
    ]}]
  },
  {
    id: "prime", nombre: "Prime Video", logo: "prime", planesFijos: true,
    incluye: "Full HD · Series y películas exclusivas · Solo catálogo Prime - no incluye compras ni rentas · Acceso por código",
    detalles: ["1 dispositivo · Acceso por código", "Full HD · Series y películas exclusivas", "Solo catálogo Prime - no incluye compras ni rentas"],
    planes: [{ nombre: "1 Dispositivo", tabla: [
      { d: "1 mes", p: 80 },
      { d: "3 meses", p: 210 },
      { d: "4 meses", p: 270, bono: "+3 días" }
    ]}]
  },
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
  {
    id: "vix", nombre: "Vix", logo: "vix", planesFijos: true,
    incluye: "Películas, series y novelas mexicanas de todas las épocas · Canales en vivo · Noticias · Deportes latinos · Se brinda correo y contraseña · Garantía incluida",
    detalles: ["Se brinda correo y contraseña", "Películas, series y novelas mexicanas de todas las épocas", "Canales en vivo · Noticias · Deportes latinos · Garantía incluida"],
    planes: [{ nombre: "1 Dispositivo", tabla: [
      { d: "1 mes", p: 70 },
      { d: "3 meses", p: 120, bono: "Ahorro vs mensual" }
    ]}]
  },
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


// -------------------- RECARGAS GAMING --------------------
// Requieren el ID del jugador para procesar la recarga. Ese dato se pide
// en el paso del carrito (no en esta pantalla de producto).
export const PRODUCTOS_JUEGOS = [
  {
    id: "freefire", nombre: "Free Fire - Diamantes", logo: "freefire", planesFijos: true,
    requiereID: true,
    detalles: ["Recarga por código ID · Rápido y seguro", "Entrega directa a tu cuenta de Free Fire", "Precios accesibles · Garantía incluida"],
    planes: [{ nombre: "Diamantes", tabla: [
      { d: "120 Diamantes", p: 29 },
      { d: "341 Diamantes", p: 89 },
      { d: "572 Diamantes", p: 129 },
      { d: "1166 Diamantes", p: 249, bono: "Más vendido" },
      { d: "2398 Diamantes", p: 499 },
      { d: "6170 Diamantes", p: 1199 }
    ]}]
  },
  {
    id: "pubgmobile", nombre: "PUBG Mobile - UC", logo: "pubgmobile", planesFijos: true,
    requiereID: true,
    detalles: ["Recarga por código · Rápida y segura", "Entrega directa a tu cuenta de PUBG Mobile", "Precios accesibles · Garantía incluida"],
    planes: [{ nombre: "UC", tabla: [
      { d: "60 UC", p: 30 },
      { d: "660 UC", p: 260, bono: "Más vendido" },
      { d: "1800 UC", p: 640 }
    ]}]
  }
];

export const CATALOGO = {
  tv: PRODUCTOS_TV,
  musica: PRODUCTOS_MUSICA,
  iptv: PRODUCTOS_IPTV,
  ia: PRODUCTOS_IA,
  diseno: PRODUCTOS_DISENO,
  juegos: PRODUCTOS_JUEGOS,
  software: PRODUCTOS_SOFTWARE
};

// Ofertas: referencias (catId + id) a productos reales del catálogo que
// ya traen descuento/bono por duración. No duplica datos — apunta a los
// mismos productos, la categoría "Ofertas" solo los agrupa.
// (Alineado con la pestaña "Ofertas" real del catálogo principal.)
export const OFERTAS = [
  { catId: "tv", id: "combo-disney-crunchy", tag: "Oferta 2 en 1" },
  { catId: "tv", id: "hbo", tag: "3 meses L210" },
  { catId: "tv", id: "prime", tag: "3 meses L210" },
  { catId: "tv", id: "vix", tag: "3 meses L120" },
  { catId: "tv", id: "crunchyroll", tag: "Paga 2, lleva 3" }
];

// Duraciones genéricas para productos "simples" (precioBase) que SÍ
// admiten selector de 1 a 6 meses (todo excepto TV Digital/streaming,
// que usa sus planes propios o precio fijo mensual único).
// Descuento fijo en Lempiras según los meses (no multiplicador): 2 meses -L10,
// 3 meses -L20, 4 meses -L30, 5 meses -L40, 6 meses -L50. Sin planes anuales.
export const DURACIONES_GENERICAS = [
  { meses: 1, descuento: 0 },
  { meses: 2, descuento: 10 },
  { meses: 3, descuento: 20 },
  { meses: 4, descuento: 30 },
  { meses: 5, descuento: 40 },
  { meses: 6, descuento: 50 }
];

export function whatsappLink(texto) {
  return "https://wa.me/50432126332?text=" + encodeURIComponent(texto);
}
