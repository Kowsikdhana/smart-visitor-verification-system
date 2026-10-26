import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/authService';
import AlertMessage from '../components/common/AlertMessage';

/**
 * LoginPage Component
 *
 * Provides authentication for security staff.
 * Uses JWT tokens stored in localStorage.
 */
export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('guard');
  const [password, setPassword] = useState('guard123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Please provide both username and password.');
      return;
    }

    setLoading(true);
    try {
      await authService.login(username.trim(), password.trim());
      navigate('/');
    } catch (err) {
      setError(err.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card border-0 shadow-lg rounded-4 overflow-hidden" style={{ maxWidth: '440px', width: '100%' }}>
        <div className="card-header bg-dark text-white text-center py-4 border-0">
          <div className="badge bg-primary p-3 rounded-circle mb-3 shadow">
            <i className="bi bi-shield-lock-fill fs-2"></i>
          </div>
          <h4 className="fw-bold mb-1">Gatekeeper Access</h4>
          <small className="text-secondary">Smart Visitor Verification System</small>
        </div>

        <div className="card-body p-4 p-md-5 bg-white">
          <AlertMessage message={error} type="danger" onClose={() => setError(null)} />

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold text-secondary small text-uppercase">
                Guard Username
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-secondary">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold text-secondary small text-uppercase">
                Security Password
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-secondary">
                  <i className="bi bi-key"></i>
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Authenticating...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-1"></i> Sign In to Gate Console
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Reminder */}
          <div className="mt-4 p-3 bg-light rounded text-center small border">
            <span className="text-muted d-block mb-1">Default Demo Credentials:</span>
            <span className="badge bg-dark me-2">User: <strong>guard</strong></span>
            <span className="badge bg-secondary">Pass: <strong>guard123</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
