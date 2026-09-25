import React from 'react';

export default function Navbar({ 
  currentView, 
  onNavigate, 
  onOpenEvaluation 
}) {
  return (
    <header className="minimal-navbar">
      <div className="minimal-nav-container">
        
        {/* First / Left: Evaluation Criteria */}
        <div className="minimal-nav-left">
          <button 
            className="minimal-nav-link"
            onClick={onOpenEvaluation}
            id="nav-eval-btn"
          >
            <span className="nav-text-desktop">EVALUATION CRITERIA</span>
            <span className="nav-text-mobile">CRITERIA</span>
          </button>
        </div>

        {/* Middle: Fades between ACCESS PROJECT and CAP776 Home */}
        <div className="minimal-nav-center">
          {currentView === 'access-project' ? (
            <button 
              className="minimal-nav-link nav-home-brand-btn"
              onClick={() => onNavigate('welcome')}
              id="nav-cap776-home-btn"
              title="Return to Welcome Screen"
            >
              CAP776
            </button>
          ) : (
            <button 
              className="minimal-nav-link center-link"
              onClick={() => onNavigate('access-project')}
              id="nav-access-project-btn"
              title="Access Project Workspace"
            >
              <span className="nav-text-desktop">ACCESS PROJECT</span>
              <span className="nav-text-mobile">ACCESS PROJECT</span>
            </button>
          )}
        </div>

        {/* Right Corner: Rules & Formulas */}
        <div className="minimal-nav-right">
          <button 
            className={`minimal-nav-link ${currentView === 'info' ? 'active' : ''}`}
            onClick={() => onNavigate('info')}
            id="nav-rules-btn"
          >
            <span className="nav-text-desktop">RULES & FORMULAS</span>
            <span className="nav-text-mobile">RULES</span>
          </button>
        </div>

      </div>
    </header>
  );
}
