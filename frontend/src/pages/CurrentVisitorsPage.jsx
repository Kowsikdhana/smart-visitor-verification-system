import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { visitService } from '../api/visitService';
import { StatusBadge, VisitorTypeBadge } from '../components/common/StatusBadge';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';

/**
 * CurrentVisitorsPage Component
 *
 * Dedicated live console showing every visitor currently inside the property.
 * Security guards can monitor dwell times and process rapid check-outs upon exit.
 */
export default function CurrentVisitorsPage() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCurrentVisits = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await visitService.getCurrentVisits();
      setVisits(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve active visitors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentVisits();
  }, []);

  const handleCheckOut = async (visitId, visitorName) => {
    try {
      await visitService.checkOutVisit(visitId);
      setSuccess(`Checked out ${visitorName} successfully.`);
      // Update local state by removing checked out visitor
      setVisits((prev) => prev.filter((v) => v.id !== visitId));
    } catch (err) {
      setError(err.message || 'Check-out failed.');
    }
  };

  // Calculate elapsed time inside
  const formatTimeSince = (dateStr) => {
    const diffMs = new Date() - new Date(dateStr);
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just arrived';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const hours = Math.floor(diffMins / 60);
    const remMins = diffMins % 60;
    return `${hours}h ${remMins}m ago`;
  };

  // Client-side filtering by query
  const filteredVisits = visits.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.visitorName.toLowerCase().includes(q) ||
      v.phone.includes(q) ||
      v.residentName.toLowerCase().includes(q) ||
      v.apartmentUnit.toLowerCase().includes(q) ||
      v.passCode.toLowerCase().includes(q) ||
      (v.vehicleNumber && v.vehicleNumber.toLowerCase().includes(q)) ||
      (v.company && v.company.toLowerCase().includes(q))
    );
  });

  return (
    <div className="container-fluid py-4 px-md-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-door-open-fill text-success me-2"></i>
            Visitors Currently Inside ({visits.length})
          </h2>
          <p className="text-secondary mb-0">Active visitors, delivery drivers, and service personnel on campus.</p>
        </div>
        <div className="d-flex gap-2">
          <button onClick={fetchCurrentVisits} className="btn btn-outline-secondary btn-sm" title="Refresh">
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
          <Link to="/register" className="btn btn-primary btn-sm fw-semibold">
            <i className="bi bi-person-plus-fill me-1"></i> New Check-In
          </Link>
        </div>
      </div>

      <AlertMessage message={error} type="danger" onClose={() => setError(null)} />
      <AlertMessage message={success} type="success" onClose={() => setSuccess(null)} />

      {/* Filter / Search Bar */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-6 col-lg-4">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                onClear={() => setSearchQuery('')}
                placeholder="Filter by visitor, flat, phone, or vehicle..."
              />
            </div>
            <div className="col-12 col-md-6 col-lg-8 text-md-end text-secondary small">
              Showing <strong>{filteredVisits.length}</strong> of <strong>{visits.length}</strong> currently inside
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Checking campus occupancy..." />
      ) : (
        <div className="card border-0 shadow-sm rounded-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary small text-uppercase">
                <tr>
                  <th scope="col" className="ps-4">Pass Code</th>
                  <th scope="col">Visitor</th>
                  <th scope="col">Category</th>
                  <th scope="col">Host Resident</th>
                  <th scope="col">Vehicle</th>
                  <th scope="col">Time Inside</th>
                  <th scope="col" className="text-end pe-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredVisits.length > 0 ? (
                  filteredVisits.map((v) => (
                    <tr key={v.id}>
                      <td className="ps-4 font-monospace fw-semibold text-primary">
                        <Link to={`/visits/${v.id}`} className="text-decoration-none">
                          {v.passCode}
                        </Link>
                      </td>
                      <td>
                        <div className="fw-semibold text-dark">{v.visitorName}</div>
                        <small className="text-muted">
                          <i className="bi bi-telephone me-1"></i>{v.phone}
                          {v.company && (
                            <span className="badge bg-light text-dark border ms-2">{v.company}</span>
                          )}
                        </small>
                      </td>
                      <td>
                        <VisitorTypeBadge type={v.visitorType} />
                      </td>
                      <td>
                        <div className="fw-medium text-dark">{v.residentName}</div>
                        <small className="text-secondary">
                          <i className="bi bi-building me-1"></i>
                          Unit {v.apartmentUnit} ({v.buildingBlock})
                        </small>
                      </td>
                      <td>
                        <span className="font-monospace text-dark small">
                          {v.vehicleNumber ? (
                            <span><i className="bi bi-car-front text-primary me-1"></i>{v.vehicleNumber}</span>
                          ) : (
                            <span className="text-muted">Walk-in</span>
                          )}
                        </span>
                      </td>
                      <td>
                        <div className="fw-medium text-dark">
                          {new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </div>
                        <small className="text-danger fw-semibold">
                          <i className="bi bi-clock me-1"></i>{formatTimeSince(v.checkInTime)}
                        </small>
                      </td>
                      <td className="text-end pe-4">
                        <div className="btn-group btn-group-sm">
                          <Link to={`/visits/${v.id}`} className="btn btn-outline-secondary" title="View Pass">
                            <i className="bi bi-eye"></i>
                          </Link>
                          <button
                            type="button"
                            className="btn btn-danger fw-medium"
                            title="Check Out Visitor"
                            onClick={() => handleCheckOut(v.id, v.visitorName)}
                          >
                            <i className="bi bi-box-arrow-right me-1"></i> Check Out
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-5 text-muted">
                      <i className="bi bi-door-closed fs-1 d-block mb-2 text-secondary"></i>
                      {searchQuery
                        ? 'No active visitors match your search filter.'
                        : 'No visitors are currently on the property.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
