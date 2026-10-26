import React from 'react';
import { StatusBadge, VisitorTypeBadge } from '../common/StatusBadge';

/**
 * DigitalVisitorPass Component
 *
 * Renders a crisp, security badge pass card with:
 * - Pass Code and barcode aesthetics
 * - Visitor details (name, phone, vehicle, company)
 * - Resident destination (name, flat/unit, block)
 * - Status and timestamp
 * - Print capability for guards or visitors
 */
export default function DigitalVisitorPass({ visit, onClose }) {
  if (!visit) return null;

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) +
             ' (' + date.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) + ')';
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="card visitor-pass-card shadow-lg printable-pass mx-auto" style={{ maxWidth: '540px' }}>
      {/* Pass Header */}
      <div className="card-header bg-primary text-white text-center py-3 rounded-top">
        <div className="d-flex justify-content-between align-items-center px-2">
          <span className="badge bg-white text-primary fw-bold text-uppercase">
            <i className="bi bi-shield-check me-1"></i> Verified Entry
          </span>
          <small className="text-light opacity-75">SECURITY PASS</small>
        </div>
        <h4 className="fw-bold mb-0 mt-2">SMART GATE VISITOR PASS</h4>
        <small className="opacity-75">Greenfield Heights & Campus Gate 1</small>
      </div>

      <div className="card-body p-4">
        {/* Pass Code Barcode Display */}
        <div className="pass-barcode-box p-3 text-center rounded mb-4">
          <small className="text-muted d-block text-uppercase fw-semibold" style={{ fontSize: '0.7rem' }}>
            Official Pass Reference Code
          </small>
          <span className="fs-3 fw-bold text-primary font-monospace">{visit.passCode}</span>
        </div>

        {/* Visitor & Destination Grid */}
        <div className="row g-3">
          <div className="col-12 col-md-6 border-bottom pb-2">
            <small className="text-muted d-block">Visitor Full Name</small>
            <strong className="fs-5 text-dark">{visit.visitorName}</strong>
            {visit.company && (
              <span className="badge bg-light text-dark border ms-1">{visit.company}</span>
            )}
          </div>

          <div className="col-12 col-md-6 border-bottom pb-2">
            <small className="text-muted d-block">Visitor Category</small>
            <div className="mt-1">
              <VisitorTypeBadge type={visit.visitorType} />
            </div>
          </div>

          <div className="col-12 col-md-6 border-bottom pb-2">
            <small className="text-muted d-block">Contact Phone</small>
            <span className="font-monospace text-dark fw-medium">
              <i className="bi bi-telephone me-1 text-primary"></i>
              {visit.phone}
            </span>
          </div>

          <div className="col-12 col-md-6 border-bottom pb-2">
            <small className="text-muted d-block">Vehicle Number</small>
            <span className="fw-medium text-dark">
              <i className="bi bi-car-front me-1 text-primary"></i>
              {visit.vehicleNumber || 'Pedestrian / None'}
            </span>
          </div>

          <div className="col-12 bg-light p-3 rounded">
            <small className="text-muted d-block fw-semibold text-uppercase" style={{ fontSize: '0.75rem' }}>
              Authorized Destination (Host Resident)
            </small>
            <div className="d-flex justify-content-between align-items-center mt-1">
              <div>
                <h6 className="fw-bold mb-0 text-dark">{visit.residentName}</h6>
                <span className="badge bg-primary-subtle text-primary border border-primary mt-1">
                  Unit: {visit.apartmentUnit} ({visit.buildingBlock})
                </span>
              </div>
              {visit.residentPhone && (
                <small className="text-muted font-monospace">{visit.residentPhone}</small>
              )}
            </div>
          </div>

          <div className="col-12 col-md-6">
            <small className="text-muted d-block">Purpose of Visit</small>
            <span className="fw-medium text-dark">{visit.purpose}</span>
          </div>

          <div className="col-12 col-md-6">
            <small className="text-muted d-block">Entry Status</small>
            <div className="mt-1">
              <StatusBadge status={visit.status} />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <small className="text-muted d-block">Check-In Timestamp</small>
            <span className="fw-medium text-dark">{formatTimestamp(visit.checkInTime)}</span>
          </div>

          {visit.checkOutTime && (
            <div className="col-12 col-md-6">
              <small className="text-muted d-block">Check-Out Timestamp</small>
              <span className="fw-medium text-dark">{formatTimestamp(visit.checkOutTime)}</span>
            </div>
          )}

          {visit.notes && (
            <div className="col-12">
              <small className="text-muted d-block">Gate Security Notes</small>
              <span className="fst-italic text-secondary">{visit.notes}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="card-footer bg-white border-top-0 d-flex justify-content-between p-3 no-print">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => window.print()}
        >
          <i className="bi bi-printer me-1"></i> Print Pass
        </button>

        {onClose && (
          <button
            type="button"
            className="btn btn-primary btn-sm px-4"
            onClick={onClose}
          >
            <i className="bi bi-check-lg me-1"></i> Done / Close
          </button>
        )}
      </div>
    </div>
  );
}
