import { useState } from "react";
import axios from "axios";
import "./SOS.css";

const SOS = () => {
  const [loading, setLoading] = useState(false);
  const [locationText, setLocationText] = useState("Detecting...");

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

          // Update UI number to coordinates
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
      <div className="sos-center">
        <div className="sos-card">

          {/* Card Header */}
          <div className="sos-card-header">
            <div className="camera-placeholder" />
            <span className="sos-title">Emergency</span>
            <button className="add-btn">+</button>
          </div>

          {/* Card Body */}
          <div className="sos-card-body">
            <div className="emergency-number">
              {locationText}
            </div>

            <button
              className="sos-action"
              onClick={handleSOS}
              disabled={loading}
            >
              {loading ? "Sending..." : "SOS"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SOS;