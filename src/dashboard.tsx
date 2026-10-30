import { useState, useMemo } from "react";
import "./App.css";
type Unit = {
  id: number;
  name: string;
  location: string;
  status: "Rented" | "Vacant" | "Maintenance";
  rent: number;
  expenses: number;
  bedrooms: number;
  area: number;
};

const initialUnits: Unit[] = [
  {
    id: 1,
    name: "Apartment 101",
    location: "Smouha, Alexandria",
    status: "Rented",
    rent: 12000,
    expenses: 1500,
    bedrooms: 3,
    area: 145,
  },
  {
    id: 2,
    name: "Apartment 202",
    location: "San Stefano, Alexandria",
    status: "Vacant",
    rent: 15000,
    expenses: 800,
    bedrooms: 2,
    area: 120,
  },
  {
    id: 3,
    name: "Villa 01",
    location: "King Mariout, Alexandria",
    status: "Maintenance",
    rent: 25000,
    expenses: 3500,
    bedrooms: 4,
    area: 260,
  },
];

type Tab = "Overview" | "Expenses" | "Furniture" | "Rent";
type DashboardProps = {
  onLogout: () => void | Promise<void>;
  logoutError: string | null;
  isLoggingOut: boolean;
};

function Dashboard({ onLogout, logoutError, isLoggingOut }: DashboardProps) {
  const [units] = useState(initialUnits);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>("Overview");
  const [activeNav, setActiveNav] = useState("Dashboard");

  const filteredUnits = useMemo(() => {
    return units.filter((unit) => {
      const matchesSearch = `${unit.name} ${unit.location}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesStatus = filter === "All" || unit.status === filter;

      return matchesSearch && matchesStatus;
    });
  }, [units, search, filter]);

  const selectedUnit = units.find((unit) => unit.id === selectedId);

  const rented = units.filter((unit) => unit.status === "Rented").length;

  const revenue = units
    .filter((unit) => unit.status === "Rented")
    .reduce((sum, unit) => sum + unit.rent, 0);

  const expenses = units.reduce((sum, unit) => sum + unit.expenses, 0);

  const money = (value: number) =>
    new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <img
            className="bookam-logo dashboard-logo"
            src="/bookam-logo.jpeg"
            alt="Bookam — Book. Manage. Grow."
          />
        </div>

        <p className="nav-label">YOUR SPACE</p>
        <button
          className={`nav-item ${activeNav === "Dashboard" ? "active" : ""}`}
          onClick={() => {
            setSelectedId(null);
            setFilter("All");
            setActiveNav("Dashboard");
          }}
        >
          <span className="nav-icon">⌂</span> Dashboard
        </button>
        <button
          className={`nav-item ${activeNav === "My Units" ? "active" : ""}`}
          onClick={() => {
            setSelectedId(null);
            setFilter("All");
            setActiveNav("My Units");
          }}
        >
          <span className="nav-icon">▦</span> My Units
        </button>
        <button
          className={`nav-item ${activeNav === "Rentals" ? "active" : ""}`}
          onClick={() => {
            setSelectedId(null);
            setFilter("Rented");
            setActiveNav("Rentals");
          }}
        >
          <span className="nav-icon">◷</span> Rentals
        </button>
        <button
          className={`nav-item ${activeNav === "Maintenance" ? "active" : ""}`}
          onClick={() => {
            setSelectedId(null);
            setFilter("Maintenance");
            setActiveNav("Maintenance");
          }}
        >
          <span className="nav-icon">⚒</span> Maintenance
        </button>

        <div className="sidebar-bottom">
          <div className="avatar">O</div>
          <div>
            <strong>Property Owner</strong>
            <p>Owner account</p>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR PROPERTY DASHBOARD</p>
            <h1>Your home base</h1>
          </div>
          <div className="topbar-actions">
            <button
              className="profile-button"
              onClick={() => {
                setSelectedId(null);
                setFilter("All");
                setSearch("");
                setActiveNav("Dashboard");
              }}
            >
              <span className="avatar small">O</span>
              My Portfolio
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
        {logoutError && (
          <p role="alert" className="login-error">
            {logoutError}
          </p>
        )}

        <section className="welcome">
          <div>
            <p className="eyebrow">A LITTLE LOOK AT YOUR PORTFOLIO</p>
            <h2>
              Good to see you, Owner! <span aria-hidden="true">✦</span>
            </h2>
            <p>
              Your properties are in good hands. Here’s what’s happening today.
            </p>
          </div>
          <div className="welcome-icon">⌂</div>
        </section>

        <section className="stats">
          <article className="stat-card">
            <span className="stat-icon blue">▦</span>
            <p>Total units</p>
            <h2>{units.length}</h2>
            <span className="stat-note">In your portfolio</span>
          </article>

          <article className="stat-card">
            <span className="stat-icon green">⌂</span>
            <p>Rented units</p>
            <h2>{rented}</h2>
            <span className="stat-note">
              {units.length - rented} not currently rented
            </span>
          </article>

          <article className="stat-card">
            <span className="stat-icon purple">↗</span>
            <p>Monthly rental income</p>
            <h2>{money(revenue)}</h2>
            <span className="stat-note">From rented units</span>
          </article>

          <article className="stat-card">
            <span className="stat-icon orange">↘</span>
            <p>Recorded expenses</p>
            <h2>{money(expenses)}</h2>
            <span className="stat-note">Sample total</span>
          </article>
        </section>

        <section className="units-section">
          <div className="section-heading">
            <div>
              <h2>My Units</h2>
              <p>All your places, together in one happy place.</p>
            </div>
            <span className="unit-count">
              {filteredUnits.length} lovely spaces
            </span>
          </div>

          <div className="toolbar">
            <input
              aria-label="Search units"
              placeholder="Search by unit or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              aria-label="Filter by status"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="All">All statuses</option>
              <option value="Rented">Rented</option>
              <option value="Vacant">Vacant</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>

          <div className="unit-grid">
            {filteredUnits.map((unit) => (
              <article className="unit-card" key={unit.id}>
                <div className="unit-visual">
                  <span className="building-icon">⌂</span>
                  <span className={`status ${unit.status.toLowerCase()}`}>
                    {unit.status}
                  </span>
                </div>

                <div className="unit-content">
                  <h3>{unit.name}</h3>
                  <p className="location">⌖ {unit.location}</p>

                  <div className="unit-meta">
                    <span>{unit.bedrooms} bedrooms</span>
                    <span>{unit.area} m²</span>
                  </div>

                  <div className="unit-price">
                    <span>Monthly rent</span>
                    <strong>{money(unit.rent)}</strong>
                  </div>

                  <button
                    className="details-button"
                    onClick={() => {
                      setSelectedId(unit.id);
                      setTab("Overview");
                    }}
                  >
                    Manage unit <span>→</span>
                  </button>
                </div>
              </article>
            ))}

            {filteredUnits.length === 0 && (
              <p className="empty-state">No units match your search.</p>
            )}
          </div>
        </section>

        {selectedUnit && (
          <section className="detail-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">UNIT MANAGEMENT</p>
                <h2>{selectedUnit.name}</h2>
                <p>{selectedUnit.location}</p>
              </div>
              <button
                className="close-button"
                onClick={() => setSelectedId(null)}
              >
                Close ×
              </button>
            </div>

            <div className="tabs">
              {(["Overview", "Expenses", "Furniture", "Rent"] as Tab[]).map(
                (item) => (
                  <button
                    key={item}
                    className={tab === item ? "tab active-tab" : "tab"}
                    onClick={() => setTab(item)}
                  >
                    {item}
                  </button>
                ),
              )}
            </div>

            {tab === "Overview" && (
              <div className="detail-grid">
                <div className="detail-item">
                  <span>Status</span>
                  <strong>{selectedUnit.status}</strong>
                </div>
                <div className="detail-item">
                  <span>Bedrooms</span>
                  <strong>{selectedUnit.bedrooms}</strong>
                </div>
                <div className="detail-item">
                  <span>Area</span>
                  <strong>{selectedUnit.area} m²</strong>
                </div>
                <div className="detail-item">
                  <span>Monthly rent</span>
                  <strong>{money(selectedUnit.rent)}</strong>
                </div>
              </div>
            )}

            {tab === "Expenses" && (
              <div className="detail-item">
                <span>Recorded expenses</span>
                <strong>{money(selectedUnit.expenses)}</strong>
              </div>
            )}

            {tab === "Furniture" && (
              <p className="empty-state">
                No furniture records connected yet. Connect this tab to your
                furniture API.
              </p>
            )}

            {tab === "Rent" && (
              <div className="detail-item">
                <span>Monthly rent</span>
                <strong>{money(selectedUnit.rent)}</strong>
                <p>
                  Tenant details, payment history, and contract dates can be
                  added here.
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
export default Dashboard;
