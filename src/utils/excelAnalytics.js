/**
 * CAP776 Mini Project - Personal Activity Index (PAI) Calculation Engine
 * 
 * Direct mathematical implementation of project.py (openpyxl logic) in JavaScript.
 * Strictly adheres to Row 5 column headers and Rows 7-46 data tracking window.
 */

export const STRING_TO_VALUE = {
  Feeling: {
    Excellent: 5,
    Good: 4,
    Neutral: 3,
    Low: 2,
    Stressed: 1
  },
  Satisfaction: {
    Verysatisfied: 5,
    Satisfied: 4,
    Neutral: 3,
    Unsatisfied: 2,
    Veryunsatisfied: 1
  },
  Energy: {
    High: 3,
    Medium: 2,
    Low: 1
  }
};

export const REQUIRED_COLUMNS = [
  "coding",
  "study",
  "class",
  "fitness",
  "sleep",
  "free/unaccounted",
  "total tracked",
  "day's feeling",
  "satisfaction level",
  "energy level"
];

export const TRACKING_WINDOW = {
  startDate: "2026-08-13",
  endDate: "2026-09-21",
  expectedDays: 40 // (dt.datetime(2026, 9, 21) - dt.datetime(2026, 8, 13)).days + 1
};

/**
 * Clean and normalize column names exactly like project.py:
 * clean_name = str(cell.value).strip().lower().split('(')[0].strip()
 */
export function normalizeColumnHeader(header) {
  if (!header) return "";
  return String(header)
    .trim()
    .toLowerCase()
    .split("(")[0]
    .trim();
}

/**
 * Maps raw sentiment text to numerical scores
 */
export function mapSentiment(category, rawText) {
  if (!rawText) return 0;
  const str = String(rawText).trim();
  
  if (category === "Feeling") {
    const key = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    return STRING_TO_VALUE.Feeling[key] || 0;
  }
  
  if (category === "Satisfaction") {
    // project.py: raw_satisfaction.strip().title().replace(" ", "")
    const key = str
      .split(/\s+/)
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join("");
    return STRING_TO_VALUE.Satisfaction[key] || 0;
  }
  
  if (category === "Energy") {
    const key = str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    return STRING_TO_VALUE.Energy[key] || 0;
  }
  
  return 0;
}

/**
 * Calculate statistical standard deviation
 */
