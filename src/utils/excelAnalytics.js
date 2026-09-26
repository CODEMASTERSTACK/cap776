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

export function buildTrackingWindow(startDateStr = "2026-08-13") {
  const parts = String(startDateStr || "2026-08-13").split("-").map(Number);
  const startYear = parts[0] || 2026;
  const startMonth = parts[1] || 8;
  const startDay = parts[2] || 13;
  
  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const startDateObj = new Date(startYear, startMonth - 1, startDay, 12, 0, 0);

  // End date is ALWAYS 21 September 2026
  const deadlineObj = new Date(2026, 8, 21, 12, 0, 0);
  const msDiff = deadlineObj.getTime() - startDateObj.getTime();
  const expectedDays = Math.max(1, Math.round(msDiff / (1000 * 3600 * 24)) + 1);

  const targetDays = [];
  for (let i = 0; i < expectedDays; i++) {
    const d = new Date(startYear, startMonth - 1, startDay + i, 12, 0, 0);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    const mStr = String(m).padStart(2, "0");
    const dStr = String(day).padStart(2, "0");
    targetDays.push({
      index: i + 1,
      year: y,
      month: m,
      day: day,
      key: `${mStr}-${dStr}`,
      dateStr: `${y}-${mStr}-${dStr}`,
      label: `${day} ${monthNames[m]} ${y}`,
      shortLabel: `${day} ${monthNames[m]}`,
      dayOfWeek: d.toLocaleDateString("en-US", { weekday: "short" })
    });
  }

  const firstDay = targetDays[0];
  const lastDay = targetDays[targetDays.length - 1];

  return {
    startDate: firstDay.dateStr,
    startDateLabel: firstDay.label,
    endDate: lastDay.dateStr,
    endDateLabel: lastDay.label,
    expectedDays,
    targetDays,
    keyMap: new Map(targetDays.map(d => [d.key, d]))
  };
}

export const TRACKING_WINDOW = {
  startDate: "2026-08-13",
  endDate: "2026-09-21",
  expectedDays: 40 // (dt.datetime(2026, 9, 21) - dt.datetime(2026, 8, 13)).days + 1
};

// Default CAP776 canonical days
export const CANONICAL_40_DAYS = buildTrackingWindow("2026-08-13", "fixed_40").targetDays;

export const CANONICAL_KEY_MAP = buildTrackingWindow("2026-08-13", "fixed_40").keyMap;

const MONTH_NAME_MAP = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12
};

function formatParsedDate(year, month, day) {
  const mStr = String(month).padStart(2, "0");
  const dStr = String(day).padStart(2, "0");
  const key = `${mStr}-${dStr}`;
  const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const mName = monthNames[month] || mStr;
  return {
    year: year || 2026,
    month,
    day,
    key,
    dateStr: `${year || 2026}-${mStr}-${dStr}`,
    label: `${day} ${mName} ${year || 2026}`,
    shortLabel: `${day} ${mName}`
  };
}

/**
 * Robust date parser supporting JS Dates, Excel serial numbers,
 * and text formats (DD/MM/YYYY, YYYY-MM-DD, 16-Aug, August 16, etc.)
 */
