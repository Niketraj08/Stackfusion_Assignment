import "../styles/globals.css";
import Link from "next/link";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", padding: "40px 20px" }}>
      <header className="glass-card" style={{ maxWidth: 900, margin: "0 auto 40px", padding: "16px 24px" }}>
        <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: "1.25rem", color: "var(--primary)" }}>SlotLock.</h2>
          <div>
            <Link href="/" className={`nav-link ${router.pathname === "/" ? "active" : ""}`}>
              Dashboard
            </Link>
            <Link href="/bookings" className={`nav-link ${router.pathname === "/bookings" ? "active" : ""}`}>
              Bookings & Reports
            </Link>
          </div>
        </nav>
      </header>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <Component {...pageProps} />
      </div>
    </div>
  );
}
