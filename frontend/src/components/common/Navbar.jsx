import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';

/**
 * Navbar Component
 *
 * Bootstrap Classes Used:
 * - navbar, navbar-expand-lg: Responsive navigation bar wrapper (Docs: Components -> Navbar)
 * - navbar-dark, bg-dark: Dark background color scheme for high contrast (Docs: Components -> Navbar -> Color schemes)
 * - shadow-sm: Adds a subtle box-shadow for depth (Docs: Utilities -> Shadow)
 * - container-fluid: Full-width container spanning the viewport (Docs: Layout -> Containers)
 * - nav-link: Styles an anchor tag as a navigation link (Docs: Components -> Navs & tabs)
 * - active: Highlights the currently active route link (Docs: Components -> Navs & tabs)
 */
export default function Navbar() {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm sticky-top">
      <div className="container-fluid px-4">
        <NavLink className="navbar-brand d-flex align-items-center gap-2 fw-bold" to="/">
          <span className="badge bg-primary p-2">
            <i className="bi bi-shield-check fs-5"></i>
          </span>
          <span>Smart Visitor System</span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`}
              >
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/register"
                className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold text-warning' : ''}`}
              >
                <i className="bi bi-person-plus me-1"></i> Register / Delivery
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/current"
                className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`}
              >
                <i className="bi bi-door-open me-1"></i> Currently Inside
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/history"
                className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`}
              >
                <i className="bi bi-clock-history me-1"></i> Visitor History
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/residents"
                className={({ isActive }) => `nav-link ${isActive ? 'active fw-semibold' : ''}`}
              >
                <i className="bi bi-buildings me-1"></i> Residents
              </NavLink>
            </li>
          </ul>

          <div className="d-flex align-items-center gap-3">
            {currentUser ? (
              <>
                <div className="d-flex align-items-center text-light">
                  <i className="bi bi-person-badge fs-4 text-info me-2"></i>
                  <div className="text-start lh-1">
                    <small className="d-block text-secondary" style={{ fontSize: '0.75rem' }}>Gate Guard</small>
                    <span className="fw-semibold">{currentUser.fullName || currentUser.username}</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light btn-sm"
                  title="Sign Out"
                >
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" className="btn btn-primary btn-sm">
                <i className="bi bi-box-arrow-in-right me-1"></i> Guard Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
