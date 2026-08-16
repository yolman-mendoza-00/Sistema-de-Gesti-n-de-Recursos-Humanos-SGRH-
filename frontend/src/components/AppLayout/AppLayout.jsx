import { Link, useLocation, useNavigate } from "react-router-dom";
import "./AppLayout.css";

function IconGrid() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  );
}

function IconHelp() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export default function AppLayout({ children, searchPlaceholder = "Buscar..." }) {
  const location = useLocation();
  const navigate = useNavigate();
  let user = null;
  try {
    const raw = localStorage.getItem("sgrh_user");
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }

  function handleLogout() {
    localStorage.removeItem("sgrh_user");
    navigate("/login");
  }

  const isMainMenu = location.pathname === "/";

  return (
    <div className="app-layout">
      <aside className="app-layout__sidebar">
        <div className="app-layout__brand">
          <div className="app-layout__brand-icon">
            <IconGrid />
          </div>
          <div>
            <p className="app-layout__brand-title">SGRH</p>
            <p className="app-layout__brand-subtitle">HR Management System</p>
          </div>
        </div>

        <nav className="app-layout__nav">
          <Link to="/" className={`app-layout__nav-link ${isMainMenu ? "app-layout__nav-link--active" : ""}`}>
            <IconGrid />
            Menu Principal
          </Link>
        </nav>

        <div className="app-layout__sidebar-footer">
          <button className="app-layout__sidebar-btn">
            <IconSettings />
            Ajustes
          </button>
          <button onClick={handleLogout} className="app-layout__sidebar-btn">
            <IconLogout />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="app-layout__content">
        <header className="app-layout__header">
          <div className="app-layout__search">
            <span className="app-layout__search-icon">
              <IconSearch />
            </span>
            <input type="text" placeholder={searchPlaceholder} className="app-layout__search-input" disabled />
          </div>

          <div className="app-layout__header-actions">
            <button className="app-layout__icon-btn">
              <IconBell />
            </button>
            <button className="app-layout__icon-btn">
              <IconHelp />
            </button>
            <div className="app-layout__user">
              <div className="app-layout__avatar">
                {(user?.nombre || user?.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="app-layout__user-info">
                <p className="app-layout__user-name">{user?.nombre || user?.email}</p>
                <p className="app-layout__user-role">{user?.cargo}</p>
              </div>
              <button onClick={handleLogout} className="app-layout__logout-link">
                Cerrar Sesión
              </button>
            </div>
          </div>
        </header>

        <main className="app-layout__main">{children}</main>
      </div>
    </div>
  );
}
