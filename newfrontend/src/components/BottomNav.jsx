import { useNavigate, useLocation } from "react-router-dom";
import {
  IoHomeOutline,
  IoHome,
  IoNewspaperOutline,
  IoNewspaper,
  IoWalkOutline,
  IoWalk,
  IoPersonOutline,
  IoPerson,
} from "react-icons/io5";
import "./BottomNav.css";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const active = (path) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      <div
        className={`nav-item ${active("/sos") ? "active" : ""}`}
        onClick={() => navigate("/sos")}
      >
        {active("/sos") ? <IoHome size={22} /> : <IoHomeOutline size={22} />}
        <span>Home</span>
      </div>

      <div
        className={`nav-item ${active("/incidents") ? "active" : ""}`}
        onClick={() => navigate("/incidents")}
      >
        {active("/incidents") ? (
          <IoNewspaper size={22} />
        ) : (
          <IoNewspaperOutline size={22} />
        )}
        <span>Feed</span>
      </div>

      <div
        className={`nav-item ${active("/walk-with-me") ? "active" : ""}`}
        onClick={() => navigate("/walk-with-me")}
      >
        {active("/walk-with-me") ? (
          <IoWalk size={22} />
        ) : (
          <IoWalkOutline size={22} />
        )}
        <span>Walk</span>
      </div>

      <div
        className={`nav-item ${active("/my-profile") ? "active" : ""}`}
        onClick={() => navigate("/my-profile")}
      >
        {active("/my-profile") ? (
          <IoPerson size={22} />
        ) : (
          <IoPersonOutline size={22} />
        )}
        <span>Profile</span>
      </div>
    </nav>
  );
};

export default BottomNav;
