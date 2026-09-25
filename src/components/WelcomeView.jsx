import React, { useEffect } from 'react';
import { ArrowRight, BookOpen, Layers, Calendar, CheckCircle, Award } from 'lucide-react';

export default function WelcomeView({ projectData, onEnter, onAccessProject, onOpenEvaluation }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        onAccessProject();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAccessProject]);

  return (
    <div className="welcome-page">
      <div className="welcome-wrapper">
        
        {/* Main Hero Card */}
        <div className="welcome-hero-card">
          <div className="academic-badge">
            <span>{projectData.meta.code}</span>
            <span className="badge-sep">•</span>
            <span>{projectData.meta.institution}</span>
            <span className="badge-sep">•</span>
            <span className="naac-badge">{projectData.meta.accreditation}</span>
          </div>

          <h1 className="welcome-heading">{projectData.meta.title}</h1>
          
          <p className="welcome-subheading">
            {projectData.meta.subtitle}
          </p>

          <p className="welcome-text">
            Official guidelines, computational algorithms, and mathematical parameter specifications for student implementation. 
            Includes calculation engines for all <strong>9 performance indices</strong> (PAI, TPI, AAI, PhAI, SRI, ABI, TUI, EI, DCI) 
            covering the tracking window from <strong>{projectData.meta.recordingPeriod.startDate}</strong> to <strong>{projectData.meta.recordingPeriod.endDate}</strong>.
          </p>

          {/* Clean Action Buttons */}
          <div className="welcome-actions-group">
            {/* Primary Main Button: Access Project */}
            <button 
              className="btn-enter-primary" 
              onClick={onAccessProject}
              autoFocus
              id="access-project-btn"
            >
              <span>Access Project</span>
              <ArrowRight size={16} />
            </button>

            {/* Secondary Button: Rules & Formulas */}
            <button 
              className="btn-secondary-action" 
              onClick={onEnter}
              id="view-rules-btn"
            >
              <BookOpen size={16} />
              <span>Rules & Formulas</span>
            </button>

            {/* Requested Button: Evaluation criteria */}
            <button 
              className="btn-eval-trigger" 
              onClick={onOpenEvaluation}
              id="evaluation-criteria-btn"
            >
              <Award size={16} />
              <span>Evaluation Criteria</span>
            </button>
          </div>

          <div className="enter-hint">
            Press <kbd>Enter ↵</kbd> on your keyboard to Access Project, or select any section above.
          </div>
        </div>

        {/* Quick Summary Grid */}
        <div className="summary-cards-grid">
          <div className="summary-card">
            <div className="summary-icon-row">
              <BookOpen size={18} className="summary-icon" />
              <span className="summary-label">Course</span>
            </div>
            <div className="summary-value">{projectData.meta.code}</div>
            <div className="summary-desc">{projectData.meta.institution}</div>
          </div>

          <div className="summary-card">
            <div className="summary-icon-row">
              <Layers size={18} className="summary-icon" />
              <span className="summary-label">Parameters</span>
            </div>
            <div className="summary-value">{projectData.parameters.length} Indices</div>
            <div className="summary-desc">PAI, TPI, AAI, PhAI, SRI, etc.</div>
          </div>

          <div className="summary-card">
            <div className="summary-icon-row">
              <Calendar size={18} className="summary-icon" />
              <span className="summary-label">Tracking Window</span>
            </div>
            <div className="summary-value">13 Aug – 21 Sept</div>
            <div className="summary-desc">Continuous Daily Records</div>
          </div>

          <div className="summary-card">
            <div className="summary-icon-row">
              <Award size={18} className="summary-icon text-success" />
              <span className="summary-label">Evaluation Rubric</span>
            </div>
            <div className="summary-value text-success">100 Marks*</div>
            <div className="summary-desc">Scaled down to 15</div>
          </div>
        </div>

      </div>
    </div>
  );
}
