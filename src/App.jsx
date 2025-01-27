import { Route, Routes, Navigate } from "react-router-dom";
import "./Main.css";
import PropTypes from "prop-types";
import { Settings } from "./pages/Settings";
import { Login, Signup, ForgotPassword, ResetPassword } from "./pages/auth";

// Mock authentication function (replace with actual logic)
const isAuthenticated = () => {
  return localStorage.getItem("authToken") !== null; // Example: Check if a token exists
};

// PrivateRoute Component
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route
        path="/"
        element={
          isAuthenticated() ? (
            <Navigate to="/settings" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Private Routes */}
      <Route
        path="/settings"
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PrivateRoute>
            <ResetPassword />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
