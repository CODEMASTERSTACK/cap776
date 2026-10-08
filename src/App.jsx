import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WelcomeView from './components/WelcomeView';
import ProjectInfoView from './components/ProjectInfoView';
import AccessProjectView from './components/AccessProjectView';
import YourEvaluationView from './components/YourEvaluationView';
import ProceedModal from './components/ProceedModal';
import EvaluationModal from './components/EvaluationModal';
import DisclaimerModal from './components/DisclaimerModal';
import Footer from './components/Footer';
import { projectData } from './data/projectData';
import './App.css';

const ROUTE_MAP = {
  'welcome': '/',
  'info': '/rules',
  'access-project': '/access-project',
  'your-evaluation': '/yourevaluation',
};

const getViewFromPath = (pathname) => {
  const clean = (pathname || window.location.pathname || '/').toLowerCase().replace(/\/+$/, '') || '/';
  if (clean === '/yourevaluation' || clean === '/your-evaluation' || clean === '/evaluation') {
    return 'your-evaluation';
  }
  if (clean === '/access-project' || clean === '/project') {
    return 'access-project';
  }
  if (clean === '/rules' || clean === '/info' || clean === '/rules-and-formulas') {
    return 'info';
  }
  return 'welcome';
};

const getTitleFromView = (view) => {
  switch (view) {
    case 'your-evaluation':
      return 'CAP776 — Your Evaluation & Assessment Engine';
    case 'access-project':
      return 'CAP776 — Project Workspace';
    case 'info':
      return 'CAP776 — Rules & Formulas';
    case 'welcome':
    default:
      return 'CAP776 — Continuous Activity Profiler';
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState(() => getViewFromPath(window.location.pathname)); // 'welcome' | 'info' | 'access-project' | 'your-evaluation'
  const [isProceedModalOpen, setIsProceedModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);

  // Sync route on popstate and update document title
  useEffect(() => {
    const handlePopState = () => {
      setCurrentView(getViewFromPath(window.location.pathname));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    document.title = getTitleFromView(currentView);
  }, [currentView]);

  // Clean canonical URL on mount if an alias was used
  useEffect(() => {
    const clean = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    if (clean === '/your-evaluation' || clean === '/evaluation') {
      window.history.replaceState({ view: 'your-evaluation' }, '', '/yourevaluation');
    }
  }, []);

  // Initialize checklist state with default checked items
  const [checklistState, setChecklistState] = useState(() => {
    const initial = {};
    projectData.checklist.forEach(item => {
      initial[item.id] = !!item.defaultChecked;
    });
    return initial;
  });

  const handleToggleChecklistItem = (id) => {
    setChecklistState(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleAllChecklist = (checkAll) => {
    const updated = {};
    projectData.checklist.forEach(item => {
      updated[item.id] = checkAll;
    });
    setChecklistState(updated);
  };

  const handleNavigate = (view, replace = false) => {
    const targetPath = ROUTE_MAP[view] || '/';
    const currentPath = window.location.pathname;

    if (currentPath !== targetPath) {
      if (replace) {
        window.history.replaceState({ view }, '', targetPath);
      } else {
        window.history.pushState({ view }, '', targetPath);
      }
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnter = () => {
    handleNavigate('info');
  };

  const handleAccessProject = () => {
    handleNavigate('access-project');
  };

  const completedCount = Object.values(checklistState).filter(Boolean).length;
  const totalCount = projectData.checklist.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  return (
    <div className={`app-wrapper ${currentView === 'welcome' ? 'welcome-view-active' : ''}`}>
      <Navbar 
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenEvaluation={() => setIsEvaluationModalOpen(true)}
      />

      <main className="main-content">
        {currentView === 'welcome' && (
          <WelcomeView 
            onAccessProject={handleAccessProject}
          />
        )}
        
        {currentView === 'info' && (
          <ProjectInfoView 
            projectData={projectData}
            onBackToWelcome={() => handleNavigate('welcome')}
            checklistState={checklistState}
            onToggleChecklistItem={handleToggleChecklistItem}
            onToggleAllChecklist={handleToggleAllChecklist}
            onProceed={() => setIsProceedModalOpen(true)}
            onOpenEvaluation={() => setIsEvaluationModalOpen(true)}
          />
        )}

        {currentView === 'access-project' && (
          <AccessProjectView 
            onBackToWelcome={() => handleNavigate('welcome')}
            onOpenEvaluation={() => setIsEvaluationModalOpen(true)}
          />
        )}

        {currentView === 'your-evaluation' && (
          <YourEvaluationView 
            onBackToWelcome={() => handleNavigate('welcome')}
            onOpenEvaluationCriteria={() => setIsEvaluationModalOpen(true)}
          />
        )}
      </main>

      {currentView !== 'welcome' && <Footer meta={projectData.meta} />}

      {/* Progression Authorization Modal */}
      <ProceedModal 
        isOpen={isProceedModalOpen}
        onClose={() => setIsProceedModalOpen(false)}
        projectData={projectData}
        progressPercent={progressPercent}
      />

      {/* Evaluation Criteria Modal (Triggered by 'Evaluation Criteria' button) */}
      <EvaluationModal 
        isOpen={isEvaluationModalOpen}
        onClose={() => setIsEvaluationModalOpen(false)}
        rubric={projectData.evaluationRubric}
      />

      {/* Academic Disclaimer Modal */}
      <DisclaimerModal 
        isOpen={isDisclaimerModalOpen}
        onClose={() => setIsDisclaimerModalOpen(false)}
      />
    </div>
  );
}
