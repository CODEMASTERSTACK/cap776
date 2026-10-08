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
          {currentView === 'access-project' || currentView === 'your-evaluation' ? (
            <a 
              href="/"
              className="minimal-nav-link nav-home-brand-btn"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  onNavigate('welcome');
                }
              }}
              id="nav-cap776-home-btn"
              title="Return to Welcome Screen"
            >
              CAP776
            </a>
          ) : (
            <a 
              href="/access-project"
              className="minimal-nav-link center-link"
              onClick={(e) => {
                if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                  e.preventDefault();
                  onNavigate('access-project');
                }
              }}
              id="nav-access-project-btn"
              title="Access Project Workspace"
            >
              <span className="nav-text-desktop">ACCESS PROJECT</span>
              <span className="nav-text-mobile">ACCESS PROJECT</span>
            </a>
          )}
        </div>

        {/* Right Corner: Your Evaluation & Rules */}
        <div className="minimal-nav-right">
          <a 
            href="/yourevaluation"
            className={`minimal-nav-link ${currentView === 'your-evaluation' ? 'active' : ''}`}
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault();
                onNavigate('your-evaluation');
              }
            }}
            id="nav-your-eval-btn"
            style={{ marginRight: 'clamp(0.75rem, 1.8vw, 1.75rem)' }}
          >
            <span className="nav-text-desktop">YOUR EVALUATION</span>
            <span className="nav-text-mobile">EVALUATE</span>
          </a>

          <a 
            href="/rules"
            className={`minimal-nav-link ${currentView === 'info' ? 'active' : ''}`}
            onClick={(e) => {
              if (!e.ctrlKey && !e.metaKey && !e.shiftKey) {
                e.preventDefault();
                onNavigate('info');
              }
            }}
            id="nav-rules-btn"
          >
            <span className="nav-text-desktop">RULES & FORMULAS</span>
            <span className="nav-text-mobile">RULES</span>
          </a>
        </div>

      </div>
    </header>
  );
}
