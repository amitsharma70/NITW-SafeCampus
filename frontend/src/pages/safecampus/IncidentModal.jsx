import "./IncidentModal.css";

const IncidentModal = ({ incident, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <img
          src={incident.image}
          alt=""
          className="modal-image"
        />

        <div className="modal-content">
          <h2>{incident.title}</h2>
          <p>{incident.description}</p>

          <div className="modal-votes">
            <span>▲</span>
            <span>12</span>
            <span>▼</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentModal;
