import React from 'react';
import { AlertTriangle, X, ShieldAlert, Check } from 'lucide-react';

export default function DisclaimerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content disclaimer-modal-card" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-header-icon-title">
            <div className="modal-icon-badge warning">
              <ShieldAlert size={20} />
            </div>
            <div>
              <h2 className="modal-title">Academic Disclaimer & Policy</h2>
              <p className="modal-subtitle">CAP776 Mini Project Guidelines</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="disclaimer-callout-box">
            <AlertTriangle size={24} className="disclaimer-callout-icon" />
            <div className="disclaimer-callout-text">
              <strong>Official Notice:</strong> We do not take any responsibility for your academic evaluation, obtaining full marks, or passing without any issues.
            </div>
          </div>

          <div className="disclaimer-points-list">
            <div className="disclaimer-point-item">
              <span className="point-bullet">1</span>
              <div>
                <strong>Student Responsibility:</strong> You are solely responsible for verifying your Excel workbook structure, date ranges (13 Aug – 21 Sep 2026), and data values before submitting.
              </div>
            </div>
            <div className="disclaimer-point-item">
              <span className="point-bullet">2</span>
              <div>
                <strong>Independent Evaluation:</strong> University evaluators assess code explanation, viva-voce questions, and individual understanding in addition to script outputs.
              </div>
            </div>
            <div className="disclaimer-point-item">
              <span className="point-bullet">3</span>
              <div>
                <strong>Anti-Plagiarism Best Practices:</strong> The generated code variants provide polymorphic architectures to prevent identical submissions, but you must understand how your code works.
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-modal-primary" onClick={onClose}>
            <Check size={16} />
            <span>I Understand & Acknowledge</span>
          </button>
        </div>
      </div>
    </div>
  );
}
