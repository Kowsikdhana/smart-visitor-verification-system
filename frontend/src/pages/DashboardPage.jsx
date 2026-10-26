import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { visitService } from '../api/visitService';
import StatCard from '../components/dashboard/StatCard';
import { StatusBadge, VisitorTypeBadge } from '../components/common/StatusBadge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';

/**
 * DashboardPage Component
 *
 * Concepts explained:
 * - useState: React Hook for holding dynamic component state (stats, loading, error).
 * - useEffect: Runs side-effects like fetching data from the Spring Boot API upon component mount.
 *
 * Bootstrap Classes Explained:
 * - row, col-12, col-md-6, col-lg-3: Responsive 12-column grid layout (Docs: Layout -> Grid)
 * - g-3, g-4: Gutters utility adding space between grid columns (Docs: Layout -> Gutters)
 * - table, table-hover: Modern Bootstrap tabular formatting (Docs: Content -> Tables)
 * - btn-group: Groups multiple buttons together horizontally (Docs: Components -> Button group)
 */
export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await visitService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load security dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickCheckOut = async (visitId, visitorName) => {
    try {
      await visitService.checkOutVisit(visitId);
      setActionSuccess(`Successfully checked out visitor ${visitorName}.`);
      fetchStats(); // Refresh stats and list
    } catch (err) {
      setError(err.message || 'Failed to check out visitor.');
    }
  };

  if (loading && !stats) {
    return <LoadingSpinner message="Loading Gate Dashboard..." />;
  }

  return (
    <div className="container-fluid py-4 px-md-5">
      {/* Page Title & Quick Action Bar */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">Security Gate Dashboard</h2>
          <p className="text-secondary mb-0">Real-time visitor monitoring, occupancy, and gate throughput.</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/register" className="btn btn-warning text-dark fw-semibold shadow-sm">
            <i className="bi bi-box-seam me-1"></i> Delivery Fast-Track
          </Link>
          <Link to="/register" className="btn btn-primary fw-semibold shadow-sm">
            <i className="bi bi-person-plus-fill me-1"></i> Register Visitor
          </Link>
        </div>
      </div>

      <AlertMessage message={error} type="danger" onClose={() => setError(null)} />
      <AlertMessage message={actionSuccess} type="success" onClose={() => setActionSuccess(null)} />

      {/* 4 Key Metric Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Currently Inside"
            value={stats ? stats.currentlyInsideCount : 0}
            icon="bi-door-open-fill"
            color="success"
            subtitle="Active on property"
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Visits Today"
            value={stats ? stats.todayVisitsCount : 0}
            icon="bi-calendar-check-fill"
            color="primary"
            subtitle="Total gate arrivals"
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Deliveries Today"
            value={stats ? stats.todayDeliveriesCount : 0}
            icon="bi-box-seam-fill"
            color="warning"
            subtitle="Couriers & parcels"
          />
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Checked Out Today"
            value={stats ? stats.todayCheckOutCount : 0}
            icon="bi-box-arrow-right"
            color="secondary"
            subtitle="Completed departures"
          />
        </div>
      </div>

      {/* Recent Gate Activity Section */}
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
          <div>
            <h5 className="fw-bold mb-0 text-dark">Recent Gate Activity</h5>
            <small className="text-muted">Last 10 visitor check-ins and exits</small>
          </div>
          <div className="d-flex gap-2">
            <button onClick={fetchStats} className="btn btn-outline-secondary btn-sm" title="Refresh">
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
            <Link to="/history" className="btn btn-outline-primary btn-sm">
              View All History <i className="bi bi-chevron-right ms-1"></i>
            </Link>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr className="text-secondary small text-uppercase">
                <th scope="col" className="ps-4">Pass Code</th>
                <th scope="col">Visitor</th>
                <th scope="col">Category</th>
                <th scope="col">Visiting Resident</th>
                <th scope="col">Check-In Time</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats && stats.recentVisits && stats.recentVisits.length > 0 ? (
                stats.recentVisits.map((v) => (
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
                        {v.company && <span className="ms-2 badge bg-light text-dark border">{v.company}</span>}
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
                      <span className="small text-dark">
                        {new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={v.status} />
                    </td>
                    <td className="text-end pe-4">
                      <div className="btn-group btn-group-sm">
                        <Link to={`/visits/${v.id}`} className="btn btn-outline-secondary" title="View Pass">
                          <i className="bi bi-eye"></i> Pass
                        </Link>
                        {v.status === 'CHECKED_IN' && (
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            title="Check Out Visitor"
                            onClick={() => handleQuickCheckOut(v.id, v.visitorName)}
                          >
                            <i className="bi bi-box-arrow-right me-1"></i> Exit
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No recent activity recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
