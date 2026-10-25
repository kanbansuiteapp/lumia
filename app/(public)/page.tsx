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
    : { href: "/registro", label: "Crear mi Influencer Gratis" };

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
            <span className="hero-pill-sub">Consistencia Biométrica 100%</span>
          </div>

          <h1 className="hero-headline">
            Crea un Influencer <span className="gradient-text">Hiperrealista</span> y Llena su Feed de Contenido
          </h1>

          <p className="hero-lead">
            Diseña un rostro único e inconfundible con poros y textura orgánica natural. Fija sus 3 ángulos de
            consistencia anatómica, genera sesiones lifestyle en cualquier rincón del mundo y anima en vídeo.
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
              <span className="metric-val">100%</span>
              <span className="metric-lbl">Consistencia de Rostro</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-val">Poros Reales</span>
              <span className="metric-lbl">Sin aspecto de plástico</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-val">Modelo BYOK</span>
              <span className="metric-lbl">Pagas directo a cada IA</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-val">4K UHD</span>
              <span className="metric-lbl">Resolución para Instagram</span>
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
              Sube la imagen de referencia y Lumia reconstruye la escena manteniendo el estilismo, la luz y la pose,
              pero colocando el rostro de tu influencer.
            </p>
          </div>

          <div className="swap-showcase-card">
            <div className="swap-columns-grid">
              <div className="swap-col">
                <div className="swap-col-header">
                  <span className="swap-tag">Foto de Referencia</span>
                  <span className="swap-source">Pinterest / Instagram Trend</span>
                </div>
                <div className="swap-col-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/lifestyle_travel.jpg" alt="Referencia de Pose" className="swap-img" />
                  <div className="swap-col-badge">Pose & Estilismo de Entrada</div>
                </div>
              </div>

              <div className="swap-center-indicator">
                <div className="swap-arrow-circle">
                  <span>⚡</span>
                </div>
                <span className="swap-process-label">Intercambio Biométrico Lumia</span>
              </div>

              <div className="swap-col">
                <div className="swap-col-header">
                  <span className="swap-tag output">Resultado Consistente</span>
                  <span className="swap-source">Identidad de tu Modelo</span>
                </div>
                <div className="swap-col-img-wrap">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/lifestyle_cafe.jpg" alt="Resultado de Intercambio" className="swap-img" />
                  <div className="swap-col-badge output">Rostro de Elena Vance (100%)</div>
                </div>
              </div>
            </div>

            <div className="swap-features-bar">
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
                <span className="gradient-text">Cero Recargos, Máxima Privacidad</span>
              </h2>
              <p className="byok-desc">
                Las demás plataformas te cobran suscripciones mensuales de $40 a $100 con paquetes cerrados de créditos.
                En Lumia eres dueño de tu infraestructura: conectas tus claves API de Google Gemini, Replicate o OpenAI,
                se guardan cifradas y pagas únicamente el coste real al proveedor (fracciones de céntimo por imagen).
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
                    <span>Conexión Verificada • Cuota Disponible</span>
                  </div>
                </div>

                <div className="byok-field-mock">
                  <div className="byok-field-label">Replicate Token</div>
                  <div className="byok-field-val">r8_••••••••••••••••••••••••••••••••••</div>
                  <div className="byok-field-status">
                    <span className="status-dot green" />
                    <span>Conexión Verificada • Flux 1.1 Pro Activo</span>
                  </div>
                </div>

                <div className="byok-saving-box">
                  <div className="saving-label">Coste promedio por imagen en Lumia:</div>
                  <div className="saving-cost">$0.003 - $0.02 USD</div>
                  <div className="saving-sub">Vs $0.20 - $0.50 en plataformas con créditos inflados</div>
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
            <div className="pill-badge">Comparativa Objetiva</div>
            <h2 className="headline-h2">
              ¿Por Qué Lumia Frente a <span className="gradient-text">Otras Alternativas?</span>
            </h2>
            <p className="section-subtext">
              Descubre por qué las agencias y creadores profesionales eligen un flujo de trabajo fisonómico dedicado.
            </p>
          </div>

          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Capacidad</th>
                  <th>Fotógrafo & Modelo Real</th>
                  <th>IAs Genéricas (Midjourney suelto)</th>
                  <th className="highlight-col">Lumia AI Influencer Studio</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Consistencia de Rostro</strong></td>
                  <td>100% (Humano)</td>
                  <td className="bad">❌ Cara diferente en cada foto</td>
                  <td className="highlight-col good">✅ Tríada Biométrica 3-Ángulos (100%)</td>
                </tr>
                <tr>
                  <td><strong>Coste Mensual</strong></td>
                  <td className="bad">❌ $2,500 - $6,000 / mes</td>
                  <td>$30 - $60 / mes</td>
                  <td className="highlight-col good">✅ Solo coste API directa (~$5 / mes)</td>
                </tr>
                <tr>
                  <td><strong>Velocidad de Creación</strong></td>
                  <td className="bad">❌ Semanas de producción</td>
                  <td>Minutos (después de 50 reintentos)</td>
                  <td className="highlight-col good">✅ Segundos por imagen lista</td>
                </tr>
                <tr>
                  <td><strong>Locaciones & Viajes</strong></td>
                  <td className="bad">❌ Vuelos, hoteles y traslados</td>
                  <td>Limitado a estilos genéricos</td>
                  <td className="highlight-col good">✅ Cualquier ciudad del mundo en 1 clic</td>
                </tr>
                <tr>
                  <td><strong>Efecto Piel de Plástico</strong></td>
                  <td>No aplica</td>
                  <td className="bad">❌ Piel excesivamente lisa / cera</td>
                  <td className="highlight-col good">✅ Textura orgánica con poros reales</td>
                </tr>
                <tr>
                  <td><strong>Animación a Vídeo</strong></td>
                  <td>Días de grabación</td>
                  <td className="bad">❌ Sin interpolación de consistencia</td>
                  <td className="highlight-col good">✅ Compatible con Veo 3.1 & Kling</td>
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
            <div className="pill-badge">Tarifas Transparentes</div>
            <h2 className="headline-h2">
              Todo Incluido en el <span className="gradient-text">Acceso Anticipado</span>
            </h2>
            <p className="section-subtext">
              Sin suscripciones trampa ni límites artificiales. Desbloquea la suite completa hoy mismo.
            </p>
          </div>

          <div className="pricing-container">
            <div className="pricing-card-spotlight">
              <div className="pricing-card-badge">Acceso Anticipado v2.0 • Plazas Limitadas</div>
              <div className="pricing-card-header">
                <div className="pricing-tier-title">Lumia Creator Studio</div>
                <div className="pricing-price-row">
                  <span className="price-currency">Acceso</span>
                  <span className="price-amount">Gratuito</span>
                  <span className="price-period">durante la fase Beta</span>
                </div>
                <p className="pricing-sub-desc">
                  Conecta tus claves API y empieza a construir el feed de tu influencer inmediatamente.
                </p>
              </div>

              <div className="pricing-divider" />

              <div className="pricing-features-list">
                <div className="pricing-feat-row">
                  <span className="pricing-check">✓</span>
                  <span><strong>Modelos y personajes sin límite:</strong> crea tantos influencers como desees</span>
                </div>
                <div className="pricing-feat-row">
                  <span className="pricing-check">✓</span>
                  <span><strong>Tríada de Consistencia:</strong> Frontal, 3/4 y Perfil en alta resolución</span>
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
                  <span><strong>Integraciones Oficiales:</strong> Gemini Nano Banana, Flux 1.1 Pro y OpenAI</span>
                </div>
                <div className="pricing-feat-row">
                  <span className="pricing-check">✓</span>
                  <span><strong>Privacidad 100%:</strong> Tus modelos y fotos son de tu propiedad exclusiva</span>
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
              <div className="pill-badge">Únete a la Revolución Virtual</div>
              <h2 className="headline-h2" style={{ fontSize: "clamp(28px, 4vw, 42px)", marginBottom: 16 }}>
                Construye la Próxima Gran <span className="gradient-text">Marca con Influencers Virtuales</span>
              </h2>
              <p className="final-cta-desc">
                Crea tu primer modelo en menos de 3 minutos. Fija sus rasgos, genera sus primeras sesiones
                lifestyle y empieza a publicar en redes sociales hoy mismo.
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
