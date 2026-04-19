import { useState } from "react";
import axios from "axios";
import "./SOS.css";

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);

const CarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="2"/>
    <path d="M16 8h4l3 5v3h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
);

const CrossIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20M2 12h20"/>
  </svg>
);

const FlameIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.79a16 16 0 0 0 6.29 6.29l.95-.94a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

const SOS = () => {
  const [loading, setLoading] = useState(false);
  const [locationText, setLocationText] = useState(null);

  const API_URL = import.meta.env.VITE_API_BASE_URL;
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?._id;

  const handleSOS = () => {
    if (!userId) {
      alert("User not logged in");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          setLocationText(
            `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
          );

          await axios.post(`${API_URL}/api/sos/send`, {
            userId,
            lat: latitude,
            lng: longitude,
            message: "Emergency! I need help.",
          });

          alert("SOS sent successfully 🚨");
        } catch (error) {
          console.error(error);
          alert("Failed to send SOS");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        alert("Location permission denied");
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="sos-screen">

      {/* TOP LABEL */}
      <div className="sos-top-label">
        <span className="sos-top-dot" />
        Emergency Response
      </div>

      {/* MAIN BUTTON */}
      <div className="sos-main">
        <div className="sos-ring sos-ring-3" />
        <div className="sos-ring sos-ring-2" />
        <div className="sos-ring sos-ring-1" />
        <button
          className={`sos-btn ${loading ? "sos-btn--active" : ""}`}
          onClick={handleSOS}
          disabled={loading}
        >
          <span className="sos-btn-label">SOS</span>
          <span className="sos-btn-sub">
            {loading ? "Sending..." : "Tap to alert"}
          </span>
        </button>
      </div>

      {/* LOCATION CHIP */}
      <div className={`sos-location-chip ${locationText ? "sos-location-chip--visible" : ""}`}>
        <span className="sos-location-icon"><MapPinIcon /></span>
        <span className="sos-location-text">
          {locationText || "Location will appear here"}
        </span>
      </div>

      {/* INFO GRID */}
      <div className="sos-info-grid">
        <div className="sos-info-card">
          <div className="sos-info-card-icon">
            <ShieldIcon />
          </div>
          <div className="sos-info-card-body">
            <span className="sos-info-card-label">Campus Security</span>
            <span className="sos-info-card-number">100</span>
          </div>
        </div>

        <div className="sos-info-card">
          <div className="sos-info-card-icon">
            <CrossIcon />
          </div>
          <div className="sos-info-card-body">
            <span className="sos-info-card-label">Medical Help</span>
            <span className="sos-info-card-number">108</span>
          </div>
        </div>

        <div className="sos-info-card">
          <div className="sos-info-card-icon">
            <FlameIcon />
          </div>
          <div className="sos-info-card-body">
            <span className="sos-info-card-label">Fire Station</span>
            <span className="sos-info-card-number">101</span>
          </div>
        </div>

        <div className="sos-info-card">
          <div className="sos-info-card-icon">
            <PhoneIcon />
          </div>
          <div className="sos-info-card-body">
            <span className="sos-info-card-label">Police</span>
            <span className="sos-info-card-number">112</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SOS;