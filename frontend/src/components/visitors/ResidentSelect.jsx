import React, { useState, useEffect } from 'react';
import { residentService } from '../../api/residentService';

/**
 * ResidentSelect Component
 *
 * Implements real-time resident search & verification during visitor check-in.
 * Guard can type resident name, apartment unit (e.g. "A-101"), or block to find hosts.
 */
export default function ResidentSelect({ selectedResidentId, onSelect, error }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);

  // Search residents with debounce
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await residentService.searchResidents(searchTerm);
        setResidents(data);
        // If an ID is pre-selected, update the local selectedResident state
        if (selectedResidentId && !selectedResident) {
          const match = data.find((r) => r.id === Number(selectedResidentId));
          if (match) setSelectedResident(match);
        }
      } catch (err) {
        console.error('Failed to load residents', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, selectedResidentId]);

  const handleSelect = (resident) => {
    setSelectedResident(resident);
    onSelect(resident.id);
  };

  const handleClear = () => {
    setSelectedResident(null);
    onSelect('');
    setSearchTerm('');
  };

  return (
    <div className="mb-3">
      <label className="form-label fw-semibold">
        Resident / Employee Being Visited <span className="text-danger">*</span>
      </label>

      {selectedResident ? (
        // Selected Resident Summary Card
        <div className="p-3 border rounded bg-white shadow-sm d-flex justify-content-between align-items-center border-success">
          <div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success">
                <i className="bi bi-check2-circle me-1"></i> Verified Resident
              </span>
              <strong className="text-dark fs-6">{selectedResident.name}</strong>
            </div>
            <div className="text-muted small mt-1">
              <i className="bi bi-building me-1"></i>
              <strong>Unit: {selectedResident.apartmentUnit}</strong> ({selectedResident.buildingBlock}) &bull;{' '}
              <i className="bi bi-telephone ms-1 me-1"></i>
              {selectedResident.phone}
            </div>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handleClear}
          >
            Change
          </button>
        </div>
      ) : (
        // Search Input & Suggestions Dropdown
        <div className="position-relative">
          <div className="input-group">
            <span className="input-group-text bg-white text-secondary border-end-0">
              {loading ? (
                <span className="spinner-border spinner-border-sm text-primary" role="status"></span>
              ) : (
                <i className="bi bi-search"></i>
              )}
            </span>
            <input
              type="text"
              className={`form-control border-start-0 ps-0 ${error ? 'is-invalid' : ''}`}
              placeholder="Search resident by name, flat number (e.g. A-101), or block..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {error && <div className="invalid-feedback d-block">{error}</div>}

          {/* Search Results List */}
          {residents.length > 0 && (
            <div className="list-group mt-1 shadow-sm border rounded overflow-auto" style={{ maxHeight: '220px' }}>
              {residents.map((r) => {
                const isActive = r.status === 'ACTIVE';
                return (
                  <button
                    key={r.id}
                    type="button"
                    disabled={!isActive}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center text-start py-2 ${
                      !isActive ? 'disabled opacity-50 bg-light' : ''
                    }`}
                    onClick={() => handleSelect(r)}
                  >
                    <div>
                      <div className="fw-semibold text-dark">
                        {r.name}
                        {!isActive && (
                          <span className="badge bg-danger ms-2">INACTIVE / MOVED OUT</span>
                        )}
                      </div>
                      <small className="text-secondary">
                        Flat: <strong className="text-primary">{r.apartmentUnit}</strong> &bull; {r.buildingBlock} &bull; Ph: {r.phone}
                      </small>
                    </div>
                    {isActive ? (
                      <span className="btn btn-outline-primary btn-sm py-0 px-2">
                        Select
                      </span>
                    ) : (
                      <small className="text-danger fw-medium">Cannot Visit</small>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
