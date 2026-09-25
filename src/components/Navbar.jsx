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

        {/* Middle: Access Project */}
        <div className="minimal-nav-center">
          <button 
            className={`minimal-nav-link center-link ${currentView === 'access-project' ? 'active' : ''}`}
            onClick={() => onNavigate('access-project')}
            id="nav-access-project-btn"
          >
            ACCESS PROJECT
          </button>
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
