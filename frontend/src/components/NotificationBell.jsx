import { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import NotificationPanel from "./NotificationPanel";
import "./NotificationBell.css";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  const togglePanel = () => {
    setOpen(!open);
    setHasUnread(false); // mark seen when opened
  };

  return (
    <>
      <div className="notification-wrapper" onClick={togglePanel}>
        <IoNotificationsOutline size={22} />
        {hasUnread && <span className="notification-dot" />}
      </div>

      {open && <NotificationPanel onClose={() => setOpen(false)} />}
    </>
  );
};

export default NotificationBell;
