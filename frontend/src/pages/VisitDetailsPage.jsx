import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { visitService } from '../api/visitService';
import DigitalVisitorPass from '../components/visitors/DigitalVisitorPass';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';

/**
 * VisitDetailsPage Component
 *
 * Displays the full pass and audit record for a specific visit session.
 */
export default function VisitDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const loadVisit = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await visitService.getVisitById(id);
      setVisit(data);
    } catch (err) {
      setError(err.message || 'Failed to load visitor pass details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisit();
  }, [id]);

  const handleCheckOut = async () => {
    try {
      const updated = await visitService.checkOutVisit(id);
      setVisit(updated);
      setActionSuccess('Visitor marked as CHECKED OUT successfully.');
    } catch (err) {
      setError(err.message || 'Check-out failed.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving Digital Pass..." />;
  }

  return (
    <div className="container py-4">
      {/* Navigation Breadcrumb */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-1"></i> Back
        </button>

        <div className="d-flex gap-2">
          {visit && visit.status === 'CHECKED_IN' && (
            <button className="btn btn-danger btn-sm" onClick={handleCheckOut}>
              <i className="bi bi-box-arrow-right me-1"></i> Check Out Visitor Now
            </button>
          )}
          <Link to="/history" className="btn btn-outline-primary btn-sm">
            <i className="bi bi-clock-history me-1"></i> All History
          </Link>
        </div>
      </div>

      <AlertMessage message={error} type="danger" onClose={() => setError(null)} />
      <AlertMessage message={actionSuccess} type="success" onClose={() => setActionSuccess(null)} />

      {visit && (
        <DigitalVisitorPass
          visit={visit}
          onClose={() => navigate('/current')}
        />
      )}
    </div>
  );
}
