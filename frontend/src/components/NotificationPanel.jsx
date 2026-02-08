import "./NotificationPanel.css";

const notifications = [
  {
    id: 1,
    title: "SOS Alert",
    message: "Amit Sharma triggered SOS near Hostel Block A",
    time: "2 min ago",
  },
  {
    id: 2,
    title: "Walk With Me",
    message: "Rohit did not reach destination on time",
    time: "10 min ago",
  },
];

const NotificationPanel = ({ onClose }) => {
  return (
    <div className="notif-overlay" onClick={onClose}>
      <div
        className="notif-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <h3>Notifications</h3>

        {notifications.map((n) => (
          <div key={n.id} className="notif-item">
            <strong>{n.title}</strong>
            <p>{n.message}</p>
            <span>{n.time}</span>
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
