import React from 'react';

/**
 * LoadingSpinner Component
 *
 * Bootstrap Classes Explained:
 * - spinner-border: Creates an animated circular loading spinner (Docs: Components -> Spinners)
 * - text-primary: Colors the spinner with primary brand color (Docs: Utilities -> Colors)
 * - d-flex, justify-content-center, align-items-center: Flexbox centering (Docs: Utilities -> Flex)
 * - py-5: Spacing utility adding padding-top and padding-bottom of size 5 (Docs: Utilities -> Spacing)
 */
export default function LoadingSpinner({ message = 'Loading data...' }) {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center py-5">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-secondary fw-medium">{message}</p>
    </div>
  );
}
