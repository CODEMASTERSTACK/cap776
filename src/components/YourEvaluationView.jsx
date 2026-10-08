import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { extractSheetMetadata } from '../utils/sheetMetadata';
import { 
  FileSpreadsheet, 
  FileText, 
  FileCode, 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  RefreshCw, 
  ShieldCheck, 
  Info,
  Server,
  ArrowRight
} from 'lucide-react';

// Helper to parse client-side metadata from workbook
const parseClientXlsxMetadata = (file) => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const buffer = evt.target?.result;
          const wb = XLSX.read(buffer, { type: 'array' });
          const sheetName = wb.SheetNames.includes('Daily Log') ? 'Daily Log' : wb.SheetNames[0];
          const ws = wb.Sheets[sheetName];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
          
          const meta = extractSheetMetadata(rows);

          // Direct cell fallbacks (CAP776 prescribed workbook format: B2=Name, F2=Reg, B3=Section)
          const b2 = String(rows[1]?.[1] || '').trim();
          const f2 = String(rows[1]?.[5] || '').trim();
          const b3 = String(rows[2]?.[1] || '').trim();

          if (!meta.name && b2 && !b2.toLowerCase().includes('name')) {
            meta.name = b2;
          }
          if (!meta.regNo && f2 && !f2.toLowerCase().includes('reg')) {
            meta.regNo = f2;
          }
          if (!meta.section && b3 && !b3.toLowerCase().includes('course') && !b3.toLowerCase().includes('sec')) {
            meta.section = b3;
          }

          // Fallback if regNo not in sheet cells: parse from filename (e.g. 12618117.xlsx)
          if (!meta.regNo && file.name) {
            const m = file.name.match(/(\d{5,})/);
            if (m) meta.regNo = m[1];
          }

          resolve(meta);
        } catch (err) {
          console.warn('[Telemetry] Error reading sheet cells client-side:', err);
          const m = file.name?.match(/(\d{5,})/);
          resolve({
            name: '',
            regNo: m ? m[1] : '',
            section: ''
          });
        }
      };
      reader.onerror = () => resolve(null);
      reader.readAsArrayBuffer(file);
    } catch {
      resolve(null);
    }
  });
};

