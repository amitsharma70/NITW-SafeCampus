import { useState, useEffect } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import axios from "axios";
import NotificationPanel from "./NotificationPanel";
import "./NotificationBell.css";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/notifications/${userId}`
      );

      setNotifications(res.data);

      const unread = res.data.filter((n) => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, []);

  const togglePanel = async () => {
    setOpen(!open);

    if (!open) {
      // When opening panel → mark all as read
      try {
        await axios.post(`${API_URL}/api/notifications/read-all`, {
          userId,
        });
        setUnreadCount(0);
        fetchNotifications();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <>
      <div className="notification-wrapper" onClick={togglePanel}>
        <IoNotificationsOutline size={22} />
        {unreadCount > 0 && (
          <span className="notification-dot">
            {unreadCount}
          </span>
        )}
      </div>

      {open && (
        <NotificationPanel
          onClose={() => setOpen(false)}
          notifications={notifications}
        />
      )}
    </>
  );
};

export default NotificationBell;