import type { ReactNode } from "react";
import "./globals.css";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = { title: "Lokesh Eedara — Portfolio" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark">
      <body>
        <header className="topbar">
          <div
            className="wrap"
            style={{ display: "flex", gap: 16, alignItems: "center" }}
          >
            <div style={{ fontWeight: 800 }}>Lokesh Eedara</div>
            <nav style={{ display: "flex", gap: 12 }}>
              <a href="#home">Home</a>
              <a href="#about">About</a>
              <a href="#experience">Experience</a>
              <a href="#projects">Projects</a>
              <a href="#awards">Awards</a>
            </nav>

            {/* Client component (safe to use document/onClick) */}
            <ThemeToggle />
          </div>
        </header>

        {children}

        {/* Restore saved theme on first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                var t = localStorage.getItem('theme');
                if (t) document.documentElement.setAttribute('data-theme', t);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
