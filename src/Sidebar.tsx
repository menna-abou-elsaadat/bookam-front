import { useNavigate } from "react-router-dom";
import type { AuthUser } from "./auth";
import "./App.css";

export type SidebarItem =
  | "Dashboard"
  | "My Portfolio"
  | "My Units"
  | "Create Unit";

type DashboardSection = Extract<SidebarItem, "Dashboard" | "My Units">;

type SidebarProps = {
  user: AuthUser | null;
  activeItem: SidebarItem;
  onDashboardSectionSelect?: (section: DashboardSection) => void;
};

function Sidebar({ user, activeItem, onDashboardSectionSelect }: SidebarProps) {
  const navigate = useNavigate();
  const initials =
    user?.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("") || "?";

  const handleDashboardSectionSelect = (section: DashboardSection) => {
    if (onDashboardSectionSelect) {
      onDashboardSectionSelect(section);
    } else {
      navigate("/dashboard");
    }
  };

  const renderDashboardItem = (label: DashboardSection, icon: string) => (
    <button
      key={label}
      className={`nav-item ${activeItem === label ? "active" : ""}`}
      aria-current={activeItem === label ? "page" : undefined}
      onClick={() => handleDashboardSectionSelect(label)}
    >
      <span className="nav-icon">{icon}</span> {label}
    </button>
  );

  return (
    <aside className="sidebar">
      <div className="brand">
        <img
          className="bookam-logo dashboard-logo"
          src="/bookam-logo.jpeg"
          alt="Bookam — Book. Manage. Grow."
        />
      </div>

      <p className="nav-label">YOUR SPACE</p>
      {renderDashboardItem("Dashboard", "⌂")}
      <button
        className={`nav-item ${activeItem === "My Portfolio" ? "active" : ""}`}
        aria-current={activeItem === "My Portfolio" ? "page" : undefined}
        onClick={() => navigate("/portfolio")}
      >
        <span className="nav-icon">▤</span> My Portfolio
      </button>
      {renderDashboardItem("My Units", "▦")}
      <button
        className={`nav-item ${activeItem === "Create Unit" ? "active" : ""}`}
        aria-current={activeItem === "Create Unit" ? "page" : undefined}
        onClick={() => navigate("/units/new")}
      >
        <span className="nav-icon">＋</span> Create Unit
      </button>

      <div className="sidebar-bottom">
        <div className="avatar">{initials}</div>
        <div>
          <strong>{user?.name ?? "Account"}</strong>
          <p>{user?.roles.join(", ") || "Account"}</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
