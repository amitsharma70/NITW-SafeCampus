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
import "leaflet/dist/leaflet.css";
import "./WalkWithMe.css";

/* ===== Pulsing Live Location Icon ===== */
const pulseIcon = L.divIcon({
  className: "",
  html: `<div class="pulse-dot"></div>`,
  iconSize: [20, 20],
});

/* ===== Auto Center Map ===== */
const AutoCenter = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, 17);
  }, [position, map]);
  return null;
};

/* ===== Map Click Handler ===== */
const MapClickHandler = ({ setDestination }) => {
  useMapEvents({
    click(e) {
      setDestination([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

const WalkWithMe = () => {
  const [position, setPosition] = useState([17.9298, 79.5311]);
  const [destination, setDestination] = useState(null);
  const [path, setPath] = useState([]);
  const [routeCoords, setRouteCoords] = useState([]);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [duration, setDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(null);
  const [active, setActive] = useState(false);
  const [expired, setExpired] = useState(false);

  const watchRef = useRef(null);

  /* ===== Initial GPS ===== */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true }
    );
  }, []);

  /* ===== Live Tracking ===== */
  useEffect(() => {
    if (!active) return;

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newPos = [
          pos.coords.latitude,
          pos.coords.longitude,
        ];
        setPosition(newPos);
        setPath((prev) => [...prev, newPos]);
      },
      () => {},
      { enableHighAccuracy: true }
    );

    return () => {
      if (watchRef.current)
        navigator.geolocation.clearWatch(watchRef.current);
    };
  }, [active]);

  /* ===== Timer ===== */
  useEffect(() => {
    if (!active || timeLeft === null) return;

    if (timeLeft <= 0) {
      setActive(false);
      setExpired(true);
      return;
    }

    const timer = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearTimeout(timer);
  }, [active, timeLeft]);

  /* ===== Fetch Real Route (OSRM) ===== */
  const fetchRoute = async (start, end) => {
    const url = `https://router.project-osrm.org/route/v1/foot/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];

        const coords = route.geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);

        setRouteCoords(coords);
        setRouteDistance((route.distance / 1000).toFixed(2));
        setRouteDuration(Math.round(route.duration / 60));
      }
    } catch (err) {
      console.error("Routing error:", err);
    }
  };

  useEffect(() => {
    if (destination && position) {
      fetchRoute(position, destination);
    }
  }, [destination]);

  const startWalk = () => {
    if (!destination) return;
    setExpired(false);
    setTimeLeft(duration * 60);
    setPath([position]);
    setActive(true);
  };

  const stopWalk = () => {
    setActive(false);
    setTimeLeft(null);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="walk-container">
      <MapContainer center={position} zoom={17} className="walk-map">
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <AutoCenter position={position} />
        <MapClickHandler setDestination={setDestination} />

        {/* Live Location */}
        <Marker position={position} icon={pulseIcon}>
          <Popup>You are here</Popup>
        </Marker>

        {/* Destination */}
        {destination && (
          <Marker position={destination}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {/* Premium Slim Route */}
        {routeCoords.length > 0 && (
          <Polyline
            positions={routeCoords}
            pathOptions={{
              color: "#2563EB",
              weight: 4,
              opacity: 0.85,
              lineCap: "round",
            }}
          />
        )}

        {/* Soft Dashed Walk Trail */}
        {path.length > 1 && (
          <Polyline
            positions={path}
            pathOptions={{
              color: "#60A5FA",
              weight: 3,
              opacity: 0.7,
              dashArray: "6,6",
              lineCap: "round",
            }}
          />
        )}
      </MapContainer>

      <div className="walk-overlay">
        {!active ? (
          <>
            <h3>Walk With Me</h3>
            <p className="hint-text">
              Tap map to select destination
            </p>

            {routeDistance && (
              <>
                <p className="distance-text">
                  Distance: {routeDistance} km
                </p>
                <p className="eta-text">
                  Estimated Arrival: {routeDuration} min
                </p>
              </>
            )}

            <input
              type="number"
              min="1"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="walk-input"
            />

            <button
              className={`btn-primary ${
                !destination ? "disabled-btn" : ""
              }`}
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

            <button className="btn-success" onClick={stopWalk}>
              I Reached Safely
            </button>

            <button className="btn-danger" onClick={stopWalk}>
              Cancel
            </button>
          </>
        )}

        {expired && (
          <div className="expired-alert">
            ⚠ Walk Expired – Alert Triggered
          </div>
        )}
      </div>
    </div>
  );
};

export default WalkWithMe;