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
            EVALUATION CRITERIA
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
              ACCESS PROJECT
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
            RULES & FORMULAS
          </button>
        </div>

      </div>
    </header>
  );
}
