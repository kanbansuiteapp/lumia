import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "@/components/Logo";
import { getUser } from "@/lib/auth";

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  return (
    <div className="page public-shell">
      <header className="top modern-top">
        <div className="top-in modern-top-in">
          <div className="logo-and-badge">
            <Logo href="/" />
            <span className="header-status-badge">
              <span className="pulse-dot" />
              v2.0 Beta
            </span>
          </div>

          <nav className="desktop-nav" aria-label="Navegación principal">
            <Link href="/#como-funciona">Metodología</Link>
            <Link href="/#consistencia">Consistencia 360°</Link>
            <Link href="/#galeria-lifestyle">Galería Feed</Link>
            <Link href="/#precios">Precios</Link>
            <Link href="/#faq">FAQ</Link>
          </nav>

          <span className="spacer" />

          <div className="header-actions">
            {user ? (
              <Link href="/modelos" className="btn-glow-primary">
                <span>Ir al Estudio →</span>
              </Link>
            ) : (
              <>
                <Link href="/login" className="btn-ghost-nav">
                  Entrar
                </Link>
                <Link href="/registro" className="btn-glow-primary">
                  <span>Crear Cuenta Gratis</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="page-body">{children}</main>

      <footer className="modern-foot">
        <div className="wrap foot-wrap">
          <div className="foot-grid">
            <div className="foot-brand-col">
              <Logo href="/" />
              <p className="foot-tagline">
                Plataforma integral para crear, calibrar y monetizar influencers virtuales con
                hiperrealismo fotográfico y consistencia anatómica total.
              </p>
              <div className="foot-engine-status">
                <span className="engine-status-indicator" />
                <span>Motores Gemini, Flux y OpenAI Operativos</span>
              </div>
            </div>

            <div className="foot-links-col">
              <h5>Plataforma</h5>
              <Link href="/#como-funciona">El Método de 4 Pasos</Link>
              <Link href="/#consistencia">Tríada Biométrica 360°</Link>
              <Link href="/#galeria-lifestyle">Generación Lifestyle</Link>
              <Link href="/#precios">Planes & Acceso</Link>
              <Link href="/#faq">Preguntas Frecuentes</Link>
            </div>

            <div className="foot-links-col">
              <h5>Herramientas</h5>
              <Link href="/modelos">Gestor de Modelos</Link>
              <Link href="/imagen">Generador de Imágenes</Link>
              <Link href="/lifestyle">Colecciones Lifestyle</Link>
              <Link href="/intercambiar">Intercambio de Cara</Link>
              <Link href="/animar">Animación & Vídeo</Link>
            </div>

            <div className="foot-links-col">
              <h5>Ética & Seguridad</h5>
              <p className="foot-disclaimer">
                Lumia promueve el uso responsable de la IA generativa. Genera únicamente personajes
                ficticios, propios o bajo consentimiento explícito. Tus claves API se cifran con AES-256
                en tu cuenta.
              </p>
            </div>
          </div>

          <div className="foot-bottom">
            <div>© {new Date().getFullYear()} Lumia AI Inc. Todos los derechos reservados.</div>
            <div className="foot-meta-links">
              <span>Privacidad Cifrada</span>
              <span>•</span>
              <span>Conexión Directa BYOK</span>
              <span>•</span>
              <span>Exportación 4K</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
