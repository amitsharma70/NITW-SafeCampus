import { useState } from "react";
import {axiosInstance} from "../../auth/axiosInstance";

const WalkWithMe = () => {
  const [active, setActive] = useState(false);
  const [status, setStatus] = useState("");

  const startWalk = async () => {
    setActive(true);
    setStatus("Walk session started");

    // 🔗 API placeholder
    // await axiosInstance.post("/api/walk/start", {
    //   expectedMinutes: 20,
    //   latitude: 17.38,
    //   longitude: 78.48,
    // });
  };

  const endWalk = async () => {
    setActive(false);
    setStatus("You reached safely");

    // 🔗 API placeholder
    // await axiosInstance.post("/api/walk/complete");
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">Walk With Me</h2>
        <p className="subtitle">
          Stay monitored until you reach safely
        </p>

        {!active ? (
          <button className="btn btn-primary" onClick={startWalk}>
            Start Walk
          </button>
        ) : (
          <button className="btn btn-primary" onClick={endWalk}>
            I’ve Reached Safely
          </button>
        )}

        {status && (
          <p style={{ marginTop: "1rem", textAlign: "center" }}>
            {status}
          </p>
        )}
      </div>
    </div>
  );
};

export default WalkWithMe;
