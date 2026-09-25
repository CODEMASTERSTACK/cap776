import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Layers, 
  Cpu, 
  CheckSquare, 
  Calendar, 
  Scale, 
  Award,
  Info
} from 'lucide-react';
import ParameterCard from './ParameterCard';
import StudentFunctionsTable from './StudentFunctionsTable';
import Checklist from './Checklist';

export default function ProjectInfoView({ 
  projectData, 
  onBackToWelcome, 
  checklistState, 
  onToggleChecklistItem, 
  onToggleAllChecklist,
  onProceed,
  onOpenEvaluation
}) {
  const [activeTab, setActiveTab] = useState('parameters'); // 'parameters', 'rules', 'functions', 'evaluation', 'checklist'

  const completedCount = Object.values(checklistState).filter(Boolean).length;
  const totalCount = projectData.checklist.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const rubric = projectData.evaluationRubric;

  return (
    <div className="info-page">
      <div className="info-wrapper">

        {/* Top Navigation Row */}
        <div className="info-nav-bar">
          <button className="btn-back-link" onClick={onBackToWelcome}>
            <ArrowLeft size={15} />
            <span>Back to Welcome Page</span>
          </button>

          <div className="info-header-actions-row">
            {/* Direct Evaluation Criteria Button */}
            <button 
              className="btn-evaluation-pill"
              onClick={onOpenEvaluation}
            >
              <Award size={14} />
              <span>Evaluation Criteria</span>
            </button>

            <div className="info-status-pill">
              <span className="status-dot-active"></span>
              <span>{projectData.meta.status}</span>
            </div>
          </div>
        </div>

        {/* Project Header Card */}
        <div className="project-header-card">
          <div className="project-header-main">
            <div className="academic-badge-row">
              <span className="badge-tag">{projectData.meta.code}</span>
              <span className="badge-text">{projectData.meta.institution} • {projectData.meta.accreditation}</span>
            </div>
            <h1 className="project-title">{projectData.meta.title} — Rules & Formulas</h1>
            <p className="project-meta-desc">
              Comprehensive reference of all 9 project parameters, mathematical definitions, required student functions, 
              evaluation rubric (100 marks scaled down to 15), and timeline constraints.
            </p>
          </div>

          <div className="project-details-grid">
            <div className="detail-item">
              <span className="detail-label">Start Date</span>
              <span className="detail-val">{projectData.meta.recordingPeriod.startDate}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">End Date</span>
              <span className="detail-val">{projectData.meta.recordingPeriod.endDate}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Evaluation Rubric</span>
              <span className="detail-val">100 Marks (Scale 15)</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Academic Session</span>
              <span className="detail-val">{projectData.meta.academicSession}</span>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="section-tabs-bar">
          <button 
            className={`tab-link ${activeTab === 'parameters' ? 'active' : ''}`}
            onClick={() => setActiveTab('parameters')}
          >
            <Layers size={15} />
            <span>Parameters & Formulas ({projectData.parameters.length})</span>
          </button>

          <button 
            className={`tab-link ${activeTab === 'evaluation' ? 'active' : ''}`}
            onClick={() => setActiveTab('evaluation')}
          >
            <Award size={15} />
            <span>Evaluation Criteria (Rubric)</span>
          </button>

          <button 
            className={`tab-link ${activeTab === 'rules' ? 'active' : ''}`}
            onClick={() => setActiveTab('rules')}
          >
            <Scale size={15} />
            <span>Project Rules & Guidelines</span>
          </button>

          <button 
            className={`tab-link ${activeTab === 'functions' ? 'active' : ''}`}
            onClick={() => setActiveTab('functions')}
          >
            <Cpu size={15} />
            <span>Student Functions Spec</span>
          </button>

          <button 
            className={`tab-link ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklist')}
          >
            <CheckSquare size={15} />
            <span>Review Checklist ({completedCount}/{totalCount})</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="tab-body-container">

          {/* TAB 1: PARAMETERS & FORMULAS */}
          {activeTab === 'parameters' && (
            <div className="tab-pane">
              {/* Parameters Quick Summary Table */}
              <div className="clean-card">
                <div className="card-table-header">
                  <h3 className="clean-card-title">Parameters Overview Table</h3>
                  <span className="table-subtitle">Summary of all 9 indices to calculate</span>
                </div>
                
                <div className="param-summary-table-wrap">
                  <table className="param-summary-table">
                    <thead>
                      <tr>
                        <th>Parameter Full Name</th>
                        <th>Code</th>
                        <th>Standard Unit</th>
                        <th>Weight in PAI</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectData.parameters.map((p) => (
                        <tr key={p.id} className={p.id === 'pai' ? 'row-highlight' : ''}>
                          <td className="param-name-td">
                            <strong>{p.name}</strong>
                          </td>
                          <td>
                            <span className="code-pill">{p.code}</span>
                          </td>
                          <td className="unit-td">{p.unit}</td>
                          <td>
                            <span className="weight-cell">{p.weightInPAI}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Mathematical Cards */}
              <div className="section-title-group" style={{ marginTop: '1rem' }}>
                <h2 className="section-title">Detailed Mathematical Formulas</h2>
                <p className="section-subtitle">
                  Click on "Test Formula with Sample Data" on any card to test calculations.
                </p>
              </div>

              <div className="param-cards-stack">
                {/* Composite PAI first */}
                {projectData.parameters.filter(p => p.id === 'pai').map(p => (
                  <ParameterCard key={p.id} param={p} isFeatured={true} />
                ))}

                {/* Remaining 8 indices */}
                {projectData.parameters.filter(p => p.id !== 'pai').map(p => (
                  <ParameterCard key={p.id} param={p} />
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: EVALUATION CRITERIA (RUBRIC) */}
          {activeTab === 'evaluation' && (
            <div className="tab-pane">
              <div className="clean-card">
                <div className="card-table-header">
                  <div>
                    <h3 className="clean-card-title">Evaluation Criteria & Rubric</h3>
                    <p className="clean-card-text">
                      Detailed mark allocation across 10 evaluation components ({rubric.scalingNote}).
                    </p>
                  </div>

                  <button 
                    className="btn-open-modal-text"
                    onClick={onOpenEvaluation}
                  >
                    <span>Open in Modal Dialog</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="eval-scaling-banner">
                  <Info size={16} className="eval-info-icon" />
                  <span>
                    Total Evaluation: <strong>100 Marks</strong> (10 Components) scaled down to <strong>15 Marks</strong> for final academic assessment.
                  </span>
                </div>

                <div className="rubric-table-wrapper" style={{ marginTop: '1rem' }}>
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
            </div>
          )}

          {/* TAB 3: RULES & GUIDELINES */}
          {activeTab === 'rules' && (
            <div className="tab-pane">
              <div className="section-title-group">
                <h2 className="section-title">Project Rules & Criteria</h2>
                <p className="section-subtitle">
                  Mandatory specifications and constraints governing student data submission.
                </p>
              </div>

              {/* Timeline Alert */}
              <div className="timeline-alert-box">
                <Calendar size={20} className="alert-cal-icon" />
                <div>
                  <h4 className="alert-title">Strict Data Continuum Period</h4>
                  <p className="alert-body">
                    Data recording starts on <strong>{projectData.meta.recordingPeriod.startDate}</strong>. 
                    The final recorded day will be <strong>{projectData.meta.recordingPeriod.endDate}</strong>. 
                    Continuity will be graded according to the DCI parameter.
                  </p>
                </div>
              </div>

              <div className="rules-cards-grid">
                {projectData.rules.map((rule, idx) => (
                  <div key={idx} className="clean-card">
                    <div className="rule-badge">Rule 0{idx + 1}</div>
                    <h3 className="clean-card-title">{rule.title}</h3>
                    <p className="clean-card-text">{rule.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: STUDENT FUNCTIONS SPEC */}
          {activeTab === 'functions' && (
            <div className="tab-pane">
              <StudentFunctionsTable parameters={projectData.parameters} />
            </div>
          )}

          {/* TAB 5: CHECKLIST */}
          {activeTab === 'checklist' && (
            <div className="tab-pane">
              <Checklist 
                items={projectData.checklist}
                checkedState={checklistState}
                onToggleItem={onToggleChecklistItem}
                onToggleAll={onToggleAllChecklist}
              />
            </div>
          )}

        </div>

        {/* BOTTOM PROCEED ACTION BAR */}
        <div className="bottom-proceed-card">
          <div className="proceed-status-col">
            <div className="proceed-status-title">Review & Progression Status</div>
            <div className="proceed-status-desc">
              {completedCount} of {totalCount} requirements checked ({progressPercent}% verified).
              {completedCount === totalCount ? " All formulas and rules verified." : " Check off the criteria to authorize project completion."}
            </div>
          </div>

          <div className="proceed-action-col">
            <button 
              className="btn-proceed-main"
              onClick={onProceed}
              id="proceed-further-btn"
            >
              <span>Proceed Further</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