export function parseExcelDate(val, prevParsedDate = null) {
  if (val === null || val === undefined || val === "") return null;

  // Case 1: JavaScript Date instance
  if (val instanceof Date) {
    if (isNaN(val.getTime())) return null;
    // Add 12 hours (noon shift) to safely counteract timezone offsets or 23:59:59.999 precision loss
    const noon = new Date(val.getTime() + 12 * 3600 * 1000);
    return formatParsedDate(noon.getUTCFullYear(), noon.getUTCMonth() + 1, noon.getUTCDate());
  }

  // Case 2: Numeric Excel serial or plain day
  if (typeof val === "number") {
    // Excel serial dates around 2024-2030 (~44000 to ~55000)
    if (val >= 30000 && val <= 65000) {
      // 25569 is Jan 1 1970 in Excel 1900 date system
      const utcMs = Math.round((val - 25569) * 86400 * 1000);
      const dtObj = new Date(utcMs + 12 * 3600 * 1000);
      return formatParsedDate(dtObj.getUTCFullYear(), dtObj.getUTCMonth() + 1, dtObj.getUTCDate());
    }
    // Case 2b: Plain day of month (1 to 31)
    if (Number.isInteger(val) && val >= 1 && val <= 31) {
      let deducedMonth = 8;
      if (prevParsedDate) {
        if (prevParsedDate.month === 8) {
          deducedMonth = (val < prevParsedDate.day) ? 9 : 8;
        } else {
          deducedMonth = 9;
        }
      } else {
        deducedMonth = (val >= 13) ? 8 : 9;
      }
      return formatParsedDate(2026, deducedMonth, val);
    }
  }

  const str = String(val).trim();
  if (!str) return null;
  const lower = str.toLowerCase();

  // Skip table header strings
  if (lower === "date" || lower.includes("dd/mm") || lower === "name" || lower.includes("sentiment") || lower.includes("minutes")) {
    return null;
  }

  // Case 3a: ISO string with timestamp (e.g. "2026-08-12T18:29:50.000Z")
  if (str.includes("T")) {
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const noon = new Date(d.getTime() + 12 * 3600 * 1000);
      return formatParsedDate(noon.getUTCFullYear(), noon.getUTCMonth() + 1, noon.getUTCDate());
    }
  }

  // Case 3b: ISO format YYYY-MM-DD or YYYY/MM/DD
  const isoMatch = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (isoMatch) {
    return formatParsedDate(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10), parseInt(isoMatch[3], 10));
  }

  // Case 3b: Text Month: e.g. "16-Aug-2026", "16 Aug 2026", "16-Aug", "16th August"
  const textMonthMatch1 = str.match(/^(\d{1,2})(?:st|nd|rd|th)?[\s\-_]+([a-zA-Z]+)(?:[\s\-_]+(\d{2,4}))?/);
  if (textMonthMatch1) {
    const d = parseInt(textMonthMatch1[1], 10);
    const mName = textMonthMatch1[2].toLowerCase().slice(0, 3);
    const m = MONTH_NAME_MAP[mName];
    if (m && d >= 1 && d <= 31) {
      const y = textMonthMatch1[3] ? (textMonthMatch1[3].length === 2 ? 2000 + parseInt(textMonthMatch1[3], 10) : parseInt(textMonthMatch1[3], 10)) : 2026;
      return formatParsedDate(y, m, d);
    }
  }

  const textMonthMatch2 = str.match(/^([a-zA-Z]+)[\s\-_]+(\d{1,2})(?:st|nd|rd|th)?(?:[,\s\-_]+(\d{2,4}))?/);
  if (textMonthMatch2) {
    const mName = textMonthMatch2[1].toLowerCase().slice(0, 3);
    const d = parseInt(textMonthMatch2[2], 10);
    const m = MONTH_NAME_MAP[mName];
    if (m && d >= 1 && d <= 31) {
      const y = textMonthMatch2[3] ? parseInt(textMonthMatch2[3], 10) : 2026;
      return formatParsedDate(y, m, d);
    }
  }

  // Case 3c: DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})/);
  if (dmyMatch) {
    const n1 = parseInt(dmyMatch[1], 10);
    const n2 = parseInt(dmyMatch[2], 10);
    const rawY = parseInt(dmyMatch[3], 10);
    const y = rawY < 100 ? 2000 + rawY : rawY;

    let d = n1;
    let m = n2;
    if (n1 > 12) {
      d = n1;
      m = n2;
    } else if (n2 > 12) {
      d = n2;
      m = n1;
    } else {
      if (n2 === 8 || n2 === 9) {
        m = n2;
        d = n1;
      } else if (n1 === 8 || n1 === 9) {
        m = n1;
        d = n2;
      }
    }
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      return formatParsedDate(y, m, d);
    }
  }

  // Case 3d: DD/MM or MM/DD without year
  const shortMatch = str.match(/^(\d{1,2})[-/.](\d{1,2})$/);
  if (shortMatch) {
    const n1 = parseInt(shortMatch[1], 10);
    const n2 = parseInt(shortMatch[2], 10);
    let d = n1;
    let m = n2;
    if (n2 === 8 || n2 === 9) {
      m = n2;
      d = n1;
    } else if (n1 === 8 || n1 === 9) {
      m = n1;
      d = n2;
    }
    return formatParsedDate(2026, m, d);
  }

  return null;
}

