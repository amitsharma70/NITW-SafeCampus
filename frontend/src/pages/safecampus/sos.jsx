import "./SOS.css";

const SOS = () => {
  return (
    <div className="sos-screen">
      <div className="sos-center">
        <div className="sos-card">

          {/* Card Header (INSIDE card) */}
          <div className="sos-card-header">
            <div className="camera-placeholder" />
            <span className="sos-title">Emergency</span>
            <button className="add-btn">+</button>
          </div>

          {/* Card Body */}
          <div className="sos-card-body">
            <div className="emergency-number">112</div>
            <button className="sos-action">SOS</button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SOS;
