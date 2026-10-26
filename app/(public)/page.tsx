import Link from "next/link";
import { getUser } from "@/lib/auth";
import HeroStudioDemo from "@/components/HeroStudioDemo";
import ConsistencyShowcase from "@/components/ConsistencyShowcase";
import StepByStepMethod from "@/components/StepByStepMethod";
import FeedCollectionGallery from "@/components/FeedCollectionGallery";
import FaqSection from "@/components/FaqSection";

export default async function Landing() {
  const user = await getUser();
  const cta = user
    ? { href: "/modelos", label: "Ir al Estudio de Modelos" }
    : { href: "/registro", label: "Crear mi Influencer" };

  return (
    <div className="landing-container">
      {/* Background ambient lighting orbs */}
      <div className="ambient-glow glow-top" aria-hidden="true" />
      <div className="ambient-glow glow-middle" aria-hidden="true" />
      <div className="ambient-glow glow-bottom" aria-hidden="true" />

      {/* HERO SECTION */}
      <section className="hero-modern">
        <div className="wrap">
          <div className="hero-pill-badge">
            <span className="hero-pill-sparkle">✨</span>
            <span className="hero-pill-text">Plataforma Profesional de Influencers con IA</span>
            <span className="hero-pill-dot" />
            <span className="hero-pill-sub">Cara de referencia en cada imagen</span>
          </div>

          <h1 className="hero-headline">
            Crea un Influencer <span className="gradient-text">Hiperrealista</span> y Llena su Feed de Contenido
          </h1>

          <p className="hero-lead">
            Diseña un rostro propio con textura de piel natural. Fija sus 3 ángulos de referencia para mantener
            la consistencia, genera sesiones lifestyle en distintos escenarios y, próximamente, anímalo en vídeo.
            Sin depender de agencias ni modelos tradicionales.
          </p>

          <div className="hero-actions-row">
            <Link href={cta.href} className="btn-glow-hero">
              <span>{cta.label}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            {!user && (
              <Link href="/login" className="btn-secondary-hero">
                <span>Ya tengo cuenta</span>
              </Link>
            )}
            <a href="#como-funciona" className="btn-secondary-hero">
              <span>Ver Metodología ↓</span>
            </a>
          </div>

          {/* Social Proof & Trust Metrics Bar */}
          <div className="hero-metrics-ribbon">
            <div className="metric-item">
              <span className="metric-val">3 ángulos</span>
              <span className="metric-lbl">Referencias de rostro</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-val">Realismo</span>
              <span className="metric-lbl">Estilo con poros y textura</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-val">Modelo BYOK</span>
              <span className="metric-lbl">Pagas directo a cada IA</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-val">Multi-IA</span>
              <span className="metric-lbl">Gemini, OpenAI y Replicate</span>
            </div>
          </div>

          {/* LIVE HERO INTERACTIVE STUDIO DEMO */}
          <HeroStudioDemo />
        </div>
      </section>

      {/* SECTION 1: CONSISTENCY 360° */}
      <section id="consistencia" className="sec-modern">
        <div className="wrap">
          <ConsistencyShowcase />
        </div>
      </section>

      {/* SECTION 2: 4-STEP PROFESSIONAL METHODOLOGY */}
      <section className="sec-modern sec-alt-surface">
        <div className="wrap">
          <StepByStepMethod />
        </div>
      </section>

      {/* SECTION 3: LIFESTYLE FEED & INSTAGRAM CREATOR GALLERY */}
      <section className="sec-modern">
        <div className="wrap">
          <FeedCollectionGallery />
        </div>
      </section>

      {/* SECTION 4: FACE SWAP & PINTEREST RECREATION */}
      <section id="funciones" className="sec-modern sec-alt-surface">
        <div className="wrap">
          <div className="section-header-center">
            <div className="pill-badge">Recreación de Tendencias</div>
            <h2 className="headline-h2">
              Convierte Cualquier Foto de Pinterest en <span className="gradient-text">Contenido de tu Influencer</span>
            </h2>
            <p className="section-subtext">
              ¿Viste una pose viral, un outfit de tendencia o una iluminación que encaja con tu marca?
              Sube la imagen de referencia y Lumia le pide a la IA que recree la escena (estilismo, luz y pose)
              con el rostro de tu influencer. El parecido y la fidelidad dependen del modelo de IA que uses.
            </p>
          </div>

          <div className="swap-showcase-card">
            <div className="swap-columns-grid">
              <div className="swap-col">
                <div className="swap-col-header">
                  <span className="swap-tag">Imagen de ejemplo</span>
                  <span className="swap-source">Así sería una referencia (Pinterest, Instagram…)</span>
                </div>
                <div className="swap-col-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/lifestyle_travel.jpg" alt="Referencia de Pose" className="swap-img" />
                  <div className="swap-col-badge">Escena de entrada</div>
                </div>
              </div>

              <div className="swap-center-indicator">
                <div className="swap-arrow-circle">
                  <span>⚡</span>
                </div>
                <span className="swap-process-label">Intercambio de cara</span>
              </div>

              <div className="swap-col">
                <div className="swap-col-header">
                  <span className="swap-tag output">Resultado de ejemplo</span>
                  <span className="swap-source">Con la cara de tu modelo</span>
                </div>
                <div className="swap-col-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/lifestyle_cafe.jpg" alt="Resultado de Intercambio" className="swap-img" />
                  <div className="swap-col-badge output">Modelo de ejemplo</div>
                </div>
              </div>
            </div>

            <div className="swap-features-bar" title="Lo que Lumia le pide a la IA que conserve">
              <div className="swap-feat-chip">
                <span>👗</span> Misma Ropa y Accesorios
              </div>
              <div className="swap-feat-chip">
                <span>💡</span> Iluminación y Sombras Coherentes
              </div>
              <div className="swap-feat-chip">
                <span>📍</span> Preservación de Fondo y Bokeh
              </div>
              <div className="swap-feat-chip">
                <span>✨</span> Adaptación de Tono de Piel
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: BRING YOUR OWN KEYS & FREEDOM */}
      <section className="sec-modern">
        <div className="wrap">
          <div className="byok-banner">
            <div className="byok-left">
              <div className="pill-badge">Filosofía Transparente</div>
              <h2 className="headline-h2" style={{ textAlign: "left" }}>
                Tus Propias API Keys: <br />
                <span className="gradient-text">Pagas Directo a Cada Proveedor</span>
              </h2>
              <p className="byok-desc">
                Muchas plataformas funcionan con suscripción y paquetes de créditos. En Lumia conectas tus propias
                claves API de Google Gemini, Replicate u OpenAI, se guardan cifradas y pagas directamente al
                proveedor según su tarifa vigente.
              </p>
              <div className="byok-keys-badges">
                <div className="byok-badge-item">
                  <span className="byok-check">✓</span>
                  <span>Google Gemini (Nano Banana Pro)</span>
                </div>
                <div className="byok-badge-item">
                  <span className="byok-check">✓</span>
                  <span>Replicate (Flux 1.1 Pro)</span>
                </div>
                <div className="byok-badge-item">
                  <span className="byok-check">✓</span>
                  <span>OpenAI (GPT Image 2)</span>
                </div>
                <div className="byok-badge-item">
                  <span className="byok-check">✓</span>
                  <span>Cifrado AES-256 en reposo</span>
                </div>
              </div>
            </div>

            <div className="byok-right">
              <div className="byok-card-visual">
                <div className="byok-field-mock">
                  <div className="byok-field-label">Gemini API Key</div>
                  <div className="byok-field-val">AIzaSy••••••••••••••••••••••••••••••</div>
                  <div className="byok-field-status">
                    <span className="status-dot green" />
                    <span>Clave verificada</span>
                  </div>
                </div>

                <div className="byok-field-mock">
                  <div className="byok-field-label">Replicate Token</div>
                  <div className="byok-field-val">r8_••••••••••••••••••••••••••••••••••</div>
                  <div className="byok-field-status">
                    <span className="status-dot green" />
                    <span>Token verificado</span>
                  </div>
                </div>

                <div className="byok-saving-box">
                  <div className="saving-label">Coste por imagen:</div>
                  <div className="saving-cost">Tarifa del proveedor</div>
                  <div className="saving-sub">Consulta el precio vigente de cada proveedor</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: COMPARATIVE TABLE */}
      <section className="sec-modern sec-alt-surface">
        <div className="wrap">
          <div className="section-header-center">
            <div className="pill-badge">Comparativa</div>
            <h2 className="headline-h2">
              ¿Por Qué Lumia Frente a <span className="gradient-text">Otras Alternativas?</span>
            </h2>
            <p className="section-subtext">
              Qué cambia frente a otras formas de producir contenido para un influencer.
            </p>
          </div>

          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Capacidad</th>
                  <th>Fotógrafo & Modelo Real</th>
                  <th>IA suelta, sin flujo</th>
                  <th className="highlight-col">Lumia AI Influencer Studio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Consistencia de Rostro</strong></td>
                  <td>Alta (es una persona real)</td>
                  <td>Suele variar entre imágenes</td>
                  <td className="highlight-col good">Cara de referencia, 3 ángulos y prompt del modelo</td>
                </tr>
                <tr>
                  <td><strong>Coste Mensual</strong></td>
                  <td>Producción, modelo y viajes</td>
                  <td>Suscripción o créditos según la herramienta</td>
                  <td className="highlight-col good">Pagas la API que uses</td>
                </tr>
                <tr>
                  <td><strong>Velocidad de Creación</strong></td>
                  <td>Días o semanas</td>
                  <td>Minutos, con varios intentos</td>
                  <td className="highlight-col good">Segundos o minutos por imagen, según el proveedor</td>
                </tr>
                <tr>
                  <td><strong>Locaciones & Viajes</strong></td>
                  <td>Viajes y traslados</td>
                  <td>Depende del prompt</td>
                  <td className="highlight-col good">Escenas por prompt, organizadas en colecciones</td>
                </tr>
                <tr>
                  <td><strong>Efecto Piel de Plástico</strong></td>
                  <td>No aplica</td>
                  <td>La piel puede salir muy lisa</td>
                  <td className="highlight-col good">Estilo de realismo opcional (poros, textura)</td>
                </tr>
                <tr>
                  <td><strong>Animación a Vídeo</strong></td>
                  <td>Días de grabación</td>
                  <td>Herramientas aparte</td>
                  <td className="highlight-col good">Veo y Kling: próximamente</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 7: PRICING / ACCESS */}
      <section id="precios" className="sec-modern">
        <div className="wrap">
          <div className="section-header-center">
            <div className="pill-badge">Acceso</div>
            <h2 className="headline-h2">
              Todo Incluido en el <span className="gradient-text">Acceso Anticipado</span>
            </h2>
            <p className="section-subtext">
              Crea tu cuenta y empieza a construir el feed de tu influencer.
            </p>
          </div>

          <div className="pricing-container">
            <div className="pricing-card-spotlight">
              <div className="pricing-card-badge">Acceso anticipado</div>
              <div className="pricing-card-header">
                <div className="pricing-tier-title">Lumia Creator Studio</div>
                <div className="pricing-price-row">
                  <span className="price-amount">Acceso anticipado</span>
                  <span className="price-period">precio por anunciar</span>
                </div>
                <p className="pricing-sub-desc">
                  Conecta tus claves API y empieza a construir el feed de tu influencer inmediatamente.
                </p>
              </div>

              <div className="pricing-divider" />

              <div className="pricing-features-list">
                <div className="pricing-feat-row">
                  <span className="pricing-check">✓</span>
                  <span><strong>Varios modelos:</strong> crea los influencers que necesites</span>
                </div>
                <div className="pricing-feat-row">
                  <span className="pricing-check">✓</span>
                  <span><strong>Ángulos de consistencia:</strong> Frontal, 3/4 y Perfil como referencia</span>
                </div>
                <div className="pricing-feat-row">
                  <span className="pricing-check">✓</span>
                  <span><strong>Colecciones Lifestyle:</strong> Tandas masivas de café, viajes, moda y fitness</span>
                </div>
                <div className="pricing-feat-row">
                  <span className="pricing-check">✓</span>
                  <span><strong>Intercambio de Cara (Pinterest):</strong> Recreación fiel de poses y estilismos</span>
                </div>
                <div className="pricing-feat-row">
                  <span className="pricing-check">✓</span>
                  <span><strong>Integraciones:</strong> Gemini (Nano Banana), Flux 1.1 Pro y OpenAI (GPT Image)</span>
                </div>
                <div className="pricing-feat-row">
                  <span className="pricing-check">✓</span>
                  <span><strong>Cuenta privada:</strong> otros usuarios no ven tus modelos ni tus claves</span>
                </div>
              </div>

              <div className="pricing-action-wrap">
                <Link href={cta.href} className="btn-glow-hero" style={{ width: "100%", justifyContent: "center" }}>
                  <span>{cta.label}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <div className="pricing-guarantee-note">
                  🔒 No requiere tarjeta de crédito para registrarte
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: FAQ */}
      <section id="faq" className="sec-modern sec-alt-surface">
        <div className="wrap">
          <FaqSection />
        </div>
      </section>

      {/* SECTION 9: FINAL CALL TO ACTION BANNER */}
      <section className="sec-modern">
        <div className="wrap">
          <div className="final-cta-card">
            <div className="final-cta-content">
              <div className="pill-badge">Empieza hoy</div>
              <h2 className="headline-h2" style={{ fontSize: "clamp(28px, 4vw, 42px)", marginBottom: 16 }}>
                Construye la Próxima Gran <span className="gradient-text">Marca con Influencers Virtuales</span>
              </h2>
              <p className="final-cta-desc">
                Crea tu primer modelo, fija sus rasgos y genera sus primeras sesiones lifestyle.
              </p>
              <div className="final-cta-buttons">
                <Link href={cta.href} className="btn-glow-hero">
                  <span>{cta.label}</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                {!user && (
                  <Link href="/login" className="btn-secondary-hero">
                    <span>Iniciar Sesión</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
