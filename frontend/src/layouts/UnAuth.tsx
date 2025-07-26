import { Outlet } from "react-router";
import Footer from "../components/Footer/Footer";
import { useEffect, useState } from "react";
import ThemeSwitcher from "@/components/Toogle/ThemeSwithcer";

export default function UnAuth() {
  const [isThemeSwitherVisible, setThemeSwitcherVisible] = useState(false);
  const themeSwitcherVisiblePath = ["/login", "/signup"];
  useEffect(() => {
    if (themeSwitcherVisiblePath.includes(window.location.pathname)) {
      setThemeSwitcherVisible(true);
    }
  }, []);
  return (
    <div>
      {isThemeSwitherVisible && <ThemeSwitcher isAuth={false} />}
      <Outlet />
      <Footer />
    </div>
  );
}
