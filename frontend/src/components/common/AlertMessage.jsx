import React from 'react';

/**
 * AlertMessage Component
 *
 * Bootstrap Classes Explained:
 * - alert, alert-danger / alert-success: Contextual notification boxes (Docs: Components -> Alerts)
 * - alert-dismissible: Prepares the alert to house a close button (Docs: Components -> Alerts -> Dismissing)
 * - btn-close: Built-in CSS icon for dismissal buttons (Docs: Components -> Close button)
 * - mb-3: Margin-bottom utility level 3 (Docs: Utilities -> Spacing)
 */
export default function AlertMessage({ type = 'danger', message, onClose }) {
  if (!message) return null;

  return (
    <div className={`alert alert-${type} alert-dismissible fade show d-flex align-items-center mb-3 shadow-sm`} role="alert">
      <i className={`bi ${type === 'danger' ? 'bi-exclamation-triangle-fill text-danger' : 'bi-check-circle-fill text-success'} fs-5 me-2`}></i>
      <div className="flex-grow-1">{message}</div>
      {onClose && (
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onClose}
        ></button>
      )}
    </div>
  );
}
