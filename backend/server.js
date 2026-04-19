require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// 1. Connect Database
connectDB();

// 2. Define Allowed Origins
const allowedOrigins = [
  "https://nitw-safecampus.netlify.app",
  "http://localhost:5173"
];

// 3. Robust CORS & Preflight Middleware
// This replaces the need for the 'cors' library middleware and handles everything manually
app.use((req, res, next) => {
  const origin = req.headers.origin;

  // If the request origin is in our allowed list, set the header
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  // Required headers for production cookies/auth and preflight
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle the Preflight (OPTIONS) request specifically and immediately
  if (req.method === "OPTIONS") {
    return res.status(200).json({});
  }
  next();
});

app.use(express.json());

// 4. Test Route
app.get("/", (req, res) => {
  res.send("SafeCampus Backend Running 🚀");
});

// 5. Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/walk", require("./routes/walkRoutes"));
app.use("/api/sos", require("./routes/sosRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/incidents", require("./routes/incidentRoutes"));
app.use("/api/friends", require("./routes/friendRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

// 6. Services
const startWalkExpiryJob = require("./services/walkExpiryService");
try {
    startWalkExpiryJob();
} catch (error) {
    console.error("Failed to start Walk Expiry Job:", error);
}

// 7. Render Port Binding
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});