require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// 1. Connect Database
connectDB();

// 2. CORS Configuration
// We define allowed origins explicitly to avoid Preflight errors.
const allowedOrigins = [
  "https://nitw-safecampus.netlify.app",
  "http://localhost:5173" // For your local development
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// 3. Manual Header Injection (The "Safety Net")
// This ensures that even if a route fails, the CORS headers are sent.
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // Handle preflight OPTIONS requests immediately
  if (req.method === "OPTIONS") {
    return res.status(200).end();
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

// 7. Render/Production Port Binding
// We listen on '0.0.0.0' to allow Render's network to discover the app.
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});