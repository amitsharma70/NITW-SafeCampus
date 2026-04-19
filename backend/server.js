require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("SafeCampus Backend Running 🚀");
});

// Routes (we will add later)
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/walk", require("./routes/walkRoutes"));
app.use("/api/sos", require("./routes/sosRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/incidents", require("./routes/incidentRoutes"));
app.use("/api/friends", require("./routes/friendRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
const startWalkExpiryJob = require("./services/walkExpiryService");
startWalkExpiryJob();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});