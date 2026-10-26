import React from 'react';

/**
 * StatCard Component
 *
 * Bootstrap Classes Explained:
 * - card: Flexible and extensible content container (Docs: Components -> Card)
 * - card-body: Building block for the card containing title and content (Docs: Components -> Card -> Body)
 * - border-0: Removes the default 1px border around the card (Docs: Utilities -> Borders)
 * - shadow-sm: Small box-shadow for depth (Docs: Utilities -> Shadow)
 * - h-100: Sets height to 100% of parent container (Docs: Utilities -> Sizing)
 * - fs-2, fs-4: Responsive font size utilities (Docs: Utilities -> Text -> Font size)
 */
export default function StatCard({ title, value, icon, color = 'primary', subtitle }) {
  return (
    <div className={`card stat-card border-0 shadow-sm h-100 border-start border-4 border-${color}`}>
      <div className="card-body d-flex align-items-center justify-content-between p-3">
        <div>
          <span className="text-secondary text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05rem' }}>
            {title}
          </span>
          <h2 className="fw-bold my-1 text-dark">{value}</h2>
          {subtitle && (
            <small className="text-muted d-block" style={{ fontSize: '0.8rem' }}>
              {subtitle}
            </small>
          )}
        </div>
        <div className={`p-3 rounded-circle bg-${color} bg-opacity-10 text-${color} fs-3`}>
          <i className={`bi ${icon}`}></i>
        </div>
      </div>
    </div>
  );
}
