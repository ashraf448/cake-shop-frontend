// import { create } from "zustand";

// const useTheme = create((set) => ({
//   theme: localStorage.getItem("theme") || "light",

//   setTheme: (newTheme) => {
//     localStorage.setItem("theme", newTheme);
//     document.documentElement.setAttribute("data-theme", newTheme);

//     set({ theme: newTheme });
//   },

//   toggleTheme: () =>
//     set((state) => {
//       const newTheme = state.theme === "light" ? "dark" : "light";

//       localStorage.setItem("theme", newTheme);
//       document.documentElement.setAttribute("data-theme", newTheme);

//       return { theme: newTheme };
//     }),
// }));

// export default useTheme;



import { create } from "zustand";
import { persist } from "zustand/middleware";

export const THEMES = [
  { id: "light",    label: "Beige",    emoji: "🍪", color: "#D0BFA5" },
  { id: "dark",     label: "Dark",     emoji: "🌙", color: "#1a1a2e" },
  { id: "rose",     label: "Rose",     emoji: "🌸", color: "#ec4899" },
  { id: "mint",     label: "Mint",     emoji: "🌿", color: "#22c55e" },
  { id: "lavender", label: "Lavender", emoji: "💜", color: "#7c3aed" },
  { id: "gold",     label: "Gold",     emoji: "✨", color: "#d97706" },
];

export const LANGUAGES = [
  { id: "en", label: "English", flag: "🇬🇧", dir: "ltr" },
  { id: "ar", label: "عربي",    flag: "🇪🇬", dir: "rtl" },
];

const useTheme = create(
  persist(
    (set) => ({
      theme:    "light",
      language: "en",

      setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set({ theme });
      },

      setLanguage: (language) => {
        const lang = LANGUAGES.find((l) => l.id === language);
        if (lang) {
          document.documentElement.setAttribute("dir", lang.dir);
          document.documentElement.setAttribute("lang", lang.id);
        }
        set({ language });
      },

      initTheme: () => {
        const saved = JSON.parse(localStorage.getItem("theme-storage") || "{}");
        const theme    = saved?.state?.theme    || "light";
        const language = saved?.state?.language || "en";
        document.documentElement.setAttribute("data-theme", theme);
        const lang = LANGUAGES.find((l) => l.id === language);
        if (lang) {
          document.documentElement.setAttribute("dir",  lang.dir);
          document.documentElement.setAttribute("lang", lang.id);
        }
      },
    }),
    { name: "theme-storage" }
  )
);

export default useTheme;