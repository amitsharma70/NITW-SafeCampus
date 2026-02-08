import "./AppHeader.css";
import logo from "../assets/logo.png"
import NotificationBell from "./NotificationBell";

const AppHeader = () => {
  return (
    <header className="app-header">
      <img
        src={logo}
        alt="NITW Logo"
        className="app-logo"
      />

      <span className="app-name">NITW Safe Campus</span>
      <NotificationBell/>
    </header>
  );
};

export default AppHeader;
