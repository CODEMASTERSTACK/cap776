import React from 'react';
import { Calendar, Sparkles, Check, RotateCcw } from 'lucide-react';

const COMMON_PRESETS = [
  { label: '13 Aug', date: '2026-08-13', isDefault: true },
  { label: '15 Aug', date: '2026-08-15' },
  { label: '16 Aug', date: '2026-08-16' },
  { label: '17 Aug', date: '2026-08-17' },
  { label: '18 Aug', date: '2026-08-18' },
  { label: '20 Aug', date: '2026-08-20' },
  { label: '1 Sep', date: '2026-09-01' }
];

export default function StartDateSelector({
  startDate,
  onChangeStartDate,
  detectedDate,
  trackingWindow
}) {
  const isDefault = startDate === '2026-08-13';

  // Format detected date for badge label
  const getDetectedLabel = (val) => {
    if (!val) return '';
    if (typeof val === 'object') {
      return String(val.shortLabel || val.label || val.dateStr || '');
    }
    const str = String(val);
    try {
      const parts = str.split('-').map(Number);
      const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      if (parts.length === 3 && parts[1] && parts[2]) {
        return `${parts[2]} ${monthNames[parts[1]] || ''}`;
      }
      return str;
    } catch {
      return str;
    }
  };

  const detectedDateStr = typeof detectedDate === 'object' ? (detectedDate?.dateStr || '') : String(detectedDate || '');
  const detectedLabel = getDetectedLabel(detectedDate);
  const showDetectBadge = Boolean(detectedDateStr && detectedDateStr !== startDate && detectedLabel);

  return (
    <div className="compact-start-date-bar" role="region" aria-label="Start Date Configuration">
      {/* Primary Selector Group: Icon + Label + Native Date Input */}
      <div className="compact-date-main-group">
        <div className="compact-date-label-wrap">
          <Calendar size={13} className="compact-date-icon" />
          <span className="compact-date-title">Start Date:</span>
        </div>

        <input
          type="date"
          className="compact-date-native-input"
          value={startDate}
          onChange={(e) => e.target.value && onChangeStartDate(e.target.value)}
          min="2026-08-01"
          max="2026-09-20"
          title="Choose your student log start date (Deadline is 21 Sep 2026)"
          aria-label="Start date"
        />

        {!isDefault && (
          <button
            type="button"
            className="compact-reset-btn"
            onClick={() => onChangeStartDate('2026-08-13')}
            title="Reset to official rubric default (13 Aug 2026)"
          >
            <RotateCcw size={11} />
            <span>Default</span>
          </button>
        )}
      </div>

      <div className="compact-date-divider" aria-hidden="true" />

      {/* Quick Preset Pills */}
      <div className="compact-preset-pills">
        <span className="compact-pills-label">Quick:</span>
        {COMMON_PRESETS.map((p) => {
          const isSelected = startDate === p.date;
          return (
            <button
              key={p.date}
              type="button"
              className={`compact-pill-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onChangeStartDate(p.date)}
              title={`Set start date to ${p.label} 2026`}
            >
              <span>{p.label}</span>
              {isSelected && <Check size={11} className="compact-pill-check" />}
            </button>
          );
        })}
      </div>

      {/* Auto-detected from sheet alert pill */}
      {showDetectBadge && (
        <button
          type="button"
          className="compact-detected-chip"
          onClick={() => onChangeStartDate(detectedDateStr)}
          title={`Click to align start date with ${detectedLabel} found in your uploaded sheet`}
        >
          <Sparkles size={12} className="detected-sparkle-icon" />
          <span>Sheet begins <strong>{String(detectedLabel)}</strong> • Apply</span>
        </button>
      )}

      <div className="compact-date-divider desktop-only" aria-hidden="true" />

      {/* Computed Window Badge */}
      <div className="compact-window-badge">
        <span className="window-range-text">
          {trackingWindow?.startDateLabel ? `${trackingWindow.startDateLabel.replace(' 2026', '')} – 21 Sep 2026` : '13 Aug – 21 Sep 2026'}
        </span>
        <span className="window-mode-tag">
          {trackingWindow?.expectedDays || 40} Days Expected
        </span>
      </div>
    </div>
  );
}
