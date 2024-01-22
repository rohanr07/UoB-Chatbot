"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

// ThemeSwitcher component
export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <button
      className={`p-1 text-sm rounded-full focus:outline-none focus:ring focus:border-blue-300 transition-all duration-300 ${
        theme === "light"
          ? "bg-gray-200 dark:bg-[#212933] text-gray-500 dark:text-gray-300"
          : "bg-[#212933] text-white"
      }`}
      onClick={toggleTheme}
    >
      {theme === "light" ? (
        <span role="img" aria-label="moon">
          Light
        </span>
      ) : (
        <span role="img" aria-label="sun">
          Dark
        </span>
      )}
    </button>
  );
};