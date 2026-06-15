// import { FaSun, FaMoon } from "react-icons/fa";
// import useTheme from "../../zustand/themeSlice";

// export default function ThemeToggle() {
//   const { theme, toggleTheme } = useTheme();

//   return (
//     <button
//       onClick={toggleTheme}
//       style={{
//         padding: "10px",
//         borderRadius: "8px",
//         border: "none",
//         cursor: "pointer",
//         background: "var(--card)",
//         color: "var(--text)",
//       }}
//     >
//       {theme === "light" ? <FaMoon /> : <FaSun />}
//     </button>
//   );
// }


import { useState } from "react";
import useTheme, { THEMES } from "../../zustand/themeSlice";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen]     = useState(false);

  const current = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 hover:border-white/60 transition text-sm"
        style={{ background: current.color, color: "#fff", minWidth: 80 }}
        title="Change Theme"
      >
        <span>{current.emoji}</span>
        <span className="hidden sm:inline text-xs font-medium">{current.label}</span>
        <span className="text-xs opacity-70">▾</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown */}
          <div
            className="absolute right-0 mt-2 z-50 rounded-2xl shadow-2xl p-3 min-w-[160px]"
            style={{ background: "var(--White-color)", border: "1px solid rgba(0,0,0,.1)" }}
          >
            <p className="text-xs font-semibold mb-2 px-1" style={{ color: "var(--Text-color)", opacity: 0.6 }}>
              Choose Theme
            </p>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => { setTheme(t.id); setOpen(false); }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-xl text-sm transition hover:opacity-80"
                  style={{
                    background:  theme === t.id ? t.color : "transparent",
                    color:       theme === t.id ? "#fff" : "var(--Text-color)",
                    border:      `2px solid ${theme === t.id ? t.color : "rgba(0,0,0,.1)"}`,
                    fontWeight:  theme === t.id ? 600 : 400,
                  }}
                >
                  <span>{t.emoji}</span>
                  <span className="text-xs">{t.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}