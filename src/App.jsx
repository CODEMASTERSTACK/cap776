import React, { useState } from 'react';
import Navbar from './components/Navbar';
import WelcomeView from './components/WelcomeView';
import ProjectInfoView from './components/ProjectInfoView';
import AccessProjectView from './components/AccessProjectView';
import ProceedModal from './components/ProceedModal';
import EvaluationModal from './components/EvaluationModal';
import DisclaimerModal from './components/DisclaimerModal';
import Footer from './components/Footer';
import { projectData } from './data/projectData';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('welcome'); // 'welcome' | 'info' | 'access-project'
  const [isProceedModalOpen, setIsProceedModalOpen] = useState(false);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isDisclaimerModalOpen, setIsDisclaimerModalOpen] = useState(false);

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

  const handleNavigate = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEnter = () => {
    setCurrentView('info');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAccessProject = () => {
    setCurrentView('access-project');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
