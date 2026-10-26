import React, { useState, useEffect } from 'react';
import { residentService } from '../api/residentService';
import SearchBar from '../components/common/SearchBar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import AlertMessage from '../components/common/AlertMessage';

/**
 * ResidentsPage Component
 *
 * Resident directory allowing guards to look up resident contact info and apartment units,
 * as well as onboard new residents into the system.
 */
export default function ResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [query, setQuery] = useState('');

  // New Resident Form Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResident, setNewResident] = useState({
    name: '',
    phone: '',
    email: '',
    apartmentUnit: '',
    buildingBlock: 'Tower A',
    status: 'ACTIVE',
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const loadResidents = async (searchQuery = '') => {
    try {
      setLoading(true);
      setError(null);
      const data = await residentService.searchResidents(searchQuery);
      setResidents(data);
    } catch (err) {
      setError(err.message || 'Failed to load residents list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResidents(query);
  }, [query]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewResident((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCreateResident = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!newResident.name.trim()) errors.name = 'Resident name is required.';
    if (!newResident.phone.trim()) errors.phone = 'Phone number is required.';
    if (!newResident.apartmentUnit.trim()) errors.apartmentUnit = 'Apartment / Unit is required.';
    if (!newResident.buildingBlock.trim()) errors.buildingBlock = 'Building / Block is required.';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    try {
      await residentService.createResident(newResident);
      setSuccess(`Resident ${newResident.name} added successfully!`);
      setShowAddModal(false);
      setNewResident({
        name: '',
        phone: '',
        email: '',
        apartmentUnit: '',
        buildingBlock: 'Tower A',
        status: 'ACTIVE',
      });
      loadResidents();
    } catch (err) {
      if (err.data && err.data.fieldErrors) {
        setFormErrors(err.data.fieldErrors);
      }
      setError(err.message || 'Failed to create resident.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid py-4 px-md-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h2 className="fw-bold text-dark mb-1">
            <i className="bi bi-buildings-fill text-primary me-2"></i>
            Resident & Employee Directory
          </h2>
          <p className="text-secondary mb-0">Authorized hosts, apartment units, and contact details.</p>
        </div>
        <div>
          <button
            className="btn btn-primary btn-sm fw-semibold"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-person-plus-fill me-1"></i> Add Resident
          </button>
        </div>
      </div>

      <AlertMessage message={error} type="danger" onClose={() => setError(null)} />
      <AlertMessage message={success} type="success" onClose={() => setSuccess(null)} />

      {/* Search Toolbar */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-3">
          <div className="row g-2 align-items-center">
            <div className="col-12 col-md-5">
              <SearchBar
                value={query}
                onChange={setQuery}
                onClear={() => setQuery('')}
                placeholder="Search by name, apartment (e.g. A-101), block, or phone..."
              />
            </div>
            <div className="col-12 col-md-7 text-md-end text-secondary small">
              Total registered residents: <strong>{residents.length}</strong>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading resident directory..." />
      ) : (
        <div className="card border-0 shadow-sm rounded-3">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light text-secondary small text-uppercase">
                <tr>
                  <th scope="col" className="ps-4">Resident Name</th>
                  <th scope="col">Apartment / Unit</th>
                  <th scope="col">Building / Block</th>
                  <th scope="col">Phone Contact</th>
                  <th scope="col">Email</th>
                  <th scope="col" className="text-end pe-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {residents.length > 0 ? (
                  residents.map((r) => (
                    <tr key={r.id}>
                      <td className="ps-4 fw-semibold text-dark">
                        <i className="bi bi-person-circle text-secondary me-2"></i>
                        {r.name}
                      </td>
                      <td>
                        <span className="badge bg-primary-subtle text-primary border border-primary px-2 py-1">
                          {r.apartmentUnit}
                        </span>
                      </td>
                      <td className="text-dark fw-medium">{r.buildingBlock}</td>
                      <td>
                        <a href={`tel:${r.phone}`} className="text-decoration-none font-monospace">
                          <i className="bi bi-telephone me-1 text-primary"></i>{r.phone}
                        </a>
                      </td>
                      <td className="text-muted small">{r.email || '—'}</td>
                      <td className="text-end pe-4">
                        {r.status === 'ACTIVE' ? (
                          <span className="badge bg-success rounded-pill px-3 py-1">Active</span>
                        ) : (
                          <span className="badge bg-danger rounded-pill px-3 py-1">Inactive</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No residents match your search query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Resident Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-building-add me-2"></i> Add Resident
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateResident}>
                <div className="modal-body p-4">
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Resident Full Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      name="name"
                      className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                      placeholder="e.g. Ananya Iyer"
                      value={newResident.name}
                      onChange={handleInputChange}
                    />
                    {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                  </div>

                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label fw-semibold">Apartment / Flat <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="apartmentUnit"
                        className={`form-control ${formErrors.apartmentUnit ? 'is-invalid' : ''}`}
                        placeholder="e.g. C-501"
                        value={newResident.apartmentUnit}
                        onChange={handleInputChange}
                      />
                      {formErrors.apartmentUnit && <div className="invalid-feedback">{formErrors.apartmentUnit}</div>}
                    </div>

                    <div className="col-6">
                      <label className="form-label fw-semibold">Building / Block <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        name="buildingBlock"
                        className={`form-control ${formErrors.buildingBlock ? 'is-invalid' : ''}`}
                        placeholder="e.g. Tower C"
                        value={newResident.buildingBlock}
                        onChange={handleInputChange}
                      />
                      {formErrors.buildingBlock && <div className="invalid-feedback">{formErrors.buildingBlock}</div>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Phone Contact <span className="text-danger">*</span></label>
                    <input
                      type="tel"
                      name="phone"
                      className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                      placeholder="e.g. 9876543210"
                      value={newResident.phone}
                      onChange={handleInputChange}
                    />
                    {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email Address (Optional)</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="e.g. resident@example.com"
                      value={newResident.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Status</label>
                    <select
                      name="status"
                      className="form-select"
                      value={newResident.status}
                      onChange={handleInputChange}
                    >
                      <option value="ACTIVE">ACTIVE (Authorized to receive visitors)</option>
                      <option value="INACTIVE">INACTIVE (Moved out / Suspended)</option>
                    </select>
                  </div>
                </div>

                <div className="modal-footer bg-light">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn-primary fw-semibold"
                  >
                    {saving ? 'Saving...' : 'Save Resident'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
