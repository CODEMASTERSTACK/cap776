import React, { useEffect, useState } from 'react';
import { X, Check, Download, ArrowRight } from 'lucide-react';

export default function ProceedModal({ isOpen, onClose, projectData, progressPercent }) {
  const [downloaded, setDownloaded] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(projectData, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `${projectData.meta.code}_project_summary.json`);
    document.body.appendChild(dlAnchorElem);
    dlAnchorElem.click();
    dlAnchorElem.remove();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="dialog-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="dialog-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Dialog Header */}
        <div className="dialog-header">
          <div>
            <h3 className="dialog-title">Proceed to Next Phase</h3>
            <p className="dialog-subtitle">
              {projectData.meta.title} • {progressPercent}% of checklist reviewed
            </p>
          </div>
          <button className="dialog-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {/* Dialog Body */}
        <div className="dialog-body">
          <p className="dialog-paragraph">
            You have reviewed the core architecture, module deliverables, and technical requirements 
            for the <strong>{projectData.meta.code}</strong> mini project.
          </p>

          <div className="dialog-section-box">
            <h4 className="section-box-title">Next Development Steps</h4>
            <ul className="dialog-step-list">
              <li>
                <strong>Step 1:</strong> Complete backend API contracts and database schema migrations.
              </li>
              <li>
                <strong>Step 2:</strong> Wire up real-time analytics events and filter pipelines.
              </li>
              <li>
                <strong>Step 3:</strong> Prepare final submission documentation and evaluation report.
              </li>
            </ul>
          </div>
        </div>

        {/* Dialog Footer */}
        <div className="dialog-footer">
          <button className="btn-secondary" onClick={handleDownload}>
            {downloaded ? (
              <>
                <Check size={14} className="text-success" />
                <span>Downloaded Summary</span>
              </>
            ) : (
              <>
                <Download size={14} />
                <span>Download Summary (.json)</span>
              </>
            )}
          </button>

          <button className="btn-primary" onClick={onClose}>
            <span>Continue to Project</span>
            <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
}
