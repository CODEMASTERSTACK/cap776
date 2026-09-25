import React from 'react';
import { Check, CheckSquare, Square, RotateCcw } from 'lucide-react';

export default function Checklist({ items, checkedState, onToggleItem, onToggleAll }) {
  const completedCount = Object.values(checkedState).filter(Boolean).length;
  const totalCount = items.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const isAllCompleted = completedCount === totalCount;

  return (
    <div className="checklist-box">
      <div className="checklist-top-row">
        <div>
          <h3 className="checklist-title">Verification Checklist</h3>
          <p className="checklist-desc">
            Check each requirement as you review the project details.
          </p>
        </div>

        <button 
          className="btn-checklist-toggle"
          onClick={() => onToggleAll(!isAllCompleted)}
        >
          {isAllCompleted ? <RotateCcw size={13} /> : <CheckSquare size={13} />}
          <span>{isAllCompleted ? 'Reset All' : 'Select All'}</span>
        </button>
      </div>

      {/* Progress Status */}
      <div className="checklist-progress-bar-wrap">
        <div className="checklist-progress-labels">
          <span className="progress-status-text">
            {completedCount} of {totalCount} verified ({progressPercent}%)
          </span>
          {isAllCompleted && (
            <span className="progress-complete-badge">Complete</span>
          )}
        </div>
        <div className="checklist-progress-track">
          <div 
            className="checklist-progress-bar"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Items List */}
      <div className="checklist-rows">
        {items.map((item) => {
          const isChecked = !!checkedState[item.id];
          return (
            <div 
              key={item.id}
              className={`checklist-row ${isChecked ? 'is-checked' : ''}`}
              onClick={() => onToggleItem(item.id)}
              role="checkbox"
              aria-checked={isChecked}
              tabIndex={0}
            >
              <div className="checkbox-indicator">
                {isChecked ? (
                  <div className="checkbox-checked">
                    <Check size={13} />
                  </div>
                ) : (
                  <div className="checkbox-empty"></div>
                )}
              </div>
              <span className="checklist-label">{item.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
