import { useState, useEffect } from "react";

const mq = () => window.matchMedia("(prefers-color-scheme: dark)");

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : mq().matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) setDark(e.matches);
    };
    const media = mq();
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  const toggle = () =>
    setDark((d) => {
      localStorage.setItem("theme", !d ? "dark" : "light");
      return !d;
    });

  return [dark, toggle] as const;
}
