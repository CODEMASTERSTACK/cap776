import React, { useState } from 'react';
import { HelpCircle, Calculator, ChevronDown, ChevronUp } from 'lucide-react';

export default function ParameterCard({ param, isFeatured = false }) {
  const [showDemoCalc, setShowDemoCalc] = useState(false);
  const [calcInput1, setCalcInput1] = useState('');
  const [calcInput2, setCalcInput2] = useState('');

  // Sample calculation logic based on parameter
  const calculateResult = () => {
    const val1 = parseFloat(calcInput1);
    const val2 = parseFloat(calcInput2);
    if (isNaN(val1) || isNaN(val2) || val2 <= 0) return null;

    if (param.id === 'ei') {
      return (val1 / (3 * val2)).toFixed(2) + ' / 5.0';
    } else if (param.id === 'dci') {
      return ((val1 / val2) * 100).toFixed(1) + '%';
    } else {
      return (val1 / val2).toFixed(1) + ' min/day';
    }
  };

  const calcResult = calculateResult();

  return (
    <div className={`param-card ${isFeatured ? 'featured-param' : ''}`}>
      {/* Header Row */}
      <div className="param-header">
        <div className="param-title-group">
          <span className="param-code-badge">{param.code}</span>
          <div>
            <h3 className="param-name">{param.name}</h3>
            <span className="param-unit-text">Unit: {param.unit}</span>
          </div>
        </div>

        <div className="param-badge-group">
          {param.weightInPAI && (
            <span className="weight-badge">PAI Weight: {param.weightInPAI}</span>
          )}
        </div>
      </div>

      {/* Primary Mathematical Formula Box */}
      <div className="param-math-box">
        <div className="math-expression">
          <span className="math-lhs">{param.code} =</span>
          
          {param.id === 'pai' ? (
            <div className="composite-formula-text">
              <span className="weight-term"><strong className="weight-num">0.15</strong> · TPI<sub>s</sub></span> + 
              <span className="weight-term"><strong className="weight-num">0.20</strong> · AAI<sub>s</sub></span> + 
              <span className="weight-term"><strong className="weight-num">0.15</strong> · PhAI<sub>s</sub></span> + 
              <span className="weight-term"><strong className="weight-num">0.20</strong> · SRI<sub>s</sub></span> + 
              <span className="weight-term"><strong className="weight-num">0.15</strong> · TUI<sub>s</sub></span> + 
              <span className="weight-term"><strong className="weight-num">0.10</strong> · EI<sub>s</sub></span> + 
              <span className="weight-term"><strong className="weight-num">0.05</strong> · DCI</span>
            </div>
          ) : (
            <div className="math-fraction">
              <div className="fraction-numerator">{param.numerator}</div>
              <div className="fraction-divider"></div>
              <div className="fraction-denominator">{param.denominator}</div>
            </div>
          )}
          
          {param.id !== 'pai' && (
            <span className="math-unit-label">[{param.unit}]</span>
          )}
        </div>
      </div>

      {/* Guiding Question */}
      <div className="param-question-box">
        <HelpCircle size={15} className="question-icon" />
        <span className="question-text">"{param.question}"</span>
      </div>

      {/* Description & Inputs */}
      <p className="param-desc">{param.description}</p>

      {/* PAI Weights breakdown table if PAI */}
      {param.weightsBreakdown && (
        <div className="weights-table-wrap">
          <h4 className="weights-title">Weight Distribution in PAI Composite Score:</h4>
          <div className="weights-grid">
            {param.weightsBreakdown.map((wb, idx) => (
              <div key={idx} className="weight-item">
                <span className="wb-param">{wb.parameter}</span>
                <span className="wb-val">{wb.weight}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Calculator Accordion */}
      {param.id !== 'pai' && (
        <div className="param-calc-accordion">
          <button 
            className="calc-toggle-btn" 
            onClick={() => setShowDemoCalc(!showDemoCalc)}
          >
            <Calculator size={14} />
            <span>{showDemoCalc ? "Hide Formula Test" : "Test Formula with Sample Data"}</span>
            {showDemoCalc ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showDemoCalc && (
            <div className="calc-panel">
              <div className="calc-inputs-row">
                <div className="calc-field">
                  <label>{param.numerator}:</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 3600" 
                    value={calcInput1} 
                    onChange={(e) => setCalcInput1(e.target.value)} 
                  />
                </div>
                <div className="calc-field">
                  <label>{param.denominator}:</label>
                  <input 
                    type="number" 
                    placeholder="e.g. 15" 
                    value={calcInput2} 
                    onChange={(e) => setCalcInput2(e.target.value)} 
                  />
                </div>
              </div>

              {calcResult && (
                <div className="calc-result-row">
                  <span className="res-label">Calculated {param.code}:</span>
                  <span className="res-value">{calcResult}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
