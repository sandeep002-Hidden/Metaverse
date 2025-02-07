import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeSwitcher = (isAuth: { isAuth: boolean }) => {
  const [theme, setTheme] = useState("light");
  useEffect(() => {
    if (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className=" relative z-20 ">
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors ${
          !isAuth && "absolute right-10 top-10"
        }`}
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        ) : (
          <Sun className="w-5 h-5 text-gray-800 dark:text-gray-200" />
        )}
      </button>
    </div>
  );
};

export default ThemeSwitcher;
