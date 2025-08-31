"use client";

export default function ThemeToggle() {
  return (
    <button
      id="themeBtn"
      className="btn ghost"
      style={{ marginLeft: "auto" }}
      onClick={() => {
        const root = document.documentElement;
        const cur = root.getAttribute("data-theme") || "dark";
        const next = cur === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
      }}
    >
      Theme
    </button>
  );
}
