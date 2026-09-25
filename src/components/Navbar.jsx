import React from 'react';
import { ArrowRight, ArrowLeft, Award } from 'lucide-react';

export default function Navbar({ currentView, onNavigate, checklistProgress, onOpenEvaluation }) {
  return (
    <header className="site-header">
      <div className="header-container">
        
        {/* Top Row / Desktop Left & Right */}
        <div className="header-main-row">
          {/* Brand */}
          <div 
            className="header-brand" 
            onClick={() => onNavigate('welcome')}
            role="button"
            tabIndex={0}
          >
            <span className="brand-code">CAP776</span>
            <span className="brand-divider">/</span>
            <span className="brand-name">Mini Project</span>
          </div>

          {/* Quick Header Actions */}
          <div className="header-actions">
            <button 
              className="btn-evaluation-pill"
              onClick={onOpenEvaluation}
              title="View marks breakdown and evaluation rules"
            >
              <Award size={14} />
              <span className="eval-btn-label">Evaluation Criteria</span>
            </button>

            {currentView !== 'access-project' ? (
              <button 
                className="btn-header-action"
                onClick={() => onNavigate('access-project')}
                id="header-access-btn"
              >
                <span>Access Project</span>
                <ArrowRight size={13} />
              </button>
            ) : (
              <button 
                className="btn-header-secondary"
                onClick={() => onNavigate('welcome')}
              >
                <ArrowLeft size={13} />
                <span>Home</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs (Centered on desktop, full-width segmented control on mobile) */}
        <nav className="header-nav">
          <button 
            className={`nav-item ${currentView === 'welcome' ? 'active' : ''}`}
            onClick={() => onNavigate('welcome')}
          >
            Welcome
          </button>
          <button 
            className={`nav-item ${currentView === 'info' ? 'active' : ''}`}
            onClick={() => onNavigate('info')}
          >
            Rules & Formulas
            <span className="nav-count">
              {checklistProgress.completed}/{checklistProgress.total}
            </span>
          </button>
          <button 
            className={`nav-item nav-item-access ${currentView === 'access-project' ? 'active' : ''}`}
            onClick={() => onNavigate('access-project')}
          >
            <span>Access Project</span>
            <span className="nav-pulse-dot"></span>
          </button>
        </nav>

      </div>
    </header>
  );
}