/**
 * Scan worksheet to detect the earliest logged date from student rows.
 */
export function detectEarliestSheetDate(sheetRows) {
  if (!sheetRows || sheetRows.length < 6) return null;

  let headerRowIdx = 4;
  for (let r = 0; r < Math.min(8, sheetRows.length); r++) {
    const row = sheetRows[r];
    if (row && row.some(cell => {
      const s = String(cell || "").toLowerCase().trim();
      return s.includes("coding") || s.includes("study") || s.includes("total tracked");
    })) {
      headerRowIdx = r;
      break;
    }
  }

  const headerRow = sheetRows[headerRowIdx] || [];
  let dateColIdx = undefined;
  for (let c = 0; c < headerRow.length; c++) {
    const colName = String(headerRow[c] || "").toLowerCase().trim();
    if (colName === "date" || colName === "dates" || colName.includes("day/date") || colName.includes("log date") || colName === "day") {
      dateColIdx = c;
      break;
    }
  }

  if (dateColIdx === undefined) {
    const sampleRows = sheetRows.slice(headerRowIdx + 1, Math.min(headerRowIdx + 15, sheetRows.length));
    const maxCols = Math.max(...sampleRows.map(r => (r ? r.length : 0)), 15);
    let bestCol = -1;
    let maxMatches = 0;
    for (let c = 0; c < maxCols; c++) {
      let matches = 0;
      for (const row of sampleRows) {
        if (row && parseExcelDate(row[c])) matches++;
      }
      if (matches > maxMatches && matches >= 2) {
        maxMatches = matches;
        bestCol = c;
      }
    }
    if (bestCol !== -1) dateColIdx = bestCol;
  }

  if (dateColIdx === undefined) return null;

  let earliest = null;
  let prevDate = null;

  for (let r = headerRowIdx + 1; r < sheetRows.length; r++) {
    const row = sheetRows[r];
    if (!row || row.length === 0) continue;
    const parsed = parseExcelDate(row[dateColIdx], prevDate);
    if (parsed) {
      prevDate = parsed;
      const ts = new Date(parsed.year || 2026, parsed.month - 1, parsed.day).getTime();
      if (!earliest || ts < earliest.timestamp) {
        const dObj = new Date(parsed.year || 2026, parsed.month - 1, parsed.day);
        earliest = {
          ...parsed,
          timestamp: ts,
          dayOfWeek: dObj.toLocaleDateString("en-US", { weekday: "short" })
        };
      }
    }
  }

  return earliest ? earliest.dateStr : null;
}

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
 * Date-Aware Window Alignment Engine:
 * - Scans worksheet for Date column and aligns strictly to 13 Aug – 21 Sep (40 Days)
 * - Identifies missing start dates (e.g. if logging started 16 Aug, 13–15 Aug are marked missing)
 * - Excludes post-window dates (e.g. 22–24 Sep) so calculation is not erroneously skewed
 * - Graceful fallback to sequential row window if no dates are parsed
 */
