import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { visitService } from '../api/visitService';
import ResidentSelect from '../components/visitors/ResidentSelect';
import DigitalVisitorPass from '../components/visitors/DigitalVisitorPass';
import AlertMessage from '../components/common/AlertMessage';

/**
 * RegisterVisitorPage Component
 *
 * Implements:
 * 1. Fast Visitor & Delivery Registration
 * 2. Instant Phone Auto-Lookup: Returning delivery personnel details are pre-filled
 * 3. Resident verification check
 * 4. Dual-layer validation (React instant feedback + Spring Boot Bean Validation)
 * 5. Instant Digital Pass generation upon check-in
 */
export default function RegisterVisitorPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    visitorName: '',
    phone: '',
    company: '',
    vehicleNumber: '',
    residentId: '',
    visitorType: 'REGULAR',
    purpose: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [isReturningVisitor, setIsReturningVisitor] = useState(false);
  const [issuedPass, setIssuedPass] = useState(null);

  // Phone number lookup for returning visitors and delivery agents
  const handlePhoneChange = async (e) => {
    const rawPhone = e.target.value;
    setFormData((prev) => ({ ...prev, phone: rawPhone }));

    // Clear previous phone errors
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: null }));
    }

    const cleanPhone = rawPhone.trim();
    // Auto-search if 10 or more digits entered
    if (cleanPhone.length >= 10) {
      try {
        const foundVisitor = await visitService.searchVisitorByPhone(cleanPhone);
        if (foundVisitor) {
          setIsReturningVisitor(true);
          setFormData((prev) => ({
            ...prev,
            visitorName: foundVisitor.fullName || prev.visitorName,
            company: foundVisitor.company || prev.company,
            vehicleNumber: foundVisitor.vehicleNumber || prev.vehicleNumber,
            // If they belong to a delivery service, auto-switch visitor type
            visitorType: foundVisitor.company && ['Amazon', 'Flipkart', 'Swiggy', 'Zomato', 'Dunzo', 'FedEx', 'DHL'].some(c =>
              foundVisitor.company.toLowerCase().includes(c.toLowerCase())
            ) ? 'DELIVERY' : prev.visitorType,
          }));
        } else {
          setIsReturningVisitor(false);
        }
      } catch (err) {
        console.error('Phone lookup failed', err);
      }
    } else {
      setIsReturningVisitor(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleResidentSelect = (residentId) => {
    setFormData((prev) => ({ ...prev, residentId }));
    if (errors.residentId) {
      setErrors((prev) => ({ ...prev, residentId: null }));
    }
  };

  // Frontend validation
  const validateForm = () => {
    const validationErrors = {};

    if (!formData.visitorName.trim()) {
      validationErrors.visitorName = 'Visitor name is required.';
    }

    if (!formData.phone.trim()) {
      validationErrors.phone = 'Phone number is required.';
    } else if (!/^[0-9+ -]{7,15}$/.test(formData.phone.trim())) {
      validationErrors.phone = 'Please enter a valid phone number (7-15 digits).';
    }

    if (!formData.residentId) {
      validationErrors.residentId = 'Please select the resident or employee being visited.';
    }

    if (!formData.purpose.trim()) {
      validationErrors.purpose = 'Purpose of visit is required.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        residentId: Number(formData.residentId),
      };

      const newVisit = await visitService.createVisit(payload);
      setIssuedPass(newVisit); // Triggers digital pass view
    } catch (err) {
      if (err.data && err.data.fieldErrors) {
        setErrors(err.data.fieldErrors);
      }
      setServerError(err.message || 'Failed to check in visitor. Please verify all details.');
    } finally {
      setSubmitting(false);
    }
  };

  // Quick preset buttons for common delivery and maintenance workflows
  const applyPreset = (type, company, defaultPurpose) => {
    setFormData((prev) => ({
      ...prev,
      visitorType: type,
      company: company || prev.company,
      purpose: defaultPurpose || prev.purpose,
    }));
  };

  // If pass was successfully generated, display the pass view directly!
  if (issuedPass) {
    return (
      <div className="container py-4">
        <div className="text-center mb-4">
          <div className="badge bg-success fs-6 px-3 py-2 mb-2">
            <i className="bi bi-check2-circle me-1"></i> Registration & Check-In Successful!
          </div>
          <h3 className="fw-bold text-dark">Gate Pass Generated</h3>
          <p className="text-secondary">Present this pass to the visitor or print for physical gate tracking.</p>
        </div>

        <DigitalVisitorPass
          visit={issuedPass}
          onClose={() => navigate('/current')}
        />

        <div className="text-center mt-4">
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => {
              setIssuedPass(null);
              setFormData({
                visitorName: '',
                phone: '',
                company: '',
                vehicleNumber: '',
                residentId: '',
                visitorType: 'REGULAR',
                purpose: '',
                notes: '',
              });
              setIsReturningVisitor(false);
            }}
          >
            <i className="bi bi-person-plus me-1"></i> Register Another Visitor
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/current')}
          >
            <i className="bi bi-door-open me-1"></i> View All Active Inside
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4" style={{ maxWidth: '850px' }}>
      <div className="card border-0 shadow-sm rounded-3">
        <div className="card-header bg-primary text-white py-3 px-4">
          <h4 className="fw-bold mb-0">
            <i className="bi bi-person-badge me-2"></i> Register New Visitor / Delivery Check-In
          </h4>
          <small className="opacity-75">
            Record incoming visitor details, verify destination resident, and issue an authorized pass.
          </small>
        </div>

        <div className="card-body p-4">
          <AlertMessage message={serverError} type="danger" onClose={() => setServerError(null)} />

          {/* Quick Category Presets for Security Speed */}
          <div className="mb-4 p-3 bg-light rounded border">
            <small className="text-muted fw-semibold text-uppercase d-block mb-2">
              <i className="bi bi-lightning-charge-fill text-warning me-1"></i> Quick 1-Click Presets:
            </small>
            <div className="d-flex flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-warning text-dark bg-white"
                onClick={() => applyPreset('DELIVERY', 'Amazon', 'Package delivery')}
              >
                <i className="bi bi-box-seam me-1"></i> Amazon
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-warning text-dark bg-white"
                onClick={() => applyPreset('DELIVERY', 'Swiggy / Zomato', 'Food delivery')}
              >
                <i className="bi bi-bag-heart me-1"></i> Food Delivery
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-info text-dark bg-white"
                onClick={() => applyPreset('MAINTENANCE', 'Urban Company', 'Home repair / maintenance')}
              >
                <i className="bi bi-tools me-1"></i> Repair / Service
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary bg-white"
                onClick={() => applyPreset('GUEST', '', 'Personal visit')}
              >
                <i className="bi bi-person-heart me-1"></i> Guest / Friend
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className="row g-3">
              {/* Phone Number with auto-lookup */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-secondary">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                    placeholder="Enter 10-digit phone number"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
                {isReturningVisitor && (
                  <small className="text-success fw-medium mt-1 d-block">
                    <i className="bi bi-check-circle-fill me-1"></i> Known visitor profile found & details auto-filled!
                  </small>
                )}
              </div>

              {/* Visitor Name */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Visitor Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="visitorName"
                  className={`form-control ${errors.visitorName ? 'is-invalid' : ''}`}
                  placeholder="e.g. John Doe / Delivery Person Name"
                  value={formData.visitorName}
                  onChange={handleInputChange}
                />
                {errors.visitorName && <div className="invalid-feedback">{errors.visitorName}</div>}
              </div>

              {/* Visitor Type */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Visitor Category <span className="text-danger">*</span>
                </label>
                <select
                  name="visitorType"
                  className="form-select"
                  value={formData.visitorType}
                  onChange={handleInputChange}
                >
                  <option value="REGULAR">Regular Visitor</option>
                  <option value="DELIVERY">Delivery / Courier (Swiggy, Amazon, etc.)</option>
                  <option value="MAINTENANCE">Maintenance / Technician</option>
                  <option value="GUEST">Guest / Family</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Company / Service Provider */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Company / Service (Optional)</label>
                <input
                  type="text"
                  name="company"
                  className="form-control"
                  placeholder="e.g. Amazon, Dunzo, Urban Company"
                  value={formData.company}
                  onChange={handleInputChange}
                />
              </div>

              {/* Vehicle Number */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Vehicle Number (Optional)</label>
                <input
                  type="text"
                  name="vehicleNumber"
                  className="form-control font-monospace"
                  placeholder="e.g. TN-01-AB-1234 (Leave blank if walk-in)"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                />
              </div>

              {/* Purpose */}
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">
                  Purpose of Visit <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="purpose"
                  className={`form-control ${errors.purpose ? 'is-invalid' : ''}`}
                  placeholder="e.g. Parcel delivery, AC cleaning, Friend"
                  value={formData.purpose}
                  onChange={handleInputChange}
                />
                {errors.purpose && <div className="invalid-feedback">{errors.purpose}</div>}
              </div>

              {/* Resident Selector */}
              <div className="col-12">
                <ResidentSelect
                  selectedResidentId={formData.residentId}
                  onSelect={handleResidentSelect}
                  error={errors.residentId}
                />
              </div>

              {/* Security Guard Notes */}
              <div className="col-12">
                <label className="form-label fw-semibold">Security Guard Notes (Optional)</label>
                <textarea
                  name="notes"
                  rows="2"
                  className="form-control"
                  placeholder="Optional observations (e.g. carrying 2 heavy packages, visiting with helper)"
                  value={formData.notes}
                  onChange={handleInputChange}
                ></textarea>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                onClick={() => navigate('/')}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary px-4 fw-semibold"
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Registering & Checking In...
                  </>
                ) : (
                  <>
                    <i className="bi bi-shield-check me-1"></i> Check In & Issue Pass
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
