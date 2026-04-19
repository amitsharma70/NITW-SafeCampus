import "./AppHeader.css";
// Import both logo versions
import logoLight from "../assets/logo.png";
import logoDark from "../assets/logo-white.png"; // Ensure you have a white version
import NotificationBell from "./NotificationBell";
import { useTheme } from "../context/ThemeContext";

const AppHeader = () => {
  const { theme, toggleTheme } = useTheme();

  // Select the appropriate logo based on the current theme
  const logoSrc = theme === "dark" ? logoDark : logoLight;

  return (
    <header className="app-header">
      <div className="app-header-left">
        <img 
          src={logoSrc} 
          alt="NITW Logo" 
          className="app-logo" 
        />
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