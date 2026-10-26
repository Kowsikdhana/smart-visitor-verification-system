import React from 'react';

/**
 * StatusBadge Component
 *
 * Bootstrap Classes Explained:
 * - badge: Creates a rounded pill-style label (Docs: Components -> Badges)
 * - bg-success, bg-secondary, bg-danger: Sets background contextual color (Docs: Helpers -> Color & background)
 * - text-dark, text-white: Sets text contrast color (Docs: Utilities -> Colors)
 * - rounded-pill: Fully rounded borders for modern tag styling (Docs: Utilities -> Borders)
 */
export function StatusBadge({ status }) {
  switch (status) {
    case 'CHECKED_IN':
      return (
        <span className="badge bg-success rounded-pill px-3 py-1">
          <i className="bi bi-geo-alt-fill me-1"></i> INSIDE
        </span>
      );
    case 'CHECKED_OUT':
      return (
        <span className="badge bg-secondary rounded-pill px-3 py-1">
          <i className="bi bi-check-circle me-1"></i> CHECKED OUT
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="badge bg-danger rounded-pill px-3 py-1">
          <i className="bi bi-x-circle me-1"></i> CANCELLED
        </span>
      );
    default:
      return <span className="badge bg-light text-dark">{status}</span>;
  }
}

export function VisitorTypeBadge({ type }) {
  switch (type) {
    case 'DELIVERY':
      return (
        <span className="badge bg-warning text-dark rounded-pill px-2 py-1">
          <i className="bi bi-box-seam me-1"></i> Delivery
        </span>
      );
    case 'MAINTENANCE':
      return (
        <span className="badge bg-info text-dark rounded-pill px-2 py-1">
          <i className="bi bi-tools me-1"></i> Maintenance
        </span>
      );
    case 'GUEST':
      return (
        <span className="badge bg-success-subtle text-success border border-success rounded-pill px-2 py-1">
          <i className="bi bi-person-heart me-1"></i> Guest
        </span>
      );
    case 'REGULAR':
      return (
        <span className="badge bg-primary rounded-pill px-2 py-1">
          <i className="bi bi-person me-1"></i> Regular
        </span>
      );
    default:
      return (
        <span className="badge bg-secondary rounded-pill px-2 py-1">
          {type}
        </span>
      );
  }
}
