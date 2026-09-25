import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export default function ModuleCard({ module, isDefaultExpanded = false }) {
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'badge-status-completed';
      case 'In Progress': return 'badge-status-progress';
      case 'Planned': return 'badge-status-planned';
      default: return 'badge-status-default';
    }
  };

  return (
    <div className="module-item-card">
      <div 
        className="module-item-header"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex={0}
      >
        <div className="module-info-left">
          <span className="module-num">{module.number}</span>
          <div>
            <h3 className="module-item-title">{module.title}</h3>
            <p className="module-item-summary">{module.summary}</p>
          </div>
        </div>

        <div className="module-info-right">
          <span className={`status-badge ${getStatusBadgeClass(module.status)}`}>
            {module.status}
          </span>
          <button 
            className="btn-toggle-expand" 
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="module-item-details">
          <div className="deliverables-heading">Deliverables & Key Features:</div>
          <ul className="deliverables-list">
            {module.deliverables.map((item, idx) => (
              <li key={idx} className="deliverable-item">
                <CheckCircle2 size={15} className="deliverable-check" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="module-stack-row">
            <span className="stack-label">Technologies:</span>
            <span className="stack-val">{module.stack}</span>
          </div>
        </div>
      )}
    </div>
  );
}
