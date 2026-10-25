import Link from "next/link";
import { getUser } from "@/lib/auth";

const STEPS = [
  { n: "1", t: "Crea tu modelo", d: "Descríbelo o sube tus 3 referencias (frontal, 3/4 y perfil). Eliges la cara que será la base de todo." },
  { n: "2", t: "Prompt del personaje", d: "La IA analiza la cara y escribe una descripción exacta del modelo para mantener la consistencia." },
  { n: "3", t: "Contenido lifestyle", d: "Tandas de escenas por colección: café, viajes, gimnasio, moda… siempre con la misma cara." },
  { n: "4", t: "Animación", d: "Vídeo con frame inicial y final con Veo y Kling. Próximamente." },
];

const FEATURES = [
  { t: "Consistencia total", d: "Tu modelo usa su cara de referencia y su prompt en cada imagen, así que se ve igual en cualquier escena." },
  { t: "Realismo fotográfico", d: "Estilo de poros, imperfecciones y luz natural para que el resultado no parezca plástico." },
  { t: "Intercambiar cara", d: "Sube referencias de Pinterest y tu modelo las recrea con su cara: misma pose, ropa, fondo y luz." },
  { t: "Varios proveedores de IA", d: "Gemini (Nano Banana), OpenAI (GPT Image) y Replicate (Flux). Cambias de uno a otro en un clic." },
  { t: "Tus propias API keys", d: "Conectas tus claves en Configuración, se verifican al guardar y se almacenan cifradas. Pagas directo a cada proveedor." },
  { t: "Colecciones y galería", d: "Organiza lo que generas por modelo y colección, y descárgalo cuando quieras." },
];

export default async function Landing() {
  const user = await getUser();
  const cta = user ? { href: "/modelos", label: "Ir a la app" } : { href: "/registro", label: "Crear cuenta" };
  return (
    <>
      <section className="hero">
        <div className="wrap">
          <div className="pill">Influencers con IA, de principio a fin</div>
          <h1>Crea un influencer hiperrealista y llena su feed de contenido</h1>
          <p>Modelo base, ángulos de consistencia, contenido lifestyle y vídeo. El flujo completo en una sola app, sin depender de nadie.</p>
          <div className="row" style={{ justifyContent: "center" }}>
            <Link href={cta.href} className="btn-link primary big">{cta.label}</Link>
            {!user && <Link href="/login" className="btn-link big">Ya tengo cuenta</Link>}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="sec">
        <div className="wrap">
          <h2 className="sec-t">Cómo funciona</h2>
          <div className="cards4">
            {STEPS.map((s) => (
              <div key={s.n} className="card">
                <div className="num">{s.n}</div>
                <div className="name">{s.t}</div>
                <p className="used">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="funciones" className="sec alt">
        <div className="wrap">
          <h2 className="sec-t">Todo lo que necesitas</h2>
          <div className="cards3">
            {FEATURES.map((f) => (
              <div key={f.t} className="card">
                <div className="name">{f.t}</div>
                <p className="used">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="precios" className="sec">
        <div className="wrap" style={{ maxWidth: 520 }}>
          <h2 className="sec-t">Todo incluido</h2>
          <div className="card plan">
            <div className="name" style={{ fontSize: 20 }}>Acceso anticipado</div>
            <ul>
              <li>Modelos y colecciones sin límite</li>
              <li>Generación, ángulos, lifestyle e intercambio de cara</li>
              <li>Conecta tus API de Gemini, OpenAI y Replicate</li>
              <li>Galería y almacenamiento de tus imágenes</li>
              <li>Cuenta privada: tus modelos y claves solo los ves tú</li>
            </ul>
            <Link href={cta.href} className="btn-link primary big" style={{ display: "block", textAlign: "center" }}>{cta.label}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
