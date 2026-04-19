import "./AppHeader.css";
import logo from "../assets/logo.png";
import NotificationBell from "./NotificationBell";
import { useTheme } from "../context/ThemeContext";

const AppHeader = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="app-header-left">
        <img src={logo} alt="NITW Logo" className="app-logo" />
      </div>

      <span className="app-name">NITW Safe Campus</span>

      <div className="app-header-right">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          aria-label="Toggle theme"
        />
        <NotificationBell />
      </div>
    </header>
  );
};

export default AppHeader;
