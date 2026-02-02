import { createContext, useState, useEffect } from "react";
import { ThemeProvider as StyledThemeProvider } from "styled-components";

export const ThemeContext = createContext();

export function AppTheme({ children }) {
  const themeOrder = ["light", "dark"];
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return themeOrder.includes(saved) ? saved : "light";
  });
  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
  };
  const themeStyles = {
    light: {
      bg: "#F8FAF9",
      bodyBg: "#F1F5F3",
      text: "#0F172A",
      secondaryText: "#475569",

      card: "#FFFFFF",
      cardHover: "#FFFFFF",
      secondaryBg: "#E6EFEA",
      searchBg: "#FFFFFF",

      icon: "#0F172A",

      accent: "#16A34A",
      accentSoft: "#16A34A22",

      border: "#CBD5CC",
      borderStrong: "#A7B7AE",

      cardShadow: "rgba(0, 0, 0, 0.12)",
    },

    dark: {
      bg: "#0B1220",
      bodyBg: "#020617",
      text: "#E5E7EB",
      secondaryText: "#94A3B8",

      card: "#020617",
      cardHover: "#020617",
      secondaryBg: "#0F172A",
      searchBg: "#020617",

      icon: "#E5E7EB",

      accent: "#22C55E",
      accentSoft: "#22C55E22",

      border: "#1E293B",
      borderStrong: "#334155",

      cardShadow: "rgba(255, 255, 255, 0.12)",
    },
  };
  useEffect(() => {
    const t = themeStyles[theme];
    if (!t) return;
    document.body.style.background = t.bodyBg;
    document.body.style.color = t.text;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={themeStyles[theme]}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
}
