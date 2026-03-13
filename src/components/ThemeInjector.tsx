"use client";

import { useEffect } from "react";
import { generateThemeCSS } from "@/lib/theme";

interface ThemeInjectorProps {
  primaryColor: string;
  accentColor: string;
}

export default function ThemeInjector({ primaryColor, accentColor }: ThemeInjectorProps) {
  useEffect(() => {
    const css = generateThemeCSS(primaryColor, accentColor);
    document.documentElement.setAttribute("style", css);
    return () => {
      document.documentElement.removeAttribute("style");
    };
  }, [primaryColor, accentColor]);

  return null;
}
