export const REALISM = `Shot on iPhone 14 Pro main camera, real optical behavior, natural lens falloff, true depth of field, subtle computational optics, micro-aberrations, realistic smartphone lens distortion, handheld imperfection; soft natural daylight from window, diffused directional key light, balanced contrast, gentle highlight roll-off, realistic skin sheen, physically accurate subsurface scattering, no beauty lighting, no flattening; preserve natural identity and bone structure, realistic smile lines and micro-creases around lips, natural asymmetry, authentic expression, visible pores on cheeks, nose and around mouth, slight redness and tone variation, tiny barely noticeable blemish, faint texture irregularities, natural skin oils reflecting light on lips and cheekbones; minimal makeup only, light base that does not hide pores, visible skin grain through foundation, natural lip texture, not plastic, not flat; ultra-detailed skin textures, visible pores, fine skin grain, micro-hair, natural blemishes, realistic specular highlights, organic surface variation; raw but refined aesthetic, human imperfection celebrated, commercial-grade color science without retouching; hyperrealistic detail, natural grain, photometric accuracy, tactile skin texture, smartphone photography authenticity, imperfect beauty, unretouched look`;

export const BASE_PROMPT =
  "Fotografía de retrato realista estilo 35mm de una influencer lifestyle, iluminación natural, textura de piel detallada con poros visibles y pequeñas imperfecciones reales, mirada natural a la cámara, estética orgánica de red social.";

export const ANGLES = [
  { id: "frontal", label: "Frontal", prompt: "Front view of the same person, facing the camera straight on, same face, same skin details and lighting style." },
  { id: "tres_cuartos", label: "3/4", prompt: "Three-quarter view of the same person, head turned about 45 degrees from the camera, same face, same skin details and lighting style." },
  { id: "perfil", label: "Perfil", prompt: "Side profile view of the same person, 90 degrees to the camera, same face, same skin details and lighting style." },
] as const;

export const ASPECTS = [
  { id: "3:4", label: "3:4 Retrato" },
  { id: "1:1", label: "1:1 Cuadrado" },
  { id: "9:16", label: "9:16 Vertical" },
  { id: "16:9", label: "16:9 Horizontal" },
];

export const ANALYSIS_PROMPT = `Analiza minuciosamente de forma visual y especializada todas las fotos de esta persona. Genera un desglose detallado en formato Markdown con sus parámetros físicos exactos para garantizar la consistencia visual:
- Rostro: forma de la cara, estructura ósea, ojos, mirada, cejas y labios.
- Piel: textura, tono, pecas e imperfecciones naturales.
- Cabello: color, estilo, textura, densidad y volumen.
- Expresión y lenguaje corporal: actitud habitual, tipo de sonrisa y postura.
Proporciona la respuesta en texto Markdown limpio sin explicaciones adicionales para guardarlo como archivo de conocimiento. No identifiques a la persona ni especules sobre datos personales: describe solo lo visible.`;

export const LIFESTYLE_THEMES: { id: string; label: string; scenes: string[] }[] = [
  { id: "cafe", label: "Café y mañana", scenes: [
    "sitting at a sunny café table with a latte, casual morning outfit",
    "walking down a city street holding a coffee cup, golden morning light",
    "reading a book by the café window, soft natural light",
    "ordering at the counter of a cozy coffee shop, candid moment",
    "laptop on the table at a bright café, relaxed smile",
    "taking a mirror selfie in a cozy cafe restroom, casual outfit" ] },
  { id: "gym", label: "Gimnasio y deporte", scenes: [
    "tying sneakers before a workout, gym locker room, natural light",
    "mirror selfie in activewear at the gym, candid",
    "stretching on a yoga mat at home, morning light",
    "running in a park at sunrise, ponytail, sporty outfit",
    "drinking water after a workout, towel around neck" ] },
  { id: "viajes", label: "Viajes", scenes: [
    "standing on a balcony overlooking a coastal town, summer dress",
    "walking through a cobblestone old town with a small backpack",
    "sitting by an airplane window, soft light, relaxed expression",
    "on a beach at golden hour, wind in her hair, casual outfit",
    "looking at a map at a train station, travel outfit" ] },
  { id: "casa", label: "En casa", scenes: [
    "lying on the couch with a blanket and a mug, cozy living room",
    "cooking in a bright kitchen, relaxed home outfit",
    "reading on a bed with morning light through the curtains",
    "watering plants by the window, casual loungewear",
    "working from a home desk with a laptop, natural light" ] },
  { id: "noche", label: "Salida de noche", scenes: [
    "getting ready in front of a mirror, evening makeup, warm light",
    "at a rooftop bar at dusk, cocktail in hand, elegant dress",
    "walking on a city street at night, neon reflections",
    "laughing at a restaurant table, candid moment, warm ambient light" ] },
  { id: "moda", label: "Moda y estilo", scenes: [
    "full-body outfit photo in front of a plain wall, street style",
    "trying on a jacket in a boutique fitting room, mirror shot",
    "walking in a city crosswalk, trendy outfit, candid street photography",
    "sitting on a bench with shopping bags, fashion editorial feel" ] },
];

export type ModelInfo = { id: string; provider: string; providerName: string; label: string; needsRef?: boolean; singleRef?: boolean };

export const MODELS: ModelInfo[] = [
  { id: "gemini-3-pro-image-preview", provider: "gemini", providerName: "Google Gemini", label: "Nano Banana Pro" },
  { id: "gemini-2.5-flash-image", provider: "gemini", providerName: "Google Gemini", label: "Nano Banana" },
  { id: "gpt-image-2", provider: "openai", providerName: "OpenAI", label: "GPT Image 2" },
  { id: "gpt-image-1.5", provider: "openai", providerName: "OpenAI", label: "GPT Image 1.5" },
  { id: "black-forest-labs/flux-kontext-pro", provider: "replicate", providerName: "Replicate", label: "Flux Kontext Pro (necesita imagen)", needsRef: true, singleRef: true },
  { id: "black-forest-labs/flux-1.1-pro", provider: "replicate", providerName: "Replicate", label: "Flux 1.1 Pro" },
];


export const FROM_IMAGE_PROMPT =
  "Recrea a esta persona como una fotografía hiperrealista, conservando su identidad, rasgos y estructura ósea. Retrato cercano, mirada natural a la cámara, piel con poros visibles e imperfecciones reales.";