export default function YourEvaluationView({ onBackToWelcome, onOpenEvaluationCriteria }) {
  const [xlsxFile, setXlsxFile] = useState(null);
  const [reportFile, setReportFile] = useState(null);
  const [codeFile, setCodeFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const xlsxInputRef = useRef(null);
  const reportInputRef = useRef(null);
  const codeInputRef = useRef(null);

  const extractedMetaRef = useRef(null);
  const lastDispatchedKeyRef = useRef('');

  // Dispatches student metadata to the Google Sheet via Netlify serverless function
  const sendTelemetry = (meta) => {
    if (!meta) return;
    const name = meta.name?.trim() || '';
    const regNo = meta.regNo?.trim() || '';
    const section = meta.section?.trim() || '';
    const fileName = meta.fileName || 'Evaluation Submission';

    if (!name && !regNo) return;

    // Avoid duplicate requests for identical student + filename within same session
    const dispatchKey = `${name}|${regNo}|${fileName}`;
    if (lastDispatchedKeyRef.current === dispatchKey) {
      return;
    }
    lastDispatchedKeyRef.current = dispatchKey;

    console.log('[Telemetry] Forwarding evaluation details to sheet:', { name, regNo, section, fileName });

    fetch('/.netlify/functions/telemetry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name || 'Unknown',
        regNo: regNo || 'N/A',
        section: section || 'N/A',
        fileName: fileName,
        timestamp: new Date().toLocaleString()
      })
    }).catch((err) => {
      console.warn('[Telemetry] Dispatch error (ignored):', err);
    });
  };

  const handleFileChange = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'xlsx') {
      setXlsxFile(file);
      const meta = await parseClientXlsxMetadata(file);
      if (meta) {
        extractedMetaRef.current = meta;
        if (reportFile) {
          sendTelemetry({
            ...meta,
            fileName: `${file.name} + ${reportFile.name}`
          });
        }
      }
    }
    if (type === 'report') {
      setReportFile(file);
      // Fallback: if regNo was not in xlsx cells, check docx filename too
      const currentMeta = extractedMetaRef.current || {};
      if (!currentMeta.regNo && file.name) {
        const m = file.name.match(/(\d{5,})/);
        if (m) currentMeta.regNo = m[1];
        extractedMetaRef.current = currentMeta;
      }
      if (xlsxFile && (currentMeta.name || currentMeta.regNo)) {
        sendTelemetry({
          ...currentMeta,
          fileName: `${xlsxFile.name} + ${file.name}`
        });
      }
    }
    if (type === 'code') setCodeFile(file);
    setError(null);
  };

  const handleEvaluate = async () => {
    if (!xlsxFile || !reportFile) {
      setError('Please select both the Excel Workbook (.xlsx) and the Word Report (.docx).');
      return;
    }

    setLoading(true);
    setError(null);

    // If both files are chosen and metadata was extracted, ensure telemetry is dispatched
    if (extractedMetaRef.current && (extractedMetaRef.current.name || extractedMetaRef.current.regNo)) {
      sendTelemetry({
        ...extractedMetaRef.current,
        fileName: `${xlsxFile.name} + ${reportFile.name}`
      });
    }

    const formData = new FormData();
    formData.append('xlsx', xlsxFile);
    formData.append('report', reportFile);
    if (codeFile) {
      formData.append('code', codeFile);
    }

    try {
      const rawApiBase = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
      const candidateUrls = [];

      if (rawApiBase) {
        if (rawApiBase.endsWith('/api')) {
          candidateUrls.push(`${rawApiBase}/evaluate`);
        } else {
          candidateUrls.push(`${rawApiBase}/api/evaluate`);
          candidateUrls.push(`${rawApiBase}/evaluate`);
        }
      } else {
        candidateUrls.push('/api/evaluate');
        candidateUrls.push('/evaluate');
      }
      candidateUrls.push('http://localhost:8000/api/evaluate');
      candidateUrls.push('http://localhost:8000/evaluate');

      let response;
      let lastErr;

      for (const url of candidateUrls) {
        try {
          const res = await fetch(url, {
            method: 'POST',
            body: formData,
          });
          // If Netlify SPA redirects return index.html instead of JSON API response
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('text/html')) {
            continue;
          }
          // If endpoint is 404, try next candidate URL
          if (res.status === 404) {
            continue;
          }
          response = res;
          break;
        } catch (err) {
          lastErr = err;
        }
      }

      if (!response) {
        throw new Error(lastErr?.message || 'Failed to reach evaluation API service.');
      }

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        throw new Error(
          'The Python Evaluation backend is not connected to this online deployment yet. ' +
          'To enable it on https://cap776.netlify.app, deploy CAP776/api.py (e.g. on Render) and set VITE_API_URL in Netlify settings.'
        );
      }

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error(`Server returned HTTP ${response.status} with unparseable response.`);
      }

      if (!response.ok || !data.success) {
        let msg = data?.error;
        if (!msg && data?.detail) {
          if (typeof data.detail === 'string') {
            msg = data.detail;
          } else if (Array.isArray(data.detail)) {
            msg = data.detail.map((d) => d.msg || JSON.stringify(d)).join('; ');
          }
        }
        throw new Error(msg || (response.status === 404 ? 'Evaluation API endpoint not found (404).' : 'Evaluation failed. Please check file formatting.'));
      }

      setResult(data);

      // Forward verified student evaluation details to the Google Sheet
      const resolvedName = (data.student && data.student !== 'Not supplied') ? data.student : extractedMetaRef.current?.name;
      const resolvedReg = (data.reg && data.reg !== 'Not supplied') ? data.reg : extractedMetaRef.current?.regNo;
      const resolvedSec = data.section || extractedMetaRef.current?.section;

      sendTelemetry({
        name: resolvedName,
        regNo: resolvedReg,
        section: resolvedSec,
        fileName: `${xlsxFile?.name || ''} + ${reportFile?.name || ''}`
      });
    } catch (err) {
      console.error('Evaluation error:', err);
      if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        setError(
          'Cannot connect to the evaluation server. ' +
          'If running locally, start: "python CAP776/api.py". ' +
          'If online on Netlify, connect a hosted Python backend URL (e.g. on Render).'
        );
      } else {
        setError(err.message || 'An unexpected error occurred during evaluation.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!result?.pdf_base64) return;
    try {
      const byteCharacters = atob(result.pdf_base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.pdf_filename || `${result.reg || 'CAP776'}_Evaluation.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF download error:', err);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
    setXlsxFile(null);
    setReportFile(null);
    setCodeFile(null);
    extractedMetaRef.current = null;
    lastDispatchedKeyRef.current = '';
    if (xlsxInputRef.current) xlsxInputRef.current.value = '';
    if (reportInputRef.current) reportInputRef.current.value = '';
    if (codeInputRef.current) codeInputRef.current.value = '';
  };

  return (
    <div className="your-eval-page">
      <div className="your-eval-container">
        
        {/* Editorial Header */}
        <header className="your-eval-header">
          <h1 className="your-eval-title">YOUR EVALUATION</h1>
          <p className="your-eval-subtext">Inspired by the Original Evaluation</p> <p style={{color:'red', fontSize: '1rem'}}>(Issue here == Will face issue in faculty evaluation)</p>
          <p className="your-eval-description" style={{fontSize: '1rem', color: 'black'}}>
          
            Test your project files against the faculty's independent recalculation engine before final submission.
          </p>
        
          <div className="your-eval-date-notice">
            <Info size={15} />
            <span>Official Evaluation Period: <strong>17 Aug 2026 – 21 Sep 2026</strong> (36 Days). Data outside this range is filtered out.</span>
          </div>
        </header>

        {/* Upload Form or Results View */}
        {!result ? (
          <div className="your-eval-card upload-section">
            <div className="upload-grid">
              
              {/* 1. XLSX Upload */}
              <div className={`dropzone-card ${xlsxFile ? 'active' : ''}`} onClick={() => xlsxInputRef.current?.click()}>
                <input 
                  type="file" 
                  ref={xlsxInputRef} 
                  accept=".xlsx" 
                  onChange={(e) => handleFileChange(e, 'xlsx')} 
                  style={{ display: 'none' }} 
                />
                <div className="dropzone-icon">
                  <FileSpreadsheet size={32} />
                </div>
                <div className="dropzone-meta">
                  <span className="dropzone-tag required">MANDATORY</span>
                  <h3>1. Student Workbook (.xlsx)</h3>
                  <p>Prescribed daily activity workbook with "Daily Log" sheet.</p>
                  {xlsxFile ? (
                    <div className="file-pill">
                      <CheckCircle2 size={14} />
                      <span className="file-name">{xlsxFile.name}</span>
                      <span className="file-size">({(xlsxFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ) : (
                    <span className="select-prompt">Click to select .xlsx file</span>
                  )}
                </div>
              </div>

              {/* 2. DOCX Report Upload */}
              <div className={`dropzone-card ${reportFile ? 'active' : ''}`} onClick={() => reportInputRef.current?.click()}>
                <input 
                  type="file" 
                  ref={reportInputRef} 
                  accept=".docx" 
                  onChange={(e) => handleFileChange(e, 'report')} 
                  style={{ display: 'none' }} 
                />
                <div className="dropzone-icon">
                  <FileText size={32} />
                </div>
                <div className="dropzone-meta">
                  <span className="dropzone-tag required">MANDATORY</span>
                  <h3>2. Submitted Report (.docx)</h3>
                  <p>Word report containing your reported index tables and findings.</p>
                  {reportFile ? (
                    <div className="file-pill">
                      <CheckCircle2 size={14} />
                      <span className="file-name">{reportFile.name}</span>
                      <span className="file-size">({(reportFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ) : (
                    <span className="select-prompt">Click to select .docx report</span>
                  )}
                </div>
              </div>

              {/* 3. Python Code Upload */}
              <div className={`dropzone-card ${codeFile ? 'active' : ''}`} onClick={() => codeInputRef.current?.click()}>
                <input 
                  type="file" 
                  ref={codeInputRef} 
                  accept=".py" 
                  onChange={(e) => handleFileChange(e, 'code')} 
                  style={{ display: 'none' }} 
                />
                <div className="dropzone-icon">
                  <FileCode size={32} />
                </div>
                <div className="dropzone-meta">
                  <span className="dropzone-tag optional">OPTIONAL</span>
                  <h3>3. Student Python Library (.py)</h3>
                  <p>Your modular Python code for AST inspection. (No NumPy/Pandas!)</p>
                  {codeFile ? (
                    <div className="file-pill">
                      <CheckCircle2 size={14} />
                      <span className="file-name">{codeFile.name}</span>
                      <span className="file-size">({(codeFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ) : (
                    <span className="select-prompt">Click to select optional .py file</span>
                  )}
                </div>
              </div>

            </div>

            {/* Error Notification */}
            {error && (
              <div className="your-eval-error-banner">
                <AlertTriangle size={18} />
                <div className="error-content">
                  <p><strong>Evaluation Error:</strong> {error}</p>
                  {error.includes('CAP776/api.py') && (
                    <div className="api-start-tip">
                      <code>cap776 \cap776 &amp;&amp; python api.py</code>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Rules Reminder */}
            <div className="eval-tips-strip">
              <div className="tip-item">
                <strong>Numerical Truth:</strong> All 9 indices are independently recalculated from your XLSX.
              </div>
              <div className="tip-item">
                <strong>DOCX Tolerance:</strong> EI matches within ±0.05; other indices match within ±0.5.
              </div>
              <div className="tip-item">
                <strong>Language Rule:</strong> Avoid causal words ("causes", "results in") to protect your score.
              </div>
            </div>

            {/* Submit Action */}
            <div className="eval-action-bar">
              <button 
                className="btn-evaluate-primary"
                onClick={handleEvaluate}
                disabled={loading || !xlsxFile || !reportFile}
              >
                {loading ? (
                  <>
                    <RefreshCw size={18} className="spin-icon" />
                    <span>Evaluating Submission In-Memory...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 RUN PRE-EVALUATION</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>

          </div>
        ) : (
          /* ==========================================================
             RESULTS VIEW
             ========================================================== */
          <div className="results-container">
            
            {/* Top Score Banner */}
            <div className="your-eval-card score-hero-card">
              <div className="student-meta-strip">
                <div className="meta-block">
                  <span className="label">STUDENT</span>
                  <span className="value">{result.student}</span>
                </div>
                <div className="meta-block">
                  <span className="label">REGISTRATION</span>
                  <span className="value">{result.reg}</span>
                </div>
                {result.section && (
                  <div className="meta-block">
                    <span className="label">SECTION</span>
                    <span className="value">{result.section}</span>
                  </div>
                )}
                <div className="meta-block right-aligned">
                  <button className="btn-secondary-reset" onClick={handleReset}>
                    <RefreshCw size={14} /> Re-evaluate Files
                  </button>
                </div>
              </div>

              {/* 4 Hero Metrics */}
              <div className="metrics-quad-grid">
                <div className="quad-metric-card primary">
                  <span className="metric-title">TOTAL MARKS</span>
                  <div className="metric-number-wrap">
                    <span className="metric-big">{result.raw_score}</span>
                    <span className="metric-denom">/100</span>
                  </div>
                  <span className="metric-sub">Raw Rubric Total</span>
                </div>

                <div className="quad-metric-card accent">
                  <span className="metric-title">SCALED SCORE</span>
                  <div className="metric-number-wrap">
                    <span className="metric-big">{result.scaled_score}</span>
                    <span className="metric-denom">/15</span>
                  </div>
                  <span className="metric-sub">15% Continuous Assessment</span>
                </div>

                <div className="quad-metric-card">
                  <span className="metric-title">VALID DAYS</span>
                  <div className="metric-number-wrap">
                    <span className="metric-big">{result.valid_days}</span>
                    <span className="metric-denom">days</span>
                  </div>
                  <span className="metric-sub">Within 17 Aug – 21 Sep</span>
                </div>

                <div className="quad-metric-card">
                  <span className="metric-title">DATA CONTINUITY (DCI)</span>
                  <div className="metric-number-wrap">
                    <span className="metric-big">{result.dci}</span>
                    <span className="metric-denom">%</span>
                  </div>
                  <span className="metric-sub">{result.dci >= 95 ? 'Target ≥95% achieved' : 'Needs attention'}</span>
                </div>
              </div>

              {/* Download Official Report Button */}
              <div className="pdf-download-bar">
                <button className="btn-download-pdf" onClick={handleDownloadPdf}>
                  <Download size={18} />
                  <span>Download Official Evaluation PDF</span>
                </button>
                <span className="pdf-note">ReportLab PDF matching teacher's official scorecard format</span>
              </div>
            </div>

            {/* 1. Parameter Truthfulness Table */}
            <div className="your-eval-card">
              <div className="card-header-row">
                <div>
                  <h3 className="section-title">1. Parameter Truthfulness</h3>
                  <p className="section-subtitle">Comparison between values extracted from your .docx report and recalculated from your .xlsx workbook.</p>
                </div>
              </div>

              <div className="table-responsive">
                <table className="eval-table">
                  <thead>
                    <tr>
                      <th>INDEX</th>
                      <th>REPORTED IN DOCX</th>
                      <th>RECALCULATED FROM XLSX</th>
                      <th>VERIFICATION STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.truth?.map((item) => (
                      <tr key={item.index}>
                        <td className="index-cell"><strong>{item.index}</strong></td>
                        <td className="num-cell">
                          {item.reported === null ? (
                            <span className="val-missing">Missing in tables</span>
                          ) : (
                            item.reported.toFixed(2)
                          )}
                        </td>
                        <td className="num-cell">
                          <strong>{item.recalculated.toFixed(2)}</strong>
                        </td>
                        <td>
                          {item.status === 'MATCH' && (
                            <span className="status-badge match">
                              <CheckCircle2 size={13} /> MATCH
                            </span>
                          )}
                          {item.status === 'MISMATCH' && (
                            <span className="status-badge mismatch">
                              <XCircle size={13} /> MISMATCH
                            </span>
                          )}
                          {item.status === 'MISSING' && (
                            <span className="status-badge missing">
                              <AlertTriangle size={13} /> NOT REPORTED
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Relationship Analysis & Rubric Breakdown */}
            <div className="two-col-grid">
              
              {/* Left: Rubric Breakdown */}
              <div className="your-eval-card">
                <h3 className="section-title">2. Rubric Breakdown</h3>
                <p className="section-subtitle">Marks earned across the 10 assessment criteria.</p>

                <div className="rubric-list">
                  {result.rubric?.map((r) => {
                    const pct = Math.round((r.score / r.maximum) * 100);
                    return (
                      <div key={r.component} className="rubric-row">
                        <div className="rubric-meta">
                          <span className="rubric-name">{r.component}</span>
                          <span className="rubric-score">
                            <strong>{r.score}</strong> / {r.maximum}
                          </span>
                        </div>
                        <div className="rubric-bar-track">
                          <div 
                            className={`rubric-bar-fill ${pct === 100 ? 'full' : pct >= 70 ? 'good' : 'warning'}`} 
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Relationships & Suggestions */}
              <div className="your-eval-card">
                <h3 className="section-title">3. Relationship Analysis</h3>
                <p className="section-subtitle">Pearson correlation coefficients calculated from your dataset.</p>

                <div className="relationships-box">
                  {Object.entries(result.relationships || {}).map(([key, val]) => (
                    <div key={key} className="rel-card">
                      <span className="rel-name">{key}</span>
                      <span className="rel-val">
                        {val === null ? 'Not calculable' : `r = ${val.toFixed(2)}`}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="divider-line" />

                <h3 className="section-title">4. Suggestions for Improvement</h3>
                <p className="section-subtitle">Actionable feedback from the agentic evaluation engine.</p>

                <ul className="suggestions-list">
                  {result.suggestions?.map((item, idx) => (
                    <li key={idx} className="suggestion-item">
                      <ArrowRight size={14} className="sugg-arrow" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {result.issues && result.issues.length > 0 && (
                  <div className="eval-notes-box">
                    <h4>Validation Notes:</h4>
                    <ul>
                      {result.issues.map((note, idx) => (
                        <li key={idx}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>

            {/* Bottom Floating Bar */}
            <div className="bottom-re-eval-bar">
              <button className="btn-secondary-reset large" onClick={handleReset}>
                <RefreshCw size={16} /> Evaluate Another Submission
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
