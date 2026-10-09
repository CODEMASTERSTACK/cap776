import React, { useEffect } from 'react';
import { X, Award, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export default function EvaluationModal({ isOpen, onClose, rubric }) {
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

  return (
    <div className="dialog-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="dialog-container eval-modal-container" onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className="dialog-header">
          <div className="eval-header-title-group">
            <div className="eval-icon-badge">
              <Award size={18} />
            </div>
            <div>
              <h3 className="dialog-title">Project Evaluation Criteria & Rubric</h3>
              <p className="dialog-subtitle">
                Total 100 Marks • {rubric.scalingNote}
              </p>
            </div>
          </div>
          <button className="dialog-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {/* Body Content: Clean Structured Table */}
        <div className="dialog-body eval-modal-body">
          {/* Instructor Criteria Update Notice */}
          <div className="eval-criteria-update-notice">
            <AlertTriangle size={18} className="eval-warning-icon" />
            <div className="eval-warning-content">
              <strong>Notice: Criteria Changed by Instructor</strong>
              <p>
                The course instructor has modified the evaluation criteria and made the repository private. The 10-component rubric below reflects the baseline criteria and may differ from the teacher's current evaluation standards. Do not assume your official marks will match this exact rubric.
              </p>
            </div>
          </div>

          <div className="eval-scaling-banner">
            <Info size={16} className="eval-info-icon" />
            <span>
              The project is evaluated out of <strong>100 Marks</strong> across 10 components, and then scaled down to <strong>15 Marks</strong> for final grading.
            </span>
          </div>

          <div className="rubric-table-wrapper">
            <table className="rubric-table">
              <thead>
                <tr>
                  <th style={{ width: '38%' }}>Evaluation Component</th>
                  <th style={{ width: '14%', textAlign: 'center' }}>Marks</th>
                  <th style={{ width: '48%' }}>What is Evaluated</th>
                </tr>
              </thead>
              <tbody>
                {rubric.components.map((item, idx) => (
                  <tr key={item.id} className={idx % 2 === 1 ? 'row-alt' : ''}>
                    <td className="rubric-component-cell">
                      <strong>{item.component}</strong>
                    </td>
                    <td className="rubric-marks-cell">
                      <span className="marks-badge">{item.marks}</span>
                    </td>
                    <td className="rubric-criteria-cell">
                      {item.criteria}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="rubric-total-row">
                  <td>
                    <strong>TOTAL</strong>
                  </td>
                  <td className="rubric-marks-cell">
                    <strong className="marks-total-badge">{rubric.totalRawMarks}*</strong>
                  </td>
                  <td>
                    <em className="scaling-footnote">{rubric.scalingNote}</em>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="dialog-footer">
          <div className="eval-footer-note">
            <span>Faculty Grading Standard • CAP776 Mini Project</span>
          </div>
          <button className="btn-primary" onClick={onClose}>
            <span>Got It</span>
          </button>
        </div>

      </div>
    </div>
  );
}
