import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { visitService } from '../api/visitService';
import { StatusBadge, VisitorTypeBadge } from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';

/**
 * VisitorHistoryPage Component
 *
 * Provides a comprehensive audit log for all gate entries and departures.
 * Supports multi-attribute filtering:
 * - Text search (Name, Phone, Flat, Pass Code)
 * - Visitor Type (Regular, Delivery, Maintenance, Guest)
 * - Visit Status (Checked In, Checked Out)
 * - Date Filter
 */
export default function VisitorHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [query, setQuery] = useState('');
  const [visitorType, setVisitorType] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters = {};
      if (visitorType) filters.type = visitorType;
      if (status) filters.status = status;
      if (date) filters.date = date;
      if (query.trim()) filters.query = query.trim();

      const data = await visitService.getVisitHistory(filters);
      setHistory(data);
      setCurrentPage(1); // Reset to first page upon filter change
    } catch (err) {
      setError(err.message || 'Failed to load visitor history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [visitorType, status, date]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadHistory();
  };

  const handleResetFilters = () => {
    setQuery('');
    setVisitorType('');
    setStatus('');
    setDate('');
  };

  // Pagination slice
  const totalPages = Math.ceil(history.length / itemsPerPage);
  const paginatedData = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatTimestamp = (dateStr) => {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString([], { day: '2-digit', month: 'short' }) +
      ' ' +
      d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
    );
  };

  return (
    <div className="container-fluid py-4 px-md-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-clock-history text-primary me-2"></i>
            Visitor Audit History
          </h2>
          <p className="text-secondary mb-0">Search, filter, and review complete historical gate access logs.</p>
        </div>
        <div>
          <button onClick={loadHistory} className="btn btn-outline-secondary btn-sm me-2">
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
          <Link to="/register" className="btn btn-primary btn-sm fw-semibold">
            <i className="bi bi-person-plus-fill me-1"></i> New Entry
          </Link>
        </div>
      </div>

      <AlertMessage message={error} type="danger" onClose={() => setError(null)} />

      {/* Filter Toolbar */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <form onSubmit={handleSearchSubmit}>
            <div className="row g-2">
              {/* Free Text Search */}
              <div className="col-12 col-md-4 col-lg-3">
                <label className="form-label small text-secondary fw-semibold mb-1">Search Keyword</label>
                <div className="input-group input-group-sm">
                  <span className="input-group-text bg-light text-secondary border-end-0">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0"
                    placeholder="Visitor, Phone, Resident, Unit..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>

              {/* Visitor Type Filter */}
              <div className="col-6 col-md-2 col-lg-2">
                <label className="form-label small text-secondary fw-semibold mb-1">Category</label>
                <select
                  className="form-select form-select-sm"
                  value={visitorType}
                  onChange={(e) => setVisitorType(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="REGULAR">Regular</option>
                  <option value="DELIVERY">Delivery</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="GUEST">Guest</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="col-6 col-md-2 col-lg-2">
                <label className="form-label small text-secondary fw-semibold mb-1">Status</label>
                <select
                  className="form-select form-select-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="CHECKED_IN">Inside (Checked In)</option>
                  <option value="CHECKED_OUT">Exited (Checked Out)</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>

              {/* Date Filter */}
              <div className="col-6 col-md-2 col-lg-2">
                <label className="form-label small text-secondary fw-semibold mb-1">Date</label>
                <input
                  type="date"
                  className="form-control form-control-sm"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* Action Buttons */}
              <div className="col-6 col-md-2 col-lg-3 d-flex align-items-end gap-2">
                <button type="submit" className="btn btn-sm btn-primary flex-grow-1">
                  Apply Filter
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={handleResetFilters}
                  title="Clear all filters"
                >
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading visit logs..." />
      ) : (
        <div className="card border-0 shadow-sm rounded-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary small text-uppercase">
                <tr>
                  <th scope="col" className="ps-4">Pass ID</th>
                  <th scope="col">Visitor</th>
                  <th scope="col">Category</th>
                  <th scope="col">Host Resident</th>
                  <th scope="col">Check-In</th>
                  <th scope="col">Check-Out</th>
                  <th scope="col">Status</th>
                  <th scope="col" className="text-end pe-4">Pass</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((v) => (
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
                          Unit {v.apartmentUnit} ({v.buildingBlock})
                        </small>
                      </td>
                      <td>
                        <span className="small text-dark font-monospace">
                          {formatTimestamp(v.checkInTime)}
                        </span>
                      </td>
                      <td>
                        <span className="small text-dark font-monospace">
                          {formatTimestamp(v.checkOutTime)}
                        </span>
                      </td>
                      <td>
                        <StatusBadge status={v.status} />
                      </td>
                      <td className="text-end pe-4">
                        <Link to={`/visits/${v.id}`} className="btn btn-outline-secondary btn-sm" title="View Digital Pass">
                          <i className="bi bi-eye me-1"></i> View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">
                      <i className="bi bi-search fs-1 d-block mb-2 text-secondary"></i>
                      No visitor records found matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="card-footer bg-white py-3 d-flex justify-content-between align-items-center">
              <small className="text-muted">
                Showing page <strong>{currentPage}</strong> of <strong>{totalPages}</strong> ({history.length} total records)
              </small>
              <nav aria-label="History pagination">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}>
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <li key={num} className={`page-item ${currentPage === num ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(num)}>
                        {num}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}>
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
