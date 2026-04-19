import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "./WalkWithMe.css";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const pulseIcon = L.divIcon({
  className: "",
  html: `<div class="pulse-dot"></div>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

const AutoCenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView(position, 17);
  }, [position]);
  return null;
};

const MapClickHandler = ({ setDestination }) => {
  useMapEvents({
    click(e) {
      setDestination([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const WalkWithMe = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  const [position, setPosition] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const [duration, setDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(null);
  const [totalTime, setTotalTime] = useState(null);
  const [active, setActive] = useState(false);
  const [walkId, setWalkId] = useState(null);
  const [completing, setCompleting] = useState(false);

  const watchRef = useRef(null);
  const intervalRef = useRef(null);

  /* GPS */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );
  }, []);

  /* Route */
  const fetchRoute = async (start, end) => {
    const url = `https://router.project-osrm.org/route/v1/foot/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.routes?.length > 0) {
      const coords = data.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
      setRouteCoords(coords);
    }
  };

  useEffect(() => {
    if (destination && position) fetchRoute(position, destination);
  }, [destination]);

  /* Start Walk */
  const startWalk = async () => {
    if (!destination || !position) return;
    try {
      const res = await axios.post(`${API_URL}/api/walk/start`, {
        userId,
        destination: { lat: destination[0], lng: destination[1] },
        duration,
      });
      // backend returns the walk object directly
      const walk = res.data;
      setWalkId(walk._id);
      setTimeLeft(duration * 60);
      setTotalTime(duration * 60);
      setActive(true);
    } catch (err) {
      console.log(err);
    }
  };

  /* Live location update every 60s */
  useEffect(() => {
    if (!active || !walkId) return;

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );

    intervalRef.current = setInterval(async () => {
      if (!position) return;
      try {
        await axios.post(`${API_URL}/api/walk/update-location`, {
          walkId,
          lat: position[0],
          lng: position[1],
        });
      } catch (err) {
        console.log(err);
      }
    }, 60000);

    return () => {
      if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
      clearInterval(intervalRef.current);
    };
  }, [active, walkId]);

  /* Timer countdown */
  useEffect(() => {
    if (!active || timeLeft === null) return;
    if (timeLeft <= 0) {
      completeWalk();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(timer);
  }, [active, timeLeft]);

  /* Complete Walk — called by button OR when timer hits 0 */
  const completeWalk = async () => {
    if (!walkId || completing) return;
    setCompleting(true);
    try {
      await axios.post(`${API_URL}/api/walk/complete`, { walkId });
    } catch (err) {
      console.log(err);
    }
    setActive(false);
    setTimeLeft(null);
    setTotalTime(null);
    setWalkId(null);
    setCompleting(false);
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    clearInterval(intervalRef.current);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const progressPercent = totalTime ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  const isUrgent = timeLeft !== null && timeLeft <= 60;

  if (!position) {
    return (
      <div className="walk-detecting">
        <div className="walk-detecting-spinner" />
        <p>Detecting your location...</p>
      </div>
    );
  }

  return (
    <div className="walk-container">
      <MapContainer center={position} zoom={17} className="walk-map" zoomControl={false}>
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AutoCenter position={position} />
        <MapClickHandler setDestination={setDestination} />

        <Marker position={position} icon={pulseIcon}>
          <Popup>You are here</Popup>
        </Marker>

        {destination && (
          <Marker position={destination}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{ color: "#2563EB", weight: 5, opacity: 0.85 }}
          />
        )}
      </MapContainer>

      {/* BOTTOM SHEET */}
      <div className="walk-sheet">
        <div className="walk-sheet-handle" />
        <div className="walk-sheet-inner">

          {!active ? (
            /* ── IDLE ── */
            <>
              <div className="walk-idle-header">
                <span className="walk-idle-title">Walk With Me</span>
                <span className="walk-idle-badge">Safe Mode</span>
              </div>

              <div className="walk-dest-hint">
                <div className="walk-dest-dot" />
                <p>
                  {destination
                    ? <><strong>Destination set</strong> — tap map to change</>
                    : <>Tap anywhere on the map to <strong>set destination</strong></>
                  }
                </p>
              </div>

              <div className="walk-duration-row">
                <span className="walk-duration-label">Walk duration</span>
                <div className="walk-duration-control">
                  <button onClick={() => setDuration((d) => Math.max(1, d - 5))}>−</button>
                  <span className="walk-duration-value">{duration} min</span>
                  <button onClick={() => setDuration((d) => d + 5)}>+</button>
                </div>
              </div>

              <button
                className="walk-start-btn"
                onClick={startWalk}
                disabled={!destination}
              >
                {destination ? "Start Safe Walk" : "Set a Destination First"}
              </button>
            </>
          ) : (
            /* ── ACTIVE ── */
            <>
              <div className="walk-active-header">
                <div className="walk-timer-block">
                  <div className="walk-timer-label">Time Remaining</div>
                  <div className={`walk-timer-value ${isUrgent ? "urgent" : ""}`}>
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <div className="walk-status-pill">
                  <div className="walk-status-dot" />
                  <span className="walk-status-text">Live</span>
                </div>
              </div>

              <div className="walk-progress-bar">
                <div
                  className="walk-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <button
                className="walk-safe-btn"
                onClick={completeWalk}
                disabled={completing}
              >
                {completing ? "Completing..." : "✓ I Reached Safely"}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default WalkWithMe;