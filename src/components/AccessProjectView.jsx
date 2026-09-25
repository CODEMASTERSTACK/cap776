import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, XCircle, 
  RefreshCw, Download, FileText, ChevronRight, BarChart3, 
  Activity, Clock, Moon, Heart, BookOpen, Smile, Database, Sparkles, Copy, Check
} from 'lucide-react';
import { 
  computePAIFromSheetData, 
  generateSampleSheetData, 
  REQUIRED_COLUMNS, 
  TRACKING_WINDOW 
} from '../utils/excelAnalytics';

export default function AccessProjectView({ onBackToWelcome, onOpenEvaluation }) {
  const [file, setFile] = useState(null);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [rawWorkbook, setRawWorkbook] = useState(null);
  const [calculationResult, setCalculationResult] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'relationships' | 'data-inspector' | 'python-output'
  const [copiedJson, setCopiedJson] = useState(false);
  const fileInputRef = useRef(null);

  // Process a loaded 2D array of sheet data
  const processSheetRows = (rows, fileName = 'student_data.xlsx') => {
    try {
      setIsProcessing(true);
      setError(null);
      const results = computePAIFromSheetData(rows);
      setCalculationResult(results);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to process sheet data according to CAP776 specifications.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle uploaded Excel file
  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result;
        const wb = XLSX.read(buffer, { type: 'array' });
        setRawWorkbook(wb);
        setSheetNames(wb.SheetNames);
        
        // Auto-select first sheet
        const firstSheet = wb.SheetNames[0];
        setSelectedSheet(firstSheet);

        const ws = wb.Sheets[firstSheet];
        const sheetRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
        processSheetRows(sheetRows, uploadedFile.name);
      } catch (err) {
        setError(`Failed to read Excel file: ${err.message}`);
        setIsProcessing(false);
      }
    };
    reader.onerror = () => {
      setError('Error reading file from disk.');
      setIsProcessing(false);
    };
    reader.readAsArrayBuffer(uploadedFile);
  };

  // Handle sheet switching
  const handleSheetChange = (sheetName) => {
    setSelectedSheet(sheetName);
    if (!rawWorkbook) return;
    try {
      const ws = rawWorkbook.Sheets[sheetName];
      const sheetRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      processSheetRows(sheetRows, file?.name || 'student_data.xlsx');
    } catch (err) {
      setError(`Failed to read sheet '${sheetName}': ${err.message}`);
    }
  };

  // Load sample dataset directly
  const handleLoadSampleData = () => {
    setIsProcessing(true);
    setError(null);
    setFile({ name: 'sample_student_log_40days.xlsx', size: 14200 });
    setSheetNames(['Daily Tracking Log']);
    setSelectedSheet('Daily Tracking Log');

    setTimeout(() => {
      const sampleRows = generateSampleSheetData();
      processSheetRows(sampleRows, 'sample_student_log_40days.xlsx');
    }, 200);
  };

  // Generate and download a real formatted .xlsx template
  const handleDownloadTemplate = () => {
    const sampleRows = generateSampleSheetData();
    const ws = XLSX.utils.aoa_to_sheet(sampleRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Daily Tracking Log');
    XLSX.writeFile(wb, 'CAP776_Student_Tracking_Template.xlsx');
  };

  const copyResultJson = () => {
    if (!calculationResult) return;
    const pythonEquivalent = {
      "Personal Activity Index: ": calculationResult.pai,
      "breakdown": {
        "Tech Productivity Index is: ": calculationResult.indices.tpi.value,
        "Academic Activity Index: ": calculationResult.indices.aai.value,
        "Physical Activity Index: ": calculationResult.indices.phai.value,
        "Sleep and Recovery Index: ": calculationResult.indices.sri.value,
        "Time Utilisation Index: ": calculationResult.indices.tui.value,
        "Experience Index: ": calculationResult.indices.ei.value,
        "Active Balance Index: ": calculationResult.indices.abi.value,
        "Data Continuity Index": calculationResult.indices.dci.value
      }
    };
    navigator.clipboard.writeText(JSON.stringify(pythonEquivalent, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="access-project-container">
      
      {/* Top Banner / Header */}
      <div className="access-header-section">
        <div className="access-breadcrumb">
          <button className="breadcrumb-link" onClick={onBackToWelcome}>Home</button>
          <ChevronRight size={14} />
          <span className="breadcrumb-current">Access Project Calculator</span>
        </div>

        <div className="access-title-row">
          <div>
            <h1 className="access-main-title">CAP776 Data Processing & Calculation Engine</h1>
            <p className="access-subtitle">
              Upload your student daily tracking Excel workbook to execute openpyxl-compliant calculations for all 9 indices and relationship analyses.
            </p>
          </div>
          <div className="access-header-badges">
            <button className="btn-eval-pill-sm" onClick={onOpenEvaluation}>
              <span>Evaluation Rubric</span>
            </button>
            <span className="window-pill">
              40 Days: 13 Aug – 21 Sep 2026
            </span>
          </div>
        </div>
      </div>

      {/* File Ingestion Card */}
      <div className="file-ingestion-card">
        <div className="card-top-header">
          <div className="header-icon-box">
            <FileSpreadsheet size={20} className="text-primary" />
          </div>
          <div className="header-info">
            <h3 className="card-title">1. Provide Student Tracking Excel File</h3>
            <p className="card-desc">
              Must contain column headers in <strong>Row 5</strong> (<code>ws[5]</code>) and daily records from <strong>Row 7 to 46</strong> (13 Aug – 21 Sep 2026).
            </p>
          </div>
        </div>

        <div className="upload-controls-row">
          {/* Hidden real file input */}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".xlsx, .xls"
            style={{ display: 'none' }}
            id="excel-file-input"
          />

          {/* Drag & Drop / Select Box */}
          <div 
            className={`dropzone-box ${file ? 'has-file' : ''}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={24} className="dropzone-icon" />
            <div className="dropzone-texts">
              <span className="dropzone-primary-text">
                {file ? file.name : "Click to select or drop student .xlsx file"}
              </span>
              <span className="dropzone-secondary-text">
                {file ? `${(file.size / 1024).toFixed(1)} KB • Click to change file` : "Supports Excel (.xlsx, .xls) worksheets"}
              </span>
            </div>
            <button type="button" className="btn-select-file">
              Browse Files
            </button>
          </div>

          <div className="or-divider">
            <span>OR</span>
          </div>

          {/* Quick Actions */}
          <div className="quick-upload-actions">
            <button 
              type="button" 
              className="btn-sample-data" 
              onClick={handleLoadSampleData}
              title="Loads realistic 40-day student log data immediately"
            >
              <Sparkles size={16} />
              <span>Load Sample Student Data</span>
            </button>

            <button 
              type="button" 
              className="btn-download-template" 
              onClick={handleDownloadTemplate}
              title="Download empty formatted Excel template with correct Row 5 headers"
            >
              <Download size={16} />
              <span>Download Excel Template (.xlsx)</span>
            </button>
          </div>
        </div>

        {/* Sheet Selector (if multiple sheets exist) */}
        {sheetNames.length > 1 && (
          <div className="sheet-selector-row">
            <label htmlFor="sheet-select" className="sheet-label">
              Active Worksheet:
            </label>
            <select 
              id="sheet-select"
              value={selectedSheet} 
              onChange={(e) => handleSheetChange(e.target.value)}
              className="sheet-dropdown"
            >
              {sheetNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
            <span className="sheet-count-tag">{sheetNames.length} sheets found</span>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="error-alert-banner">
            <XCircle size={18} className="error-icon" />
            <div className="error-text">
              <strong>Calculation Error:</strong> {error}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isProcessing && (
        <div className="processing-state-box">
          <RefreshCw size={24} className="spin-icon text-primary" />
          <p>Reading worksheet cells, validating Row 5 headers, and computing indices...</p>
        </div>
      )}

      {/* Calculation Results Display */}
      {calculationResult && !isProcessing && (
        <div className="analytics-dashboard">
          
          {/* Audit Status Bar */}
          <div className={`audit-status-bar ${calculationResult.audit.isFullyCompliant ? 'status-pass' : 'status-warn'}`}>
            <div className="audit-left">
              {calculationResult.audit.isFullyCompliant ? (
                <CheckCircle2 size={20} className="status-icon success" />
              ) : (
                <AlertTriangle size={20} className="status-icon warn" />
              )}
              <div>
                <h4 className="audit-title">
                  {calculationResult.audit.isFullyCompliant 
                    ? "Dataset Audit Passed: 10/10 Column Requirements Met" 
                    : `Audit Warning: ${calculationResult.audit.missingCols.length} Column(s) Missing`}
                </h4>
                <div className="audit-metrics">
                  <span><strong>Expected Days:</strong> {calculationResult.audit.expectedDays}</span>
                  <span className="audit-sep">•</span>
                  <span><strong>Valid Days Tracked:</strong> {calculationResult.audit.validDays}</span>
                  <span className="audit-sep">•</span>
                  <span><strong>Missing/Nil Days:</strong> {calculationResult.audit.missingOrInvalidDays}</span>
                  <span className="audit-sep">•</span>
                  <span><strong>Data Continuity:</strong> {calculationResult.indices.dci.value}%</span>
                </div>
              </div>
            </div>

            <div className="audit-actions">
              <button 
                className="btn-copy-json" 
                onClick={copyResultJson}
                title="Copy Python-compatible dictionary output"
              >
                {copiedJson ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedJson ? "Copied Python Dict!" : "Copy Python JSON"}</span>
              </button>
            </div>
          </div>

          {/* Primary Hero: Personal Activity Index (PAI) */}
          <div className="pai-hero-card">
            <div className="pai-score-area">
              <span className="pai-badge-label">Personal Activity Index (PAI)</span>
              <div className="pai-number-row">
                <span className="pai-big-value">{calculationResult.pai}</span>
                <span className="pai-unit">composite score</span>
              </div>
              <p className="pai-formula-desc">
                <code>PAI = 0.15×TPI + 0.20×AAI + 0.15×PhAI + 0.20×SRI + 0.15×TUI + 0.10×EI + 0.05×DCI</code>
              </p>
            </div>

            <div className="pai-weights-preview">
              <h5 className="weights-title">Mathematical Contribution Breakdown</h5>
              <div className="weights-bar-stack">
                <div style={{ width: '15%' }} className="bar-tpi" title="TPI 15%" />
                <div style={{ width: '20%' }} className="bar-aai" title="AAI 20%" />
                <div style={{ width: '15%' }} className="bar-phai" title="PhAI 15%" />
                <div style={{ width: '20%' }} className="bar-sri" title="SRI 20%" />
                <div style={{ width: '15%' }} className="bar-tui" title="TUI 15%" />
                <div style={{ width: '10%' }} className="bar-ei" title="EI 10%" />
                <div style={{ width: '5%' }} className="bar-dci" title="DCI 5%" />
              </div>
              <div className="weights-legend-grid">
                <span><i className="dot dot-tpi"></i> TPI (15%)</span>
                <span><i className="dot dot-aai"></i> AAI (20%)</span>
                <span><i className="dot dot-phai"></i> PhAI (15%)</span>
                <span><i className="dot dot-sri"></i> SRI (20%)</span>
                <span><i className="dot dot-tui"></i> TUI (15%)</span>
                <span><i className="dot dot-ei"></i> EI (10%)</span>
                <span><i className="dot dot-dci"></i> DCI (5%)</span>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="analytics-tabs-row">
            <button 
              className={`analytics-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <Activity size={15} />
              <span>All 8 Sub-Indices</span>
            </button>
            <button 
              className={`analytics-tab-btn ${activeTab === 'relationships' ? 'active' : ''}`}
              onClick={() => setActiveTab('relationships')}
            >
              <BarChart3 size={15} />
              <span>Relationship Analysis (10 Marks)</span>
            </button>
            <button 
              className={`analytics-tab-btn ${activeTab === 'data-inspector' ? 'active' : ''}`}
              onClick={() => setActiveTab('data-inspector')}
            >
              <Database size={15} />
              <span>40-Day Row Inspector (Rows 7–46)</span>
            </button>
            <button 
              className={`analytics-tab-btn ${activeTab === 'python-output' ? 'active' : ''}`}
              onClick={() => setActiveTab('python-output')}
            >
              <FileText size={15} />
              <span>Python Terminal Output</span>
            </button>
          </div>

          {/* TAB 1: 8 Sub-Indices Grid */}
          {activeTab === 'overview' && (
            <div className="indices-metrics-grid">
              
              {/* TPI */}
              <div className="index-stat-card">
                <div className="card-stat-header">
                  <span className="index-code-badge badge-blue">TPI</span>
                  <span className="index-weight-tag">{calculationResult.indices.tpi.weight}</span>
                </div>
                <div className="index-main-stat">
                  <span className="stat-number">{calculationResult.indices.tpi.value}</span>
                  <span className="stat-unit">{calculationResult.indices.tpi.unit}</span>
                </div>
                <h4 className="index-full-name">{calculationResult.indices.tpi.name}</h4>
                <p className="index-stat-desc">{calculationResult.indices.tpi.desc}</p>
                <div className="card-stat-footer">
                  <span>Total: <strong>{calculationResult.indices.tpi.total} min</strong></span>
                  <span>Avg: <strong>{(calculationResult.indices.tpi.value / 60).toFixed(1)} hrs/day</strong></span>
                </div>
              </div>

              {/* AAI */}
              <div className="index-stat-card">
                <div className="card-stat-header">
                  <span className="index-code-badge badge-purple">AAI</span>
                  <span className="index-weight-tag">{calculationResult.indices.aai.weight}</span>
                </div>
                <div className="index-main-stat">
                  <span className="stat-number">{calculationResult.indices.aai.value}</span>
                  <span className="stat-unit">{calculationResult.indices.aai.unit}</span>
                </div>
                <h4 className="index-full-name">{calculationResult.indices.aai.name}</h4>
                <p className="index-stat-desc">{calculationResult.indices.aai.desc}</p>
                <div className="card-stat-footer">
                  <span>Study: <strong>{calculationResult.indices.aai.totalStudy}m</strong></span>
                  <span>Class: <strong>{calculationResult.indices.aai.totalClass}m</strong></span>
                </div>
              </div>

              {/* PhAI */}
              <div className="index-stat-card">
                <div className="card-stat-header">
                  <span className="index-code-badge badge-green">PhAI</span>
                  <span className="index-weight-tag">{calculationResult.indices.phai.weight}</span>
                </div>
                <div className="index-main-stat">
                  <span className="stat-number">{calculationResult.indices.phai.value}</span>
                  <span className="stat-unit">{calculationResult.indices.phai.unit}</span>
                </div>
                <h4 className="index-full-name">{calculationResult.indices.phai.name}</h4>
                <p className="index-stat-desc">{calculationResult.indices.phai.desc}</p>
                <div className="card-stat-footer">
                  <span>Total Fitness: <strong>{calculationResult.indices.phai.total} min</strong></span>
                  <span>Compliance: <strong>&ge; 30m target</strong></span>
                </div>
              </div>

              {/* SRI */}
              <div className="index-stat-card">
                <div className="card-stat-header">
                  <span className="index-code-badge badge-indigo">SRI</span>
                  <span className="index-weight-tag">{calculationResult.indices.sri.weight}</span>
                </div>
                <div className="index-main-stat">
                  <span className="stat-number">{calculationResult.indices.sri.value}</span>
                  <span className="stat-unit">{calculationResult.indices.sri.unit}</span>
                </div>
                <h4 className="index-full-name">{calculationResult.indices.sri.name}</h4>
                <p className="index-stat-desc">{calculationResult.indices.sri.desc}</p>
                <div className="card-stat-footer">
                  <span>Daily Avg: <strong>{calculationResult.indices.sri.hoursPerDay} hrs</strong></span>
                  <span>Total Sleep: <strong>{calculationResult.indices.sri.total}m</strong></span>
                </div>
              </div>

              {/* ABI */}
              <div className="index-stat-card">
                <div className="card-stat-header">
                  <span className="index-code-badge badge-amber">ABI</span>
                  <span className="index-weight-tag">{calculationResult.indices.abi.weight}</span>
                </div>
                <div className="index-main-stat">
                  <span className="stat-number">{calculationResult.indices.abi.value}</span>
                  <span className="stat-unit">{calculationResult.indices.abi.unit}</span>
                </div>
                <h4 className="index-full-name">{calculationResult.indices.abi.name}</h4>
                <p className="index-stat-desc">{calculationResult.indices.abi.desc}</p>
                <div className="card-stat-footer">
                  <span>Total Downtime: <strong>{calculationResult.indices.abi.total} min</strong></span>
                  <span>Avg: <strong>{(calculationResult.indices.abi.value / 60).toFixed(1)} hrs/day</strong></span>
                </div>
              </div>

              {/* TUI */}
              <div className="index-stat-card">
                <div className="card-stat-header">
                  <span className="index-code-badge badge-teal">TUI</span>
                  <span className="index-weight-tag">{calculationResult.indices.tui.weight}</span>
                </div>
                <div className="index-main-stat">
                  <span className="stat-number">{calculationResult.indices.tui.value}</span>
                  <span className="stat-unit">{calculationResult.indices.tui.unit}</span>
                </div>
                <h4 className="index-full-name">{calculationResult.indices.tui.name}</h4>
                <p className="index-stat-desc">{calculationResult.indices.tui.desc}</p>
                <div className="card-stat-footer">
                  <span>Tracked/day: <strong>{calculationResult.indices.tui.hoursPerDay} hrs</strong></span>
                  <span>Total: <strong>{calculationResult.indices.tui.total} min</strong></span>
                </div>
              </div>

              {/* EI */}
              <div className="index-stat-card">
                <div className="card-stat-header">
                  <span className="index-code-badge badge-rose">EI</span>
                  <span className="index-weight-tag">{calculationResult.indices.ei.weight}</span>
                </div>
                <div className="index-main-stat">
                  <span className="stat-number">{calculationResult.indices.ei.value}</span>
                  <span className="stat-unit">{calculationResult.indices.ei.unit}</span>
                </div>
                <h4 className="index-full-name">{calculationResult.indices.ei.name}</h4>
                <p className="index-stat-desc">{calculationResult.indices.ei.desc}</p>
                <div className="card-stat-footer">
                  <span>Sentiment Sum: <strong>{calculationResult.indices.ei.rawScoreSum}</strong></span>
                  <span>Max: <strong>{calculationResult.indices.ei.maxPossible}</strong></span>
                </div>
              </div>

              {/* DCI */}
              <div className="index-stat-card">
                <div className="card-stat-header">
                  <span className="index-code-badge badge-slate">DCI</span>
                  <span className="index-weight-tag">{calculationResult.indices.dci.weight}</span>
                </div>
                <div className="index-main-stat">
                  <span className="stat-number">{calculationResult.indices.dci.value}</span>
                  <span className="stat-unit">{calculationResult.indices.dci.unit}</span>
                </div>
                <h4 className="index-full-name">{calculationResult.indices.dci.name}</h4>
                <p className="index-stat-desc">{calculationResult.indices.dci.desc}</p>
                <div className="card-stat-footer">
                  <span>Valid: <strong>{calculationResult.indices.dci.validDays} / {calculationResult.indices.dci.expectedDays}</strong></span>
                  <span>Integrity: <strong>{calculationResult.indices.dci.value >= 90 ? 'High' : 'Needs Review'}</strong></span>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Relationship Analysis (10 Marks in Rubric) */}
          {activeTab === 'relationships' && (
            <div className="relationships-section">
              <div className="relationship-intro-box">
                <h4 className="rel-title">Evaluation Component #5: Relationship Analysis (10 Marks Rubric)</h4>
                <p className="rel-subtitle">
                  Empirical cross-tabulation of behavioral patterns across sleep, study, coding, and psychological indicators.
                </p>
              </div>

              <div className="rel-cards-grid">
                
                {/* 1. Sleep vs Energy Level */}
                <div className="rel-analysis-card">
                  <div className="rel-card-top">
                    <Moon size={18} className="rel-icon text-indigo" />
                    <h5 className="rel-card-title">1. Sleep Duration vs. Energy Level</h5>
                  </div>
                  <p className="rel-card-desc">
                    Evaluates how nightly restorative sleep translates to daytime subjective energy rating (1 to 3 scale).
                  </p>
                  <table className="rel-table">
                    <thead>
                      <tr>
                        <th>Sleep Band</th>
                        <th>Days Logged</th>
                        <th>Avg Energy (1-3)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationResult.relationships.sleepVsEnergy?.map((item, idx) => (
                        <tr key={idx}>
                          <td><strong>{item.band}</strong></td>
                          <td>{item.days} days</td>
                          <td>
                            <span className="score-pill">{item.avgEnergyScore} / 3.0</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 2. Study vs Satisfaction */}
                <div className="rel-analysis-card">
                  <div className="rel-card-top">
                    <BookOpen size={18} className="rel-icon text-purple" />
                    <h5 className="rel-card-title">2. Study Hours vs. Satisfaction</h5>
                  </div>
                  <p className="rel-card-desc">
                    Correlation between self-study investment and subjective end-of-day satisfaction (1 to 5 scale).
                  </p>
                  <table className="rel-table">
                    <thead>
                      <tr>
                        <th>Study Band</th>
                        <th>Days Logged</th>
                        <th>Avg Satisfaction (1-5)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationResult.relationships.studyVsSatisfaction?.map((item, idx) => (
                        <tr key={idx}>
                          <td><strong>{item.band}</strong></td>
                          <td>{item.days} days</td>
                          <td>
                            <span className="score-pill">{item.avgSatisfaction} / 5.0</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 3. Coding vs Energy */}
                <div className="rel-analysis-card">
                  <div className="rel-card-top">
                    <Activity size={18} className="rel-icon text-blue" />
                    <h5 className="rel-card-title">3. Coding Intensity vs. Energy</h5>
                  </div>
                  <p className="rel-card-desc">
                    Investigates whether sustained coding sessions induce fatigue or correlate with high engagement states.
                  </p>
                  <table className="rel-table">
                    <thead>
                      <tr>
                        <th>Coding Band</th>
                        <th>Days Logged</th>
                        <th>Avg Energy (1-3)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {calculationResult.relationships.codingVsEnergy?.map((item, idx) => (
                        <tr key={idx}>
                          <td><strong>{item.band}</strong></td>
                          <td>{item.days} days</td>
                          <td>
                            <span className="score-pill">{item.avgEnergyScore} / 3.0</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: 40-Day Row Inspector */}
          {activeTab === 'data-inspector' && (
            <div className="data-inspector-section">
              <div className="inspector-header-row">
                <div>
                  <h4 className="inspector-title">Daily Activity Log Inspection (Rows 7 to 46)</h4>
                  <p className="inspector-sub">
                    Direct validation of each row parsed from Excel worksheet. Row is counted as valid if <code>Total Tracked &gt; 0</code>.
                  </p>
                </div>
                <div className="inspector-stats-badges">
                  <span className="badge-stat pass">{calculationResult.audit.validDays} Valid Days</span>
                  <span className="badge-stat warn">{calculationResult.audit.missingOrInvalidDays} Nil/Missing Days</span>
                </div>
              </div>

              <div className="table-responsive-box">
                <table className="inspector-table">
                  <thead>
                    <tr>
                      <th>Excel Row</th>
                      <th>Status</th>
                      <th>Coding</th>
                      <th>Study</th>
                      <th>Class</th>
                      <th>Fitness</th>
                      <th>Sleep</th>
                      <th>Free Time</th>
                      <th>Total Tracked</th>
                      <th>Feeling</th>
                      <th>Satisfaction</th>
                      <th>Energy</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculationResult.inspectedRows.map((row) => (
                      <tr key={row.excelRowNumber} className={row.isValid ? 'row-valid' : 'row-invalid'}>
                        <td><strong>Row {row.excelRowNumber}</strong></td>
                        <td>
                          {row.isValid ? (
                            <span className="row-tag-valid">Valid</span>
                          ) : (
                            <span className="row-tag-nil">Nil / Zero</span>
                          )}
                        </td>
                        <td>{row.coding}m</td>
                        <td>{row.study}m</td>
                        <td>{row.class}m</td>
                        <td>{row.fitness}m</td>
                        <td>{row.sleep}m</td>
                        <td>{row.freeUnaccounted}m</td>
                        <td><strong>{row.totalTracked}m</strong></td>
                        <td>{row.feeling || '—'}</td>
                        <td>{row.satisfaction || '—'}</td>
                        <td>{row.energy || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: Python Output */}
          {activeTab === 'python-output' && (
            <div className="python-output-section">
              <div className="terminal-header">
                <span className="terminal-dot red"></span>
                <span className="terminal-dot yellow"></span>
                <span className="terminal-dot green"></span>
                <span className="terminal-title">Python openpyxl Execution Stream (project.py)</span>
              </div>
              <pre className="terminal-body">
{`[Audit] Expected Days in Range: ${calculationResult.audit.expectedDays}
[Audit] Actual Valid Days with Data: ${calculationResult.audit.validDays}
[Audit] Missing or Invalid (Nil/Zero) Days: ${calculationResult.audit.missingOrInvalidDays}

--- Executing Sub-Calculations ---
[TPI] Tech Productivity Index: Total Coding = ${calculationResult.indices.tpi.total} mins | Daily Avg = ${calculationResult.indices.tpi.value} mins/day
[AAI] Academic Activity Index: Total Study = ${calculationResult.indices.aai.totalStudy} mins, Total Class = ${calculationResult.indices.aai.totalClass} mins | Daily Avg = ${calculationResult.indices.aai.value} mins/day
[PhAI] Physical Health Activity Index: Total Fitness = ${calculationResult.indices.phai.total} mins | Daily Avg = ${calculationResult.indices.phai.value} mins/day
[SRI] Sleep Regularity Index: Total Sleep = ${calculationResult.indices.sri.total} mins | Daily Avg = ${calculationResult.indices.sri.value} mins/day
[ABI] Active Balance Index: Total Free/Unaccounted = ${calculationResult.indices.abi.total} mins | Daily Avg = ${calculationResult.indices.abi.value} mins/day
[TUI] Time Utility Index: Total Tracked Time = ${calculationResult.indices.tui.total} mins | Daily Avg = ${calculationResult.indices.tui.value} mins/day
[EI] Emotional Index: Raw Sentiment Score Sum = ${calculationResult.indices.ei.rawScoreSum} / Max Possible (${calculationResult.indices.ei.maxPossible}) | Average Score = ${calculationResult.indices.ei.value}
[The Data Continuity Index is: ${calculationResult.audit.validDays}/${calculationResult.audit.expectedDays} valid days (${calculationResult.indices.dci.value}%)
----------------------------------

>>> Output Dictionary:
${JSON.stringify({
  "Personal Activity Index: ": calculationResult.pai,
  "breakdown": {
    "Tech Productivity Index is: ": calculationResult.indices.tpi.value,
    "Academic Activity Index: ": calculationResult.indices.aai.value,
    "Physical Activity Index: ": calculationResult.indices.phai.value,
    "Sleep and Recovery Index: ": calculationResult.indices.sri.value,
    "Time Utilisation Index: ": calculationResult.indices.tui.value,
    "Experience Index: ": calculationResult.indices.ei.value,
    "Active Balance Index: ": calculationResult.indices.abi.value,
    "Data Continuity Index": calculationResult.indices.dci.value
  }
}, null, 2)}`}
              </pre>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
