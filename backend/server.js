require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Connect Database
connectDB();

// Middleware
// TIP: You can use an array if you want to keep localhost working too
app.use(cors({
  origin: "https://nitw-safecampus.netlify.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200 // Essential for some browsers to pass the preflight
}))
app.options('*', cors());

app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("SafeCampus Backend Running 🚀");
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/walk", require("./routes/walkRoutes"));
app.use("/api/sos", require("./routes/sosRoutes"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/incidents", require("./routes/incidentRoutes"));
app.use("/api/friends", require("./routes/friendRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

const startWalkExpiryJob = require("./services/walkExpiryService");
startWalkExpiryJob();

// RENDER FIX: Use 0.0.0.0
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});