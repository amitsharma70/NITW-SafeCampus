import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: "700px" }}>
        <h2 className="title">SafeCampus Dashboard</h2>
        <p className="subtitle">
          Quick access to campus safety features
        </p>

        <div className="dashboard">
          <div
            className="dashboard-card"
            onClick={() => navigate("/sos")}
          >
            <h3>🚨 SOS Emergency</h3>
            <p>Send instant alert to trusted contacts</p>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/walk-with-me")}
          >
            <h3>🚶 Walk With Me</h3>
            <p>Timed safety monitoring while travelling</p>
          </div>

          <div
            className="dashboard-card"
            onClick={() => navigate("/incidents")}
          >
            <h3>📢 Incident Alerts</h3>
            <p>View recent campus safety notices</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
