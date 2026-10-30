import { useState } from "react";
import Dashboard from "./dashboard";
import Login from "./login";
import Registration from "./registration";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

type LogoutMutationData = {
  logout: boolean;
};

const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem("authToken") !== null,
  );
  const [authPage, setAuthPage] = useState<"login" | "registration">("login");
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [logout, { loading: isLoggingOut }] =
    useMutation<LogoutMutationData>(LOGOUT_MUTATION);

  const handleLogout = async () => {
    setLogoutError(null);
    try {
      await logout();
      localStorage.removeItem("authToken");
      setIsLoggedIn(false);
    } catch (error) {
      setLogoutError(
        error instanceof Error ? error.message : "Unable to log out.",
      );
    }
  };

  if (isLoggedIn) {
    return (
      <Dashboard
        onLogout={handleLogout}
        logoutError={logoutError}
        isLoggingOut={isLoggingOut}
      />
    );
  }

  if (authPage === "registration") {
    return (
      <Registration
        onRegister={() => setIsLoggedIn(true)}
        onLogin={() => setAuthPage("login")}
      />
    );
  }

  return (
    <Login
      onLogin={() => setIsLoggedIn(true)}
      onRegister={() => setAuthPage("registration")}
    />
  );
}

export default App;
