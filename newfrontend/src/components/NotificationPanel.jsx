import "./NotificationPanel.css";

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationPanel = ({ onClose, notifications }) => {
  return (
    <div className="notif-overlay" onClick={onClose}>
      <div
        className="notif-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Notifications</h3>

        {notifications.map((n) => (
          <div key={n._id} className="notif-item">
            <strong>{n.type}</strong>
            <p>{n.message}</p>
            <span>{formatTime(n.createdAt)}</span>
          </div>
        ))}

        {notifications.length === 0 && (
          <p className="empty">No notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;