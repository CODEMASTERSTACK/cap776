import React from 'react';
import { Code, CheckCircle } from 'lucide-react';

export default function StudentFunctionsTable({ parameters }) {
  const functionPrototypes = [
    {
      name: "calculateTPI(codingMinutesArray, validDaysCount)",
      index: "TPI",
      unit: "minutes/day",
      description: "Computes total coding minutes divided by the number of valid days.",
      formula: "Σ Coding / Valid Days"
    },
    {
      name: "calculateAAI(academicMinutesArray, validDaysCount)",
      index: "AAI",
      unit: "minutes/day",
      description: "Aggregates (Study + Class) durations divided by valid days count.",
      formula: "Σ (Study + Class) / Valid Days"
    },
    {
      name: "calculatePhAI(fitnessMinutesArray, validDaysCount)",
      index: "PhAI",
      unit: "minutes/day",
      description: "Sums all physical fitness activity minutes divided by valid days.",
      formula: "Σ Fitness / Valid Days"
    },
    {
      name: "calculateSRI(sleepMinutesArray, validDaysCount)",
      index: "SRI",
      unit: "minutes/day",
      description: "Averages daily recorded sleep duration across valid days.",
      formula: "Σ Sleep / Valid Days"
    },
    {
      name: "calculateABI(unaccountedMinutesArray, validDaysCount)",
      index: "ABI",
      unit: "minutes/day",
      description: "Evaluates unrecorded / free time remaining in a 24-hour cycle.",
      formula: "Σ Free/Unaccounted Time / Valid Days"
    },
    {
      name: "calculateTUI(totalTrackedMinutesArray, validDaysCount)",
      index: "TUI",
      unit: "minutes/day",
      description: "Calculates average total tracked active time per day.",
      formula: "Σ Total Tracked Time / Valid Days"
    },
    {
      name: "calculateEI(feelingArr, satisfactionArr, energyArr, validDaysCount)",
      index: "EI",
      unit: "score 1.0 - 5.0",
      description: "Averages Feeling, Satisfaction, and Energy ratings (each on 1-5 scale) over 3 × Valid Days.",
      formula: "Σ (Feeling + Satisfaction + Energy) / (3 × Valid Days)"
    },
    {
      name: "calculateDCI(validRecordedDays, expectedDays = 40)",
      index: "DCI",
      unit: "percentage (%)",
      description: "Determines recording continuity between 13th Aug and 21st Sept 2026.",
      formula: "(Valid Recorded Days / Expected Days) × 100"
    },
    {
      name: "calculatePAI({ tpi_s, aai_s, phai_s, sri_s, tui_s, ei_s, dci })",
      index: "PAI",
      unit: "composite score",
      description: "Computes overall weighted composite score combining all 7 standardized indices.",
      formula: "0.15·TPI_s + 0.20·AAI_s + 0.15·PhAI_s + 0.20·SRI_s + 0.15·TUI_s + 0.10·EI_s + 0.05·DCI"
    }
  ];

  return (
    <div className="functions-spec-container">
      <div className="functions-table-header">
        <h3 className="clean-card-title">Required Programming Functions Specification</h3>
        <p className="clean-card-text">
          Students must implement the following 9 calculation functions conforming to the faculty rubric.
        </p>
      </div>

      <div className="functions-table-wrap">
        <table className="functions-table">
          <thead>
            <tr>
              <th>Index</th>
              <th>Function Signature</th>
              <th>Mathematical Equation</th>
              <th>Unit Output</th>
            </tr>
          </thead>
          <tbody>
            {functionPrototypes.map((fn, idx) => (
              <tr key={idx}>
                <td>
                  <span className="fn-index-badge">{fn.index}</span>
                </td>
                <td>
                  <code className="fn-sig-code">{fn.name}</code>
                  <p className="fn-desc-text">{fn.description}</p>
                </td>
                <td className="fn-math-td">{fn.formula}</td>
                <td className="fn-unit-td">{fn.unit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