export function computePAIFromSheetData(sheetRows, customOptions = {}) {
  if (!sheetRows || sheetRows.length < 5) {
    throw new Error("Invalid sheet format: Worksheet must contain at least 5 rows with headers in Row 5.");
  }

  const startDateOpt = typeof customOptions === 'string' ? customOptions : (customOptions?.startDate || "2026-08-13");
  const currentWindow = buildTrackingWindow(startDateOpt);
  const targetDays = currentWindow.targetDays;
  const targetKeyMap = currentWindow.keyMap;

  // Find header row: default is Row 5 (index 4), or scan rows 0 to 6
  let headerRowIdx = 4;
  let headerRow = sheetRows[4] || [];
  let columnMap = {};

  const tryBuildColMap = (row) => {
    const map = {};
    if (!row) return map;
    row.forEach((cellVal, colIdx) => {
      if (cellVal !== undefined && cellVal !== null && cellVal !== "") {
        const clean = normalizeColumnHeader(cellVal);
        if (clean) map[clean] = colIdx;
      }
    });
    return map;
  };

  columnMap = tryBuildColMap(headerRow);
  if (!columnMap["total tracked"] && !columnMap["coding"]) {
    // Scan candidate header rows (rows 0 to 5)
    for (let r = 0; r < Math.min(6, sheetRows.length); r++) {
      const candidateMap = tryBuildColMap(sheetRows[r]);
      if (candidateMap["total tracked"] || candidateMap["coding"]) {
        headerRowIdx = r;
        headerRow = sheetRows[r];
        columnMap = candidateMap;
        break;
      }
    }
  }

  // Verify missing columns
  const missingCols = REQUIRED_COLUMNS.filter(col => !(col in columnMap));
  const expectedDays = currentWindow.expectedDays;
  const trackedColIdx = columnMap["total tracked"];
  let dateColIdx = columnMap["date"] ?? columnMap["dates"] ?? columnMap["tracking date"] ?? columnMap["day/date"] ?? columnMap["log date"] ?? columnMap["daily date"] ?? columnMap["day date"] ?? columnMap["timestamp"];

  // Auto-detect date column if not found by header name
  if (dateColIdx === undefined) {
    const sampleRows = sheetRows.slice(headerRowIdx + 1, Math.min(headerRowIdx + 15, sheetRows.length));
    const maxCols = Math.max(...sampleRows.map(r => (r ? r.length : 0)), 15);
    let bestCol = -1;
    let maxMatches = 0;
    for (let c = 0; c < maxCols; c++) {
      let matches = 0;
      for (const row of sampleRows) {
        if (row && parseExcelDate(row[c])) {
          matches++;
        }
      }
      if (matches > maxMatches && matches >= 2) {
        maxMatches = matches;
        bestCol = c;
      }
    }
    if (bestCol !== -1) {
      dateColIdx = bestCol;
    }
  }

  // Scan all data rows below the header row
  const matchedDateMap = {};
  const outOfWindowRows = [];
  const allParsedRows = [];
  let prevDate = null;

  for (let r = headerRowIdx + 1; r < sheetRows.length; r++) {
    const row = sheetRows[r];
    if (!row || row.length === 0 || row.every(c => c === undefined || c === null || c === "")) {
      continue;
    }

    let parsedDate = null;
    if (dateColIdx !== undefined && dateColIdx < row.length) {
      parsedDate = parseExcelDate(row[dateColIdx], prevDate);
      if (parsedDate) {
        prevDate = parsedDate;
      }
    }

    if (parsedDate) {
      allParsedRows.push({ row, excelRowNumber: r + 1, parsedDate });

      if (targetKeyMap.has(parsedDate.key)) {
        if (!matchedDateMap[parsedDate.key]) {
          matchedDateMap[parsedDate.key] = { row, excelRowNumber: r + 1, parsedDate };
        }
      } else {
        const rowD = new Date(parsedDate.year || 2026, parsedDate.month - 1, parsedDate.day);
        const winStart = new Date(targetDays[0].year, targetDays[0].month - 1, targetDays[0].day);
        const winEnd = new Date(targetDays[targetDays.length - 1].year, targetDays[targetDays.length - 1].month - 1, targetDays[targetDays.length - 1].day);

        let reason = "Date outside tracking window";
        if (rowD < winStart) {
          reason = `Pre-window: ${parsedDate.label} is prior to tracking start (${currentWindow.startDateLabel})`;
        } else if (rowD > winEnd) {
          reason = `Post-window: ${parsedDate.label} is after window end date (${currentWindow.endDateLabel})`;
        }

        const totalVal = trackedColIdx !== undefined ? parseFloat(row[trackedColIdx]) || 0 : 0;
        const codingVal = columnMap["coding"] !== undefined ? parseFloat(row[columnMap["coding"]]) || 0 : 0;

        outOfWindowRows.push({
          excelRowNumber: r + 1,
          dateLabel: parsedDate.label,
          shortLabel: parsedDate.shortLabel,
          reason,
          coding: codingVal,
          totalTracked: totalVal
        });
      }
    }
  }

  // Determine if Date-Aware Alignment applies (if at least 3 dates match the window)
  const isDateAligned = Object.keys(matchedDateMap).length >= 3;

  const inspectedRows = [];
  const missingDates = [];
  let validDays = 0;

  if (isDateAligned) {
    // Strictly map each of the target Calendar Days in the configured window
    targetDays.forEach((targetDay) => {
      const match = matchedDateMap[targetDay.key];
      if (match) {
        const row = match.row;
        let isRowValid = false;
        const totalVal = (trackedColIdx !== undefined && trackedColIdx < row.length) ? parseFloat(row[trackedColIdx]) || 0 : 0;
        if (totalVal > 0) {
          validDays++;
          isRowValid = true;
        }

        const explicitOther = parseFloat(row[columnMap["other activities"] || columnMap["other"] || columnMap["other activity"]]) || 0;
        const codingVal = parseFloat(row[columnMap["coding"]]) || 0;
        const studyVal = parseFloat(row[columnMap["study"]]) || 0;
        const classVal = parseFloat(row[columnMap["class"]]) || 0;
        const fitnessVal = parseFloat(row[columnMap["fitness"]]) || 0;
        const sleepVal = parseFloat(row[columnMap["sleep"]]) || 0;
        const freeVal = parseFloat(row[columnMap["free/unaccounted"]]) || 0;
        const otherVal = explicitOther > 0 ? explicitOther : Math.max(0, totalVal - (codingVal + studyVal + classVal + fitnessVal + sleepVal + freeVal));

        inspectedRows.push({
          dayIndex: targetDay.index,
          date: targetDay.label,
          shortDate: targetDay.shortLabel,
          dayOfWeek: targetDay.dayOfWeek,
          excelRowNumber: match.excelRowNumber,
          isLogged: true,
          isValid: isRowValid,
          status: isRowValid ? "Valid" : "Nil / Zero",
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
        });
      } else {
        // Date was not present in worksheet (e.g. 13-15 Aug when user started 16 Aug)
        missingDates.push(targetDay.label);
        inspectedRows.push({
          dayIndex: targetDay.index,
          date: targetDay.label,
          shortDate: targetDay.shortLabel,
          dayOfWeek: targetDay.dayOfWeek,
          excelRowNumber: null,
          isLogged: false,
          isValid: false,
          status: "Missing from Log",
          coding: 0,
          study: 0,
          class: 0,
          fitness: 0,
          sleep: 0,
          otherActivities: 0,
          freeUnaccounted: 0,
          totalTracked: 0,
          feeling: "—",
          satisfaction: "—",
          energy: "—"
        });
      }
    });
  } else {
    // Fallback: sequential row scanning starting at data row (index 6, or 5 if row 5 has values)
    let startRow = 6;
    if (sheetRows[5] && trackedColIdx !== undefined) {
      const val = parseFloat(sheetRows[5][trackedColIdx]);
      if (!isNaN(val) && val > 0) startRow = 5;
    }

    for (let i = 0; i < expectedDays; i++) {
      const r = startRow + i;
      const row = sheetRows[r] || [];
      const targetDay = targetDays[i];
      let isRowValid = false;
      const totalVal = (trackedColIdx !== undefined && trackedColIdx < row.length) ? parseFloat(row[trackedColIdx]) || 0 : 0;
      if (totalVal > 0) {
        validDays++;
        isRowValid = true;
      }

      const explicitOther = parseFloat(row[columnMap["other activities"] || columnMap["other"] || columnMap["other activity"]]) || 0;
      const codingVal = parseFloat(row[columnMap["coding"]]) || 0;
      const studyVal = parseFloat(row[columnMap["study"]]) || 0;
      const classVal = parseFloat(row[columnMap["class"]]) || 0;
      const fitnessVal = parseFloat(row[columnMap["fitness"]]) || 0;
      const sleepVal = parseFloat(row[columnMap["sleep"]]) || 0;
      const freeVal = parseFloat(row[columnMap["free/unaccounted"]]) || 0;
      const otherVal = explicitOther > 0 ? explicitOther : Math.max(0, totalVal - (codingVal + studyVal + classVal + fitnessVal + sleepVal + freeVal));

      inspectedRows.push({
        dayIndex: i + 1,
        date: targetDay ? targetDay.label : `Day ${i + 1}`,
        shortDate: targetDay ? targetDay.shortLabel : `D${i + 1}`,
        dayOfWeek: targetDay ? targetDay.dayOfWeek : "",
        excelRowNumber: r + 1,
        isLogged: row.length > 0,
        isValid: isRowValid,
        status: isRowValid ? "Valid" : (row.length > 0 ? "Nil / Zero" : "Missing from Log"),
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
      });
    }
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

  const firstParsed = allParsedRows[0]?.parsedDate?.label;
  const lastParsed = allParsedRows[allParsedRows.length - 1]?.parsedDate?.label;

  let alignmentAlert = null;
  if (isDateAligned && (missingDates.length > 0 || outOfWindowRows.length > 0)) {
    const parts = [];
    if (firstParsed) parts.push(`Sheet logs range: ${firstParsed} to ${lastParsed || firstParsed}`);
    if (missingDates.length > 0) parts.push(`${missingDates.length} rubric day(s) missing (${missingDates.slice(0, 3).join(', ')}${missingDates.length > 3 ? '...' : ''})`);
    if (outOfWindowRows.length > 0) parts.push(`${outOfWindowRows.length} out-of-window row(s) excluded (e.g. after 21 Sep)`);
    alignmentAlert = parts.join(" • ");
  }

  return {
    audit: {
      expectedDays,
      validDays,
      missingOrInvalidDays,
      trackedDateRange: `${currentWindow.startDate} to ${currentWindow.endDate}`,
      startDate: currentWindow.startDateLabel,
      endDate: currentWindow.endDateLabel,
      startDateStr: currentWindow.startDate,
      endDateStr: currentWindow.endDate,
      windowMode: currentWindow.windowMode,
      targetDaysCount: targetDays.length,
      isDateAligned,
      dateTrackingMode: isDateAligned ? "date-aligned" : "row-fallback",
      missingDatesCount: missingDates.length,
      missingDates,
      outOfWindowRowsCount: outOfWindowRows.length,
      outOfWindowRows,
      firstLoggedDate: firstParsed,
      lastLoggedDate: lastParsed,
      alignmentAlert,
      columnMap,
      missingCols,
      isFullyCompliant: missingCols.length === 0 && validDays > 0 && missingDates.length === 0
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
export function generateSampleSheetData(customStartDate = "2026-08-13") {
  const data = [];

  const parts = String(customStartDate || "2026-08-13").split("-").map(Number);
  const startYear = parts[0] || 2026;
  const startMonth = parts[1] || 8;
  const startDay = parts[2] || 13;
  const win = buildTrackingWindow(customStartDate);

  // Row 1-4: Title / Metadata headers
  data.push(["CAP776 Mini Project: Student Daily Activity Log"]);
  data.push(["Student: Demonstration Cohort", "Roll: Demo-101", "Registration: 12100000"]);
  data.push([`Window: ${win.startDateLabel} to ${win.endDateLabel} (${win.expectedDays} Expected Logging Days)`]);
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

  // Rows 7 onward: Expected days of realistic tracking data
  const feelings = ["Good", "Excellent", "Neutral", "Good", "Stressed", "Good", "Excellent"];
  const satisfactions = ["Satisfied", "Verysatisfied", "Neutral", "Satisfied", "Unsatisfied", "Satisfied", "Verysatisfied"];
  const energies = ["High", "Medium", "High", "High", "Low", "Medium", "High"];

  const startDate = new Date(startYear, startMonth - 1, startDay, 12, 0, 0);

  for (let i = 0; i < win.expectedDays; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const yStr = currentDate.getFullYear();
    const mStr = String(currentDate.getMonth() + 1).padStart(2, "0");
    const dStr = String(currentDate.getDate()).padStart(2, "0");
    const dateStr = `${yStr}-${mStr}-${dStr}`;
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
