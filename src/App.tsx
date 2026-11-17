import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./dashboard";
import Login from "./login";
import Registration from "./registration";
import Portfolio from "./Portfolio";
import CreateUnit from "./CreateUnit";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { readStoredAuthUser, type AuthUser } from "./auth";

type LogoutMutationData = {
  logout: boolean;
};

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem("authToken") !== null,
  );
  const [user, setUser] = useState<AuthUser | null>(readStoredAuthUser);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [logout, { loading: isLoggingOut }] =
    useMutation<LogoutMutationData>(LOGOUT_MUTATION);
  const navigate = useNavigate();

  const handleLogin = (loggedInUser: AuthUser) => {
    localStorage.setItem("authUser", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setIsAuthenticated(true);
    navigate("/dashboard", { replace: true });
  };

  const handleProfileUpdate = (updatedUser: AuthUser) => {
    localStorage.setItem("authUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleLogout = async () => {
    setLogoutError(null);
    try {
      await logout();
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      setUser(null);
      setIsAuthenticated(false);
      navigate("/login", { replace: true });
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Unable to log out.",
      );
    }
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login
              onLogin={handleLogin}
              onRegister={() => navigate("/register")}
            />
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Registration
              onRegister={handleLogin}
              onLogin={() => navigate("/login")}
            />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Dashboard
              user={user}
              onLogout={handleLogout}
              logoutError={logoutError}
              isLoggingOut={isLoggingOut}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/portfolio"
        element={
          isAuthenticated ? (
            <Portfolio
              user={user}
              onProfileUpdate={handleProfileUpdate}
              onLogout={handleLogout}
              logoutError={logoutError}
              isLoggingOut={isLoggingOut}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="/units/new"
        element={
          isAuthenticated ? (
            <CreateUnit
              user={user}
              onLogout={handleLogout}
              logoutError={logoutError}
              isLoggingOut={isLoggingOut}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      <Route
        path="*"
        element={
          <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
        }
      />
    </Routes>
  );
}

export default App;
