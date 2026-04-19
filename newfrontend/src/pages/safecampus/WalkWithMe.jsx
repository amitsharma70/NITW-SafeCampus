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

/* ===== Pulsing Icon ===== */
const pulseIcon = L.divIcon({
  className: "",
  html: `<div class="pulse-dot"></div>`,
  iconSize: [20, 20],
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
  const [active, setActive] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const watchRef = useRef(null);
  const intervalRef = useRef(null);

  /* ===== Initial GPS ===== */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setPosition([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );
  }, []);

  /* ===== Fetch Route ===== */
  const fetchRoute = async (start, end) => {
    const url = `https://router.project-osrm.org/route/v1/foot/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.routes?.length > 0) {
      const coords = data.routes[0].geometry.coordinates.map(
        (c) => [c[1], c[0]]
      );
      setRouteCoords(coords);
    }
  };

  useEffect(() => {
    if (destination && position) {
      fetchRoute(position, destination);
    }
  }, [destination]);

  /* ===== START WALK ===== */
  const startWalk = async () => {
    if (!destination || !position) return;

    try {
      const res = await axios.post(`${API_URL}/api/walk/start`, {
        userId,
        destination: {
          lat: destination[0],
          lng: destination[1],
        },
        duration,
      });

      setSessionId(res.data.session._id);
      setTimeLeft(duration * 60);
      setActive(true);
    } catch (err) {
      console.log(err);
    }
  };

  /* ===== UPDATE LOCATION EVERY 60s ===== */
  useEffect(() => {
    if (!active || !sessionId) return;

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([
          pos.coords.latitude,
          pos.coords.longitude,
        ]);
      },
      (err) => console.log(err),
      { enableHighAccuracy: true }
    );

    intervalRef.current = setInterval(async () => {
      if (!position) return;

      try {
        await axios.post(
          `${API_URL}/api/walk/update-location`,
          {
            sessionId,
            lat: position[0],
            lng: position[1],
          }
        );
      } catch (err) {
        console.log(err);
      }
    }, 60000); // every 60 sec

    return () => {
      if (watchRef.current)
        navigator.geolocation.clearWatch(watchRef.current);
      clearInterval(intervalRef.current);
    };
  }, [active, sessionId, position]);

  /* ===== TIMER ===== */
  useEffect(() => {
    if (!active || timeLeft === null) return;

    if (timeLeft <= 0) {
      stopWalk();
      return;
    }

    const timer = setTimeout(
      () => setTimeLeft((p) => p - 1),
      1000
    );
    return () => clearTimeout(timer);
  }, [active, timeLeft]);

  /* ===== STOP WALK ===== */
  const stopWalk = async () => {
    if (!sessionId) return;

    try {
      await axios.post(`${API_URL}/api/walk/complete`, {
        sessionId,
      });
    } catch (err) {
      console.log(err);
    }

    setActive(false);
    setTimeLeft(null);
    setSessionId(null);

    if (watchRef.current)
      navigator.geolocation.clearWatch(watchRef.current);
    clearInterval(intervalRef.current);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!position) return <div>Detecting location...</div>;

  return (
    <div className="walk-container">
      <MapContainer
        center={position}
        zoom={17}
        className="walk-map"
      >
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
            pathOptions={{
              color: "#2563EB",
              weight: 4,
            }}
          />
        )}
      </MapContainer>

      <div className="walk-overlay">
        {!active ? (
          <>
            <h3>Walk With Me</h3>

            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) =>
                setDuration(e.target.value)
              }
              className="walk-input"
            />

            <button
              className="btn-primary"
              onClick={startWalk}
              disabled={!destination}
            >
              Start Walk
            </button>
          </>
        ) : (
          <>
            <div className="timer-chip">
              {formatTime(timeLeft)}
            </div>

            <button
              className="btn-success"
              onClick={stopWalk}
            >
              I Reached Safely
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default WalkWithMe;