import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";

/* Route Guards */
import PrivateRoute from "./routes/PrivateRoute";
import PublicRoute from "./routes/publicroutes";

/* Layout */
import AppLayout from "./layouts/AppLayout";

/* Auth Pages */
import Login from "./pages/login";
import Signup from "./pages/register.jsx";
import Profile from "./pages/Profile.jsx";


/* SafeCampus Pages */
import SOS from "./pages/safecampus/sos";
import WalkWithMe from "./pages/safecampus/WalkWithMe";
import IncidentFeed from "./pages/safecampus/IncidentFeed";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* ===== Public Routes (NO NAVBAR) ===== */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* ===== Protected Routes (WITH NAVBAR) ===== */}
          <Route
            element={
                <AppLayout />
            }
          >
            {/* SOS is HOME */}
            <Route path="/sos" element={<SOS />} />
            <Route path="/walk-with-me" element={<WalkWithMe />} />
            <Route path="/incidents" element={<IncidentFeed />} />
            <Route path="/my-profile" element={<Profile />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