function calculateStdDev(values, mean) {
  if (!values || values.length <= 1) return 0;
  const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Execute full PAI calculation from raw parsed 2D sheet array (rows x cols)
 * Matches project.py line-by-line:
 * - ws[5] -> Row 5 (index 4 in 0-indexed array)
 * - Rows 7 to 6 + expectedDays -> 0-indexed rows 6 to 45
 */
export function computePAIFromSheetData(sheetRows) {
  if (!sheetRows || sheetRows.length < 5) {
    throw new Error("Invalid sheet format: Worksheet must contain at least 5 rows with headers in Row 5.");
  }

  // Row 5 in Excel corresponds to 0-indexed row 4
  const headerRow = sheetRows[4] || [];
  const columnMap = {}; // clean_name -> columnIndex

  headerRow.forEach((cellVal, colIdx) => {
    if (cellVal !== undefined && cellVal !== null && cellVal !== "") {
      const clean = normalizeColumnHeader(cellVal);
      if (clean) {
        columnMap[clean] = colIdx;
      }
    }
  });

  // Verify missing columns
  const missingCols = REQUIRED_COLUMNS.filter(col => !(col in columnMap));
  
  const expectedDays = TRACKING_WINDOW.expectedDays;
  const trackedColIdx = columnMap["total tracked"];

  // Rows 7 to 46 (0-indexed 6 to 45)
  const minRowIdx = 6;
  const maxRowIdx = 5 + expectedDays; // index 45 inclusive (40 rows)
  
  const inspectedRows = [];
  let validDays = 0;

  for (let r = minRowIdx; r <= maxRowIdx; r++) {
    const row = sheetRows[r] || [];
    let isRowValid = false;

    if (trackedColIdx !== undefined && trackedColIdx < row.length) {
      const val = row[trackedColIdx];
      const numVal = parseFloat(val);
      if (!isNaN(numVal) && numVal > 0) {
        validDays++;
        isRowValid = true;
      }
    }

    const explicitOther = parseFloat(row[columnMap["other activities"] || columnMap["other"] || columnMap["other activity"]]) || 0;
    const codingVal = parseFloat(row[columnMap["coding"]]) || 0;
    const studyVal = parseFloat(row[columnMap["study"]]) || 0;
    const classVal = parseFloat(row[columnMap["class"]]) || 0;
    const fitnessVal = parseFloat(row[columnMap["fitness"]]) || 0;
    const sleepVal = parseFloat(row[columnMap["sleep"]]) || 0;
    const freeVal = parseFloat(row[columnMap["free/unaccounted"]]) || 0;
    const totalVal = parseFloat(row[columnMap["total tracked"]]) || 0;

    // Derived or explicit other activities
    const otherVal = explicitOther > 0 ? explicitOther : Math.max(0, totalVal - (codingVal + studyVal + classVal + fitnessVal + sleepVal + freeVal));

    // Extract extracted values for the row for preview/inspection
    const rowData = {
      excelRowNumber: r + 1,
      isValid: isRowValid,
      coding: codingVal,
      study: studyVal,
      class: classVal,
      fitness: fitnessVal,
      sleep: sleepVal,
      otherActivities: otherVal,
      freeUnaccounted: freeVal,
      totalTracked: totalVal,
      feeling: row[columnMap["day's feeling"]] || "",
      satisfaction: row[columnMap["satisfaction level"]] || "",
      energy: row[columnMap["energy level"]] || ""
    };

    inspectedRows.push(rowData);
  }

  const missingOrInvalidDays = expectedDays - validDays;

  // Filter valid rows for index computation
  const validRows = inspectedRows.filter(r => r.isValid);

  // 1. TPI: Tech Productivity Index
  const totalCoding = validRows.reduce((acc, r) => acc + r.coding, 0);
  const tpi = validDays > 0 ? totalCoding / validDays : 0;

  // 2. AAI: Academic Activity Index
  const totalStudy = validRows.reduce((acc, r) => acc + r.study, 0);
  const totalClass = validRows.reduce((acc, r) => acc + r.class, 0);
  const aai = validDays > 0 ? (totalStudy + totalClass) / validDays : 0;

  // 3. PhAI: Physical Health Activity Index
  const totalFitness = validRows.reduce((acc, r) => acc + r.fitness, 0);
  const phai = validDays > 0 ? totalFitness / validDays : 0;

  // 4. SRI: Sleep Regularity Index
  const totalSleep = validRows.reduce((acc, r) => acc + r.sleep, 0);
  const sri = validDays > 0 ? totalSleep / validDays : 0;

  // 5. ABI: Active Balance Index
  const totalFree = validRows.reduce((acc, r) => acc + r.freeUnaccounted, 0);
  const abi = validDays > 0 ? totalFree / validDays : 0;

  // 6. Other Activities
  const totalOther = validRows.reduce((acc, r) => acc + r.otherActivities, 0);
  const otherAvg = validDays > 0 ? totalOther / validDays : 0;

  // 7. TUI: Time Utility Index
  const totalTracked = validRows.reduce((acc, r) => acc + r.totalTracked, 0);
  const tui = validDays > 0 ? totalTracked / validDays : 0;

  // 8. Specific Daily Averages (Requested Functions)
  const avgSleep = sri;
  const avgFitness = phai;
  const avgStudy = validDays > 0 ? totalStudy / validDays : 0;
  const avgCoding = tpi;
  const avgClass = validDays > 0 ? totalClass / validDays : 0;
  const avgOtherActivities = otherAvg;
  const avgFreeUnaccounted = abi;

  // 9. EI: Emotional Index
  let totalSentimentSum = 0;
  validRows.forEach(r => {
    const valFeeling = mapSentiment("Feeling", r.feeling);
    const valSatisfaction = mapSentiment("Satisfaction", r.satisfaction);
    const valEnergy = mapSentiment("Energy", r.energy);
    totalSentimentSum += (valFeeling + valSatisfaction + valEnergy);
  });

  const formulaDenominator = 13 * validDays;
  const ei = (validDays > 0 && formulaDenominator > 0)
    ? (totalSentimentSum / formulaDenominator) * 5
    : 0;

  // 10. DCI: Data Continuity Index
  const dci = expectedDays > 0 ? (validDays / expectedDays) * 100 : 0;

  // 11. PAI: Personal Activity Index
  // Formula: 0.15*TPI + 0.20*AAI + 0.15*PhAI + 0.20*SRI + 0.15*TUI + 0.10*EI + 0.05*DCI
  const pai = (
    0.15 * tpi +
    0.20 * aai +
    0.15 * phai +
    0.20 * sri +
    0.15 * tui +
    0.10 * ei +
    0.05 * dci
  );

  // Relationship Analysis (Rubric Requirement: Sleep-Energy, Study-Satisfaction, Coding-Energy)
  const relationships = analyzeRelationships(validRows);

  // Statistics Summary
  const stats = {
    coding: computeColumnStats(validRows.map(r => r.coding)),
    study: computeColumnStats(validRows.map(r => r.study)),
    class: computeColumnStats(validRows.map(r => r.class)),
    fitness: computeColumnStats(validRows.map(r => r.fitness)),
    sleep: computeColumnStats(validRows.map(r => r.sleep)),
    totalTracked: computeColumnStats(validRows.map(r => r.totalTracked))
  };

  const dailyAverages = {
    sleep: {
      name: "Average Sleep/day",
      minutes: Number(avgSleep.toFixed(2)),
      hours: Number((avgSleep / 60).toFixed(2)),
      totalMinutes: totalSleep,
      unit: "min/day",
      recommendation: "7.0 – 9.0 hrs/day",
      status: avgSleep >= 420 && avgSleep <= 540 ? "Optimal" : (avgSleep < 420 ? "Deficit" : "High")
    },
    fitness: {
      name: "Average Fitness/day",
      minutes: Number(avgFitness.toFixed(2)),
      hours: Number((avgFitness / 60).toFixed(2)),
      totalMinutes: totalFitness,
      unit: "min/day",
      recommendation: "≥ 30 min/day",
      status: avgFitness >= 30 ? "Target Met" : "Below Target"
    },
    study: {
      name: "Average Study/day",
      minutes: Number(avgStudy.toFixed(2)),
      hours: Number((avgStudy / 60).toFixed(2)),
      totalMinutes: totalStudy,
      unit: "min/day",
      recommendation: "≥ 60 min/day",
      status: avgStudy >= 60 ? "Active" : "Light"
    },
    coding: {
      name: "Average Coding/day",
      minutes: Number(avgCoding.toFixed(2)),
      hours: Number((avgCoding / 60).toFixed(2)),
      totalMinutes: totalCoding,
      unit: "min/day",
      recommendation: "≥ 60 – 120 min/day",
      status: avgCoding >= 60 ? "Productive" : "Developing"
    },
    classTime: {
      name: "Average Class/day",
      minutes: Number(avgClass.toFixed(2)),
      hours: Number((avgClass / 60).toFixed(2)),
      totalMinutes: totalClass,
      unit: "min/day",
      recommendation: "Official University Schedule",
      status: "Academic"
    },
    otherActivities: {
      name: "Average Other Activities/day",
      minutes: Number(avgOtherActivities.toFixed(2)),
      hours: Number((avgOtherActivities / 60).toFixed(2)),
      totalMinutes: totalOther,
      unit: "min/day",
      recommendation: "Daily Routine & Logistics",
      status: "Routine"
    },
    freeUnaccounted: {
      name: "Average Free / Unaccounted Time/day",
      minutes: Number(avgFreeUnaccounted.toFixed(2)),
      hours: Number((avgFreeUnaccounted / 60).toFixed(2)),
      totalMinutes: totalFree,
      unit: "min/day",
      recommendation: "Leisure & Buffer Window",
      status: avgFreeUnaccounted <= 180 ? "Balanced" : "High Downtime"
    }
  };

  return {
    audit: {
      expectedDays,
      validDays,
      missingOrInvalidDays,
      trackedDateRange: `${TRACKING_WINDOW.startDate} to ${TRACKING_WINDOW.endDate}`,
      columnMap,
      missingCols,
      isFullyCompliant: missingCols.length === 0 && validDays > 0
    },
    pai: Number(pai.toFixed(2)),
    indices: {
      tpi: {
        code: "TPI",
        name: "Tech Productivity Index",
        unit: "min/day",
        weight: "15%",
        value: Number(tpi.toFixed(2)),
        total: totalCoding,
        category: "Productivity",
        desc: "Daily average time invested strictly in programming and development."
      },
      aai: {
        code: "AAI",
        name: "Academic Activity Index",
        unit: "min/day",
        weight: "20%",
        value: Number(aai.toFixed(2)),
        totalStudy,
        totalClass,
        category: "Academics",
        desc: "Combined daily average of self-study and scheduled university classes."
      },
      phai: {
        code: "PhAI",
        name: "Physical Health Activity Index",
        unit: "min/day",
        weight: "15%",
        value: Number(phai.toFixed(2)),
        total: totalFitness,
        category: "Health",
        desc: "Daily average duration dedicated to fitness, workouts, or sports."
      },
      sri: {
        code: "SRI",
        name: "Sleep Regularity Index",
        unit: "min/day",
        weight: "20%",
        value: Number(sri.toFixed(2)),
        total: totalSleep,
        hoursPerDay: Number((sri / 60).toFixed(1)),
        category: "Recovery",
        desc: "Daily average time allocated to restorative physiological sleep."
      },
      abi: {
        code: "ABI",
        name: "Active Balance Index",
        unit: "min/day",
        weight: "Diagnostic",
        value: Number(abi.toFixed(2)),
        total: totalFree,
        category: "Balance",
        desc: "Daily average unaccounted, leisure, or downtime."
      },
      tui: {
        code: "TUI",
        name: "Time Utility Index",
        unit: "min/day",
        weight: "15%",
        value: Number(tui.toFixed(2)),
        total: totalTracked,
        hoursPerDay: Number((tui / 60).toFixed(1)),
        category: "Productivity",
        desc: "Total aggregate tracked hours per day across all monitored metrics."
      },
      ei: {
        code: "EI",
        name: "Emotional Index",
        unit: "/ 5.00",
        weight: "10%",
        value: Number(ei.toFixed(2)),
        rawScoreSum: totalSentimentSum,
        maxPossible: formulaDenominator,
        category: "Wellbeing",
        desc: "Normalized 1.00-5.00 emotional rating aggregating Feeling, Satisfaction, and Energy."
      },
      dci: {
        code: "DCI",
        name: "Data Continuity Index",
        unit: "%",
        weight: "5%",
        value: Number(dci.toFixed(2)),
        validDays,
        expectedDays,
        category: "Integrity",
        desc: "Percentage of mandatory logging days successfully tracked without gaps."
      }
    },
    dailyAverages,
    relationships,
    stats,
    inspectedRows
  };
}

function computeColumnStats(arr) {
  if (!arr || arr.length === 0) {
    return { mean: 0, min: 0, max: 0, stdDev: 0, total: 0 };
  }
  const total = arr.reduce((acc, v) => acc + v, 0);
  const mean = total / arr.length;
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const stdDev = calculateStdDev(arr, mean);
  return {
    total: Math.round(total),
    mean: Number(mean.toFixed(2)),
    min,
    max,
    stdDev: Number(stdDev.toFixed(2))
  };
}

function analyzeRelationships(validRows) {
  if (validRows.length === 0) return {};

  // 1. Sleep vs Energy Level
  // Sleep categorized: < 360 min (<6h), 360-450 min (6-7.5h), > 450 min (>7.5h)
  const sleepBands = {
    low: { label: "< 6 Hours", count: 0, energySum: 0 },
    optimal: { label: "6 - 7.5 Hours", count: 0, energySum: 0 },
    high: { label: "> 7.5 Hours", count: 0, energySum: 0 }
  };

  validRows.forEach(r => {
    const energyNum = mapSentiment("Energy", r.energy);
    if (r.sleep < 360) {
      sleepBands.low.count++;
      sleepBands.low.energySum += energyNum;
    } else if (r.sleep <= 450) {
      sleepBands.optimal.count++;
      sleepBands.optimal.energySum += energyNum;
    } else {
      sleepBands.high.count++;
      sleepBands.high.energySum += energyNum;
    }
  });

  const sleepVsEnergy = Object.keys(sleepBands).map(key => {
    const b = sleepBands[key];
    const avgEnergy = b.count > 0 ? Number((b.energySum / b.count).toFixed(2)) : 0;
    return {
      band: b.label,
      days: b.count,
      avgEnergyScore: avgEnergy
    };
  });

  // 2. Study vs Satisfaction
  // Study categorized: < 60 min, 60-180 min, > 180 min
  const studyBands = {
    low: { label: "< 1 Hour", count: 0, satSum: 0 },
    moderate: { label: "1 - 3 Hours", count: 0, satSum: 0 },
    high: { label: "> 3 Hours", count: 0, satSum: 0 }
  };

  validRows.forEach(r => {
    const satNum = mapSentiment("Satisfaction", r.satisfaction);
    if (r.study < 60) {
      studyBands.low.count++;
      studyBands.low.satSum += satNum;
    } else if (r.study <= 180) {
      studyBands.moderate.count++;
      studyBands.moderate.satSum += satNum;
    } else {
      studyBands.high.count++;
      studyBands.high.satSum += satNum;
    }
  });

  const studyVsSatisfaction = Object.keys(studyBands).map(key => {
    const b = studyBands[key];
    const avgSat = b.count > 0 ? Number((b.satSum / b.count).toFixed(2)) : 0;
    return {
      band: b.label,
      days: b.count,
      avgSatisfaction: avgSat
    };
  });

  // 3. Coding vs Energy
  const codingBands = {
    low: { label: "< 60 min", count: 0, energySum: 0 },
    moderate: { label: "60 - 150 min", count: 0, energySum: 0 },
    deepWork: { label: "> 150 min", count: 0, energySum: 0 }
  };

  validRows.forEach(r => {
    const energyNum = mapSentiment("Energy", r.energy);
    if (r.coding < 60) {
      codingBands.low.count++;
      codingBands.low.energySum += energyNum;
    } else if (r.coding <= 150) {
      codingBands.moderate.count++;
      codingBands.moderate.energySum += energyNum;
    } else {
      codingBands.deepWork.count++;
      codingBands.deepWork.energySum += energyNum;
    }
  });

  const codingVsEnergy = Object.keys(codingBands).map(key => {
    const b = codingBands[key];
    const avgEnergy = b.count > 0 ? Number((b.energySum / b.count).toFixed(2)) : 0;
    return {
      band: b.label,
      days: b.count,
      avgEnergyScore: avgEnergy
    };
  });

  return {
    sleepVsEnergy,
    studyVsSatisfaction,
    codingVsEnergy
  };
}

/**
 * Generate a realistic 40-day sample dataset matching project.py specifications
 * so the user can test all calculations immediately without needing an external file.
 */
export function generateSampleSheetData() {
  const data = [];
  
  // Row 1-4: Title / Metadata headers
  data.push(["CAP776 Mini Project: Student Daily Activity Log"]);
  data.push(["Student: Demonstration Cohort", "Roll: Demo-101", "Registration: 12100000"]);
  data.push(["Window: 13 Aug 2026 to 21 Sep 2026 (40 Expected Logging Days)"]);
  data.push([]); // Blank Row 4
  
  // Row 5: Column headers (ws[5])
  data.push([
    "Date",
    "Day",
    "Coding (min)",
    "Study (min)",
    "Class (min)",
    "Fitness (min)",
    "Sleep (min)",
    "Free/Unaccounted (min)",
    "Total Tracked (min)",
    "Day's Feeling",
    "Satisfaction Level",
    "Energy Level"
  ]);

  // Row 6: Units row / blank separator
  data.push([
    "DD/MM/YYYY",
    "Name",
    "Minutes",
    "Minutes",
    "Minutes",
    "Minutes",
    "Minutes",
    "Minutes",
    "Minutes",
    "Sentiment",
    "Sentiment",
    "Sentiment"
  ]);

  // Rows 7 to 46: 40 Days of realistic tracking data
  const feelings = ["Good", "Excellent", "Neutral", "Good", "Stressed", "Good", "Excellent"];
  const satisfactions = ["Satisfied", "Verysatisfied", "Neutral", "Satisfied", "Unsatisfied", "Satisfied", "Verysatisfied"];
  const energies = ["High", "Medium", "High", "High", "Low", "Medium", "High"];

  const startDate = new Date(2026, 7, 13); // Aug 13, 2026

  for (let i = 0; i < 40; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateStr = currentDate.toISOString().split("T")[0];
    const dayName = currentDate.toLocaleDateString("en-US", { weekday: "short" });

    // Generate balanced realistic numbers
    const isWeekend = dayName === "Sat" || dayName === "Sun";
    
    // Day 24 simulated as a rest/missed day to test valid_days auditing
    if (i === 23) {
      data.push([
        dateStr,
        dayName,
        0, 0, 0, 0, 0, 0, 0,
        "Neutral", "Neutral", "Low"
      ]);
      continue;
    }

    const coding = isWeekend ? 180 + (i % 3) * 30 : 90 + (i % 4) * 25;
    const study = isWeekend ? 60 + (i % 2) * 45 : 120 + (i % 3) * 30;
    const classTime = isWeekend ? 0 : 240;
    const fitness = 45 + (i % 3) * 15;
    const sleep = 420 + (i % 5) * 20; // ~7 - 8.3 hrs
    const freeTime = 120 + (i % 4) * 20;
    const total = coding + study + classTime + fitness + sleep + freeTime;

    const feeling = feelings[i % feelings.length];
    const satisfaction = satisfactions[i % satisfactions.length];
    const energy = energies[i % energies.length];

    data.push([
      dateStr,
      dayName,
      coding,
      study,
      classTime,
      fitness,
      sleep,
      freeTime,
      total,
      feeling,
      satisfaction,
      energy
    ]);
  }

  return data;
}
