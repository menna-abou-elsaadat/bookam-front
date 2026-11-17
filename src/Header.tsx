import { useNavigate } from "react-router-dom";
import type { AuthUser } from "./auth";

type HeaderProps = {
  eyebrow: string;
  title: string;
  user: AuthUser | null;
  profileLabel: string;
  profilePath: string;
  onLogout: () => void | Promise<void>;
  isLoggingOut: boolean;
};

function Header({
  eyebrow,
  title,
  user,
  profileLabel,
  profilePath,
  onLogout,
  isLoggingOut,
}: HeaderProps) {
  const navigate = useNavigate();
  const initials =
    user?.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?";

  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
      </div>
      <div className="topbar-actions">
        <button
          className="profile-button"
          onClick={() => navigate(profilePath)}
        >
          <span className="avatar small">{initials}</span>
          {profileLabel}
        </button>
        <button
          className="logout-button"
          onClick={onLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </header>
  );
}

export default Header;
