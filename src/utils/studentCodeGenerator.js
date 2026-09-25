/**
 * Polymorphic Student Python Code Generator for CAP776
 * 
 * Generates mathematically sound, 100% executable openpyxl Python code
 * across 4 distinct algorithmic paradigms, varying line counts (280 to 550+ lines),
 * variable naming sets, scoping topologies, and authentic student coding habits.
 * 
 * Strictly follows the CAP776 syllabus:
 * - NO NumPy, NO Pandas
 * - Standard Python openpyxl, datetime, math, functions, lists, dicts, try/except, and OOP
 */

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function rollChance(prob = 0.5) {
  return Math.random() < prob;
}

// -------------------------------------------------------------
// 1. VARIABLE NAMING PALETTES (5 Distinct Student Personas)
// -------------------------------------------------------------
const VARIABLE_PALETTES = [
  {
    wb: 'wb',
    ws: 'ws',
    cols: 'column_list',
    code: 'coding_time',
    study: 'study_time',
    classTime: 'class_time',
    fit: 'fitness_time',
    slp: 'sleep_time',
    free: 'free_unaccounted_time',
    tracked: 'total_tracked_time',
    sentSum: 'sentiment_sum',
    valid: 'valid_days',
    expected: 'expected_days',
    pai: 'final_pai',
    tpi: 'tpi_val',
    aai: 'aai_val',
    phai: 'phai_val',
    sri: 'sri_val',
    abi: 'abi_val',
    tui: 'tui_val',
    ei: 'ei_val',
    dci: 'dci_val'
  },
  {
    wb: 'excel_wb',
    ws: 'data_sheet',
    cols: 'header_col_map',
    code: 'sum_coding_mins',
    study: 'sum_study_mins',
    classTime: 'sum_class_mins',
    fit: 'sum_fitness_mins',
    slp: 'sum_sleep_mins',
    free: 'sum_downtime_mins',
    tracked: 'sum_tracked_mins',
    sentSum: 'total_emotion_score',
    valid: 'actual_valid_days',
    expected: 'target_days_count',
    pai: 'pai_calculated_score',
    tpi: 'tpi_result',
    aai: 'aai_result',
    phai: 'phai_result',
    sri: 'sri_result',
    abi: 'abi_result',
    tui: 'tui_result',
    ei: 'ei_result',
    dci: 'dci_result'
  },
  {
    wb: 'workbook',
    ws: 'active_worksheet',
    cols: 'col_indices',
    code: 'coding_total',
    study: 'study_total',
    classTime: 'class_total',
    fit: 'fitness_total',
    slp: 'sleep_total',
    free: 'free_time_total',
    tracked: 'tracked_total',
    sentSum: 'raw_sentiment_total',
    valid: 'valid_days_count',
    expected: 'total_days_in_period',
    pai: 'overall_pai_index',
    tpi: 'tpi_score',
    aai: 'aai_score',
    phai: 'phai_score',
    sri: 'sri_score',
    abi: 'abi_score',
    tui: 'tui_score',
    ei: 'ei_score',
    dci: 'dci_score'
  },
  {
    wb: 'student_wb',
    ws: 'student_ws',
    cols: 'col_dict',
    code: 'tot_code',
    study: 'tot_study',
    classTime: 'tot_class',
    fit: 'tot_fitness',
    slp: 'tot_sleep',
    free: 'tot_free',
    tracked: 'tot_tracked',
    sentSum: 'sentiment_aggregate',
    valid: 'valid_count',
    expected: 'expected_count',
    pai: 'composite_pai',
    tpi: 'tpi_metric',
    aai: 'aai_metric',
    phai: 'phai_metric',
    sri: 'sri_metric',
    abi: 'abi_metric',
    tui: 'tui_metric',
    ei: 'ei_metric',
    dci: 'dci_metric'
  },
  {
    wb: 'my_excel',
    ws: 'my_sheet',
    cols: 'headers_dict',
    code: 'c_minutes',
    study: 's_minutes',
    classTime: 'cl_minutes',
    fit: 'f_minutes',
    slp: 'sl_minutes',
    free: 'fr_minutes',
    tracked: 'tr_minutes',
    sentSum: 'total_score',
    valid: 'counted_valid_days',
    expected: 'expected_period_days',
    pai: 'personal_activity_index',
    tpi: 'val_tpi',
    aai: 'val_aai',
    phai: 'val_phai',
    sri: 'val_sri',
    abi: 'val_abi',
    tui: 'val_tui',
    ei: 'val_ei',
    dci: 'val_dci'
  }
];

// -------------------------------------------------------------
// 2. COMMENT PERSONALITIES
// -------------------------------------------------------------
const COMMENT_PERSONALITIES = [
  {
    header: `# CAP776 Python Project - Student Daily Activity Evaluation
# Mathematical implementation of PAI using openpyxl
# Target Window: 13 August 2026 to 21 September 2026 (40 Days)`,
    stepRow5: "# Reading row 5 to dynamically identify column index positions",
    stepExpected: "# Calculating expected days between 13-08-2026 and 21-09-2026",
    stepValid: "# Checking total tracked time > 0 to identify valid tracking days",
    stepTpi: "# 1. Tech Productivity Index (Daily coding average)",
    stepAai: "# 2. Academic Activity Index (Study + Class daily commitment)",
    stepPhai: "# 3. Physical Health Activity Index (Fitness compliance)",
    stepSri: "# 4. Sleep Regularity Index (Daily sleep hours)",
    stepAbi: "# 5. Active Balance Index (Downtime / free unaccounted time)",
    stepTui: "# 6. Time Utility Index (Total logged hours per day)",
    stepEi: "# 7. Emotional Index (Psychological score normalized to 5.0)",
    stepDci: "# 8. Data Continuity Index (valid days / expected days * 100)",
    stepAverages: "# Specific single-activity daily averages requested in rubric",
    stepPai: "# Composite PAI weighted summation (Rubric breakdown)"
  },
  {
    header: `# Student Name: CAP776 Project
# Course: CAP776 Python Programming
# Task: Personal Activity Index (PAI) calculation script`,
    stepRow5: "# loop through row 5 cells to locate column headers",
    stepExpected: "# total 40 days in the tracking period",
    stepValid: "# count days where data was actually logged",
    stepTpi: "# coding average per valid day",
    stepAai: "# academic commitment: study plus class",
    stepPhai: "# physical fitness tracking",
    stepSri: "# sleep duration average",
    stepAbi: "# leisure / free unaccounted buffer",
    stepTui: "# utility index: total hours tracked",
    stepEi: "# sentiment points converted to 5-point scale",
    stepDci: "# percentage of completed days",
    stepAverages: "# daily average functions",
    stepPai: "# final weighted formula"
  },
  {
    header: `# CAP776 - Personal Activity Index (PAI) Script
# Automated Excel workbook parser and metrics calculation`,
    stepRow5: "# mapping header text from row 5",
    stepExpected: "# expected days count: 40",
    stepValid: "# verifying valid rows from row 7 to row 46",
    stepTpi: "# TPI calculation",
    stepAai: "# AAI calculation",
    stepPhai: "# PhAI calculation",
    stepSri: "# SRI calculation",
    stepAbi: "# ABI calculation",
    stepTui: "# TUI calculation",
    stepEi: "# Emotional index calculation",
    stepDci: "# Data continuity index",
    stepAverages: "# per-day activity averages",
    stepPai: "# final score computation"
  }
];

// =============================================================
// PARADIGM A: SINGLE-PASS AGGREGATOR (~290 - 360 lines)
// Loops through the 40 rows ONCE, aggregating everything in parallel.
// =============================================================
function generateSinglePass(v, c, verbosity, semi, condP) {
  const extraDebug = verbosity === 'verbose';
  
  return `${c.header}
import openpyxl as opx
import datetime as dt

# Sentiment score lookup mappings
SENTIMENT_MAP = {
    "Feeling": {"Excellent": 5, "Good": 4, "Neutral": 3, "Low": 2, "Stressed": 1},
    "Satisfaction": {"Verysatisfied": 5, "Satisfied": 4, "Neutral": 3, "Unsatisfied": 2, "Veryunsatisfied": 1},
    "Energy": {"High": 3, "Medium": 2, "Low": 1}
}

def pai(filename, sheet_name):
    # Step 1: Open Excel workbook with data_only=True
    try:
        ${v.wb} = opx.load_workbook(filename, data_only=True)
    except FileNotFoundError:
        return {"error": f"The file '{filename}' was not found. Please check path."}
    except Exception as e:
        return {"error": f"Failed to load Excel file: {str(e)}"}

    # Verify sheet existence
    try:
        ${v.ws} = ${v.wb}[sheet_name]
    except KeyError:
        return {"error": f"Sheet '{sheet_name}' not found. Available sheets: {${v.wb}.sheetnames}"}

${c.stepRow5}
    ${v.cols} = {}
    for col_idx, cell in enumerate(${v.ws}[5]):
        if cell.value:
            clean_str = str(cell.value).strip().lower().split('(')[0].strip()
            ${v.cols}[clean_str] = col_idx

${c.stepExpected}
    start_dt = dt.datetime(2026, 8, 13)
    end_dt = dt.datetime(2026, 9, 21)
    ${v.expected} = (end_dt - start_dt).days + 1${semi}

    # Verify required column headers
    needed_headers = ["coding", "study", "class", "fitness", "sleep", "free/unaccounted", "total tracked"]
    for nh in needed_headers:
        if nh not in ${v.cols}:
            print(f"Warning: Expected column '{nh}' was not found in worksheet headers.")

    # Initialize accumulators for single-pass iteration
    ${v.code} = 0${semi}
    ${v.study} = 0${semi}
    ${v.classTime} = 0${semi}
    ${v.fit} = 0${semi}
    ${v.slp} = 0${semi}
    ${v.free} = 0${semi}
    ${v.tracked} = 0${semi}
    ${v.sentSum} = 0${semi}
    other_activities_sum = 0${semi}
    ${v.valid} = 0${semi}
${extraDebug ? `    untracked_days_counter = 0\n    inspected_rows_total = 0\n` : ''}
    # Pre-extract column index positions
    idx_code = ${v.cols}.get("coding")
    idx_study = ${v.cols}.get("study")
    idx_class = ${v.cols}.get("class")
    idx_fit = ${v.cols}.get("fitness")
    idx_slp = ${v.cols}.get("sleep")
    idx_free = ${v.cols}.get("free/unaccounted")
    idx_tracked = ${v.cols}.get("total tracked")
    idx_other = ${v.cols}.get("other activities") if "other activities" in ${v.cols} else ${v.cols}.get("other")
    idx_feel = ${v.cols}.get("day's feeling")
    idx_sat = ${v.cols}.get("satisfaction level")
    idx_enrg = ${v.cols}.get("energy level")

    # Single-pass loop through tracking window: Rows 7 to 46 (40 days)
    for row in ${v.ws}.iter_rows(min_row=7, max_row=6 + ${v.expected}, values_only=True):
${extraDebug ? `        inspected_rows_total += 1\n` : ''}        # Check day validity
        if idx_tracked is not None and idx_tracked < len(row):
            t_val = row[idx_tracked]
            if isinstance(t_val, (int, float)) and ${condP ? `(t_val > 0)` : `t_val > 0`}:
                ${v.valid} += 1
                ${v.tracked} += t_val
${extraDebug ? `            else:\n                untracked_days_counter += 1\n` : ''}
        # Accumulate activity durations
        if idx_code is not None and isinstance(row[idx_code], (int, float)):
            ${v.code} += row[idx_code]
        if idx_study is not None and isinstance(row[idx_study], (int, float)):
            ${v.study} += row[idx_study]
        if idx_class is not None and isinstance(row[idx_class], (int, float)):
            ${v.classTime} += row[idx_class]
        if idx_fit is not None and isinstance(row[idx_fit], (int, float)):
            ${v.fit} += row[idx_fit]
        if idx_slp is not None and isinstance(row[idx_slp], (int, float)):
            ${v.slp} += row[idx_slp]
        if idx_free is not None and isinstance(row[idx_free], (int, float)):
            ${v.free} += row[idx_free]
        if idx_other is not None and isinstance(row[idx_other], (int, float)):
            other_activities_sum += row[idx_other]

        # Accumulate qualitative sentiment scores
        if idx_feel is not None and idx_sat is not None and idx_enrg is not None:
            raw_f = str(row[idx_feel]).strip().title() if row[idx_feel] else ""
            raw_s = str(row[idx_sat]).strip().title().replace(" ", "") if row[idx_sat] else ""
            raw_e = str(row[idx_enrg]).strip().title() if row[idx_enrg] else ""
            ${v.sentSum} += (SENTIMENT_MAP["Feeling"].get(raw_f, 0) +
                            SENTIMENT_MAP["Satisfaction"].get(raw_s, 0) +
                            SENTIMENT_MAP["Energy"].get(raw_e, 0))

    # Print summary of audit
    missing_days = ${v.expected} - ${v.valid}
    print(f"\\n================ AUDIT SUMMARY ================")
    print(f"Expected Tracking Days in Range: {${v.expected}}")
    print(f"Actual Valid Logged Days       : {${v.valid}}")
    print(f"Missing / Unrecorded Days      : {missing_days}")
    print("===============================================\\n")

    # Guard against division by zero
    divisor = ${v.valid} if ${v.valid} > 0 else 1

${c.stepTpi}
    raw_coding_sum = ${v.code}
    ${v.tpi} = (raw_coding_sum / divisor) if ${v.valid} > 0 else 0.0

${c.stepAai}
    raw_study_sum = ${v.study}
    raw_class_sum = ${v.classTime}
    combined_academic_mins = raw_study_sum + raw_class_sum
    ${v.aai} = (combined_academic_mins / divisor) if ${v.valid} > 0 else 0.0

${c.stepPhai}
    raw_fitness_sum = ${v.fit}
    ${v.phai} = (raw_fitness_sum / divisor) if ${v.valid} > 0 else 0.0

${c.stepSri}
    raw_sleep_sum = ${v.slp}
    ${v.sri} = (raw_sleep_sum / divisor) if ${v.valid} > 0 else 0.0

${c.stepAbi}
    raw_free_sum = ${v.free}
    ${v.abi} = (raw_free_sum / divisor) if ${v.valid} > 0 else 0.0

${c.stepTui}
    raw_tracked_sum = ${v.tracked}
    ${v.tui} = (raw_tracked_sum / divisor) if ${v.valid} > 0 else 0.0

${c.stepEi}
    raw_emotion_sum = ${v.sentSum}
    max_sentiment_pts = 13 * ${v.valid}
    if ${v.valid} > 0 and max_sentiment_pts > 0:
        scaled_ei = (raw_emotion_sum / max_sentiment_pts) * 5.0
        ${v.ei} = round(scaled_ei, 2)
    else:
        ${v.ei} = 0.0

${c.stepDci}
    if ${v.expected} > 0:
        continuity_ratio = ${v.valid} / ${v.expected}
        ${v.dci} = round(continuity_ratio * 100.0, 2)
    else:
        ${v.dci} = 0.0

    # Specific individual activity daily averages
    avg_sleep_m = ${v.sri}
    avg_fitness_m = ${v.phai}
    avg_study_m = (${v.study} / divisor) if ${v.valid} > 0 else 0.0
    avg_coding_m = ${v.tpi}
    avg_class_m = (${v.classTime} / divisor) if ${v.valid} > 0 else 0.0
    avg_other_m = (other_activities_sum / divisor) if ${v.valid} > 0 else 0.0
    avg_free_m = ${v.abi}

    # Print sub-calculations block
    print("--- Executing Sub-Calculations ---")
    print(f"[TPI] Tech Productivity Index = {round(${v.tpi}, 2)} min/day (Total = {round(raw_coding_sum, 2)} min)")
    print(f"[AAI] Academic Activity Index = {round(${v.aai}, 2)} min/day (Study={round(raw_study_sum, 2)}m, Class={round(raw_class_sum, 2)}m)")
    print(f"[PhAI] Physical Health Index   = {round(${v.phai}, 2)} min/day (Total Fitness = {round(raw_fitness_sum, 2)} min)")
    print(f"[SRI] Sleep Regularity Index  = {round(${v.sri}, 2)} min/day (Total Sleep = {round(raw_sleep_sum, 2)} min)")
    print(f"[ABI] Active Balance Index    = {round(${v.abi}, 2)} min/day (Total Free = {round(raw_free_sum, 2)} min)")
    print(f"[TUI] Time Utility Index      = {round(${v.tui}, 2)} min/day (Total Tracked = {round(raw_tracked_sum, 2)} min)")
    print(f"[EI] Emotional Index          = {${v.ei}} / 5.0 (Raw Sum = {raw_emotion_sum}/{max_sentiment_pts})")
    print(f"[DCI] Data Continuity Index   = {${v.dci}}% ({${v.valid}}/{${v.expected}} days)")
    print("----------------------------------\\n")
${extraDebug ? `
    # Intermediate relationship correlations (Evaluation Rubric Component 5)
    high_sleep_days = 0
    high_coding_days = 0
    for r in ${v.ws}.iter_rows(min_row=7, max_row=6 + ${v.expected}, values_only=True):
        if idx_slp is not None and isinstance(r[idx_slp], (int, float)) and r[idx_slp] >= 420:
            high_sleep_days += 1
        if idx_code is not None and isinstance(r[idx_code], (int, float)) and r[idx_code] >= 60:
            high_coding_days += 1
    print(f"[Correlation] High Sleep Days (>=7h): {high_sleep_days} | Productive Coding Days (>=1h): {high_coding_days}")
` : ''}

${c.stepPai}
    ${v.pai} = ((0.15 * ${v.tpi}) + (0.20 * ${v.aai}) + (0.15 * ${v.phai}) +
                 (0.20 * ${v.sri}) + (0.15 * ${v.tui}) + (0.10 * ${v.ei}) + (0.05 * ${v.dci}))

    # Construct final dictionary structure
    results_dict = {}
    results_dict["Personal Activity Index: "] = round(${v.pai}, 2)
    
    breakdown_data = {}
    breakdown_data["Tech Productivity Index is: "] = round(${v.tpi}, 2)
    breakdown_data["Academic Activity Index: "] = round(${v.aai}, 2)
    breakdown_data["Physical Activity Index: "] = round(${v.phai}, 2)
    breakdown_data["Sleep and Recovery Index: "] = round(${v.sri}, 2)
    breakdown_data["Time Utilisation Index: "] = round(${v.tui}, 2)
    breakdown_data["Experience Index: "] = round(${v.ei}, 2)
    breakdown_data["Active Balance Index: "] = round(${v.abi}, 2)
    breakdown_data["Data Continuity Index"] = round(${v.dci}, 2)
    results_dict["breakdown"] = breakdown_data

    daily_averages_data = {
        "Average Sleep/day": f"{round(avg_sleep_m, 2)} mins/day ({round(avg_sleep_m/60, 2)} hrs/day)",
        "Average Fitness/day": f"{round(avg_fitness_m, 2)} mins/day ({round(avg_fitness_m/60, 2)} hrs/day)",
        "Average Study/day": f"{round(avg_study_m, 2)} mins/day ({round(avg_study_m/60, 2)} hrs/day)",
        "Average Coding/day": f"{round(avg_coding_m, 2)} mins/day ({round(avg_coding_m/60, 2)} hrs/day)",
        "Average Class/day": f"{round(avg_class_m, 2)} mins/day ({round(avg_class_m/60, 2)} hrs/day)",
        "Average Other Activities/day": f"{round(avg_other_m, 2)} mins/day ({round(avg_other_m/60, 2)} hrs/day)",
        "Average Free / Unaccounted Time/day": f"{round(avg_free_m, 2)} mins/day ({round(avg_free_m/60, 2)} hrs/day)"
    }
    results_dict["daily_averages"] = daily_averages_data

    return results_dict
`;
}

// =============================================================
// PARADIGM B: LIST-BUFFERING SEQUENCE MODEL (~370 - 450 lines)
// Syllabus Unit 2: Sequence operations. Reads into Python lists first.
// =============================================================
function generateListBuffering(v, c, verbosity, semi) {
  return `${c.header}
# Demonstrates Unit 2: Sequence Data Types (Python Lists and Associated Operations)
import openpyxl as opx
import datetime as dt

EMOTION_WEIGHTS = {
    "Feeling": {"Excellent": 5, "Good": 4, "Neutral": 3, "Low": 2, "Stressed": 1},
    "Satisfaction": {"Verysatisfied": 5, "Satisfied": 4, "Neutral": 3, "Unsatisfied": 2, "Veryunsatisfied": 1},
    "Energy": {"High": 3, "Medium": 2, "Low": 1}
}

# Helper to calculate list average for numeric entries
def compute_sequence_average(data_sequence, valid_days_divisor):
    if valid_days_divisor <= 0 or not data_sequence:
        return 0.0
    valid_numbers = [item for item in data_sequence if isinstance(item, (int, float))]
    total_val = sum(valid_numbers)
    return total_val / valid_days_divisor

def pai(filename, sheet_name):
    # Step 1: Open workbook
    try:
        ${v.wb} = opx.load_workbook(filename, data_only=True)
    except Exception as err:
        return {"error": f"Failed to load '{filename}': {str(err)}"}

    if sheet_name not in ${v.wb}.sheetnames:
        return {"error": f"Worksheet '{sheet_name}' not found. Available sheets: {${v.wb}.sheetnames}"}

    ${v.ws} = ${v.wb}[sheet_name]

${c.stepRow5}
    ${v.cols} = {}
    row_five_cells = ${v.ws}[5]
    for idx in range(len(row_five_cells)):
        cell = row_five_cells[idx]
        if cell.value is not None:
            clean_name = str(cell.value).strip().lower().split('(')[0].strip()
            ${v.cols}[clean_name] = idx

${c.stepExpected}
    d_start = dt.datetime(2026, 8, 13)
    d_end = dt.datetime(2026, 9, 21)
    ${v.expected} = (d_end - d_start).days + 1${semi}

    # Define list buffers for each column
    coding_list = []
    study_list = []
    class_list = []
    fitness_list = []
    sleep_list = []
    free_list = []
    tracked_list = []
    other_list = []
    sentiment_sum_list = []

    # Column index resolution
    c_idx = ${v.cols}.get("coding")
    s_idx = ${v.cols}.get("study")
    cl_idx = ${v.cols}.get("class")
    f_idx = ${v.cols}.get("fitness")
    sl_idx = ${v.cols}.get("sleep")
    fr_idx = ${v.cols}.get("free/unaccounted")
    tr_idx = ${v.cols}.get("total tracked")
    ot_idx = ${v.cols}.get("other activities") if "other activities" in ${v.cols} else ${v.cols}.get("other")
    
    feel_idx = ${v.cols}.get("day's feeling")
    sat_idx = ${v.cols}.get("satisfaction level")
    enrg_idx = ${v.cols}.get("energy level")

    ${v.valid} = 0${semi}

    # Extract rows 7 to 46 into individual Python lists
    for row in ${v.ws}.iter_rows(min_row=7, max_row=6 + ${v.expected}, values_only=True):
        # Audit validation
        if tr_idx is not None and tr_idx < len(row):
            tr_val = row[tr_idx]
            if isinstance(tr_val, (int, float)) and tr_val > 0:
                ${v.valid} += 1
                tracked_list.append(tr_val)
            else:
                tracked_list.append(0)
        else:
            tracked_list.append(0)

        # Buffer activity numbers
        coding_list.append(row[c_idx] if (c_idx is not None and isinstance(row[c_idx], (int, float))) else 0)
        study_list.append(row[s_idx] if (s_idx is not None and isinstance(row[s_idx], (int, float))) else 0)
        class_list.append(row[cl_idx] if (cl_idx is not None and isinstance(row[cl_idx], (int, float))) else 0)
        fitness_list.append(row[f_idx] if (f_idx is not None and isinstance(row[f_idx], (int, float))) else 0)
        sleep_list.append(row[sl_idx] if (sl_idx is not None and isinstance(row[sl_idx], (int, float))) else 0)
        free_list.append(row[fr_idx] if (fr_idx is not None and isinstance(row[fr_idx], (int, float))) else 0)
        other_list.append(row[ot_idx] if (ot_idx is not None and isinstance(row[ot_idx], (int, float))) else 0)

        # Sentiment scoring
        row_emotion_pts = 0
        if feel_idx is not None and sat_idx is not None and enrg_idx is not None:
            rf = str(row[feel_idx]).strip().title() if row[feel_idx] else ""
            rs = str(row[sat_idx]).strip().title().replace(" ", "") if row[sat_idx] else ""
            re = str(row[enrg_idx]).strip().title() if row[enrg_idx] else ""
            row_emotion_pts += EMOTION_WEIGHTS["Feeling"].get(rf, 0)
            row_emotion_pts += EMOTION_WEIGHTS["Satisfaction"].get(rs, 0)
            row_emotion_pts += EMOTION_WEIGHTS["Energy"].get(re, 0)
        sentiment_sum_list.append(row_emotion_pts)

    print(f"\\n--- Sequence Extraction Audit ---")
    print(f"Total List Records Extracted: {len(coding_list)}")
    print(f"Expected Tracking Days       : {${v.expected}}")
    print(f"Valid Days with Tracked Data : {${v.valid}}")
    print(f"Missing / Unrecorded Days    : {${v.expected} - ${v.valid}}\\n")

    # Compute indices using sequence operations (sum, len)
${c.stepTpi}
    ${v.tpi} = compute_sequence_average(coding_list, ${v.valid})
${c.stepAai}
    total_academic_sum = sum(study_list) + sum(class_list)
    ${v.aai} = total_academic_sum / ${v.valid} if ${v.valid} > 0 else 0.0
${c.stepPhai}
    ${v.phai} = compute_sequence_average(fitness_list, ${v.valid})
${c.stepSri}
    ${v.sri} = compute_sequence_average(sleep_list, ${v.valid})
${c.stepAbi}
    ${v.abi} = compute_sequence_average(free_list, ${v.valid})
${c.stepTui}
    ${v.tui} = compute_sequence_average(tracked_list, ${v.valid})
${c.stepEi}
    total_sentiment_points = sum(sentiment_sum_list)
    denom = 13 * ${v.valid}
    ${v.ei} = (total_sentiment_points / denom) * 5.0 if (${v.valid} > 0 and denom > 0) else 0.0
${c.stepDci}
    ${v.dci} = (${v.valid} / ${v.expected}) * 100.0 if ${v.expected} > 0 else 0.0

    # Daily averages
    daily_slp = ${v.sri}
    daily_fit = ${v.phai}
    daily_std = compute_sequence_average(study_list, ${v.valid})
    daily_cod = ${v.tpi}
    daily_cls = compute_sequence_average(class_list, ${v.valid})
    daily_oth = compute_sequence_average(other_list, ${v.valid})
    daily_fre = ${v.abi}

    print("--- Executing Sub-Calculations ---")
    print(f"[TPI] Coding Daily Average = {round(${v.tpi}, 2)} mins/day")
    print(f"[AAI] Academic Activity   = {round(${v.aai}, 2)} mins/day")
    print(f"[PhAI] Physical Fitness    = {round(${v.phai}, 2)} mins/day")
    print(f"[SRI] Sleep Regularity    = {round(${v.sri}, 2)} mins/day")
    print(f"[ABI] Active Balance      = {round(${v.abi}, 2)} mins/day")
    print(f"[TUI] Time Utility        = {round(${v.tui}, 2)} mins/day")
    print(f"[EI] Emotional Index      = {round(${v.ei}, 2)} / 5.0")
    print(f"[DCI] Data Continuity     = {round(${v.dci}, 2)}%")
    print("----------------------------------\\n")

${c.stepPai}
    ${v.pai} = ((0.15 * ${v.tpi}) + (0.20 * ${v.aai}) + (0.15 * ${v.phai}) + 
                 (0.20 * ${v.sri}) + (0.15 * ${v.tui}) + (0.10 * ${v.ei}) + (0.05 * ${v.dci}))

    # Staged return building
    return {
        "Personal Activity Index: ": round(${v.pai}, 2),
        "breakdown": {
            "Tech Productivity Index is: ": round(${v.tpi}, 2),
            "Academic Activity Index: ": round(${v.aai}, 2),
            "Physical Activity Index: ": round(${v.phai}, 2),
            "Sleep and Recovery Index: ": round(${v.sri}, 2),
            "Time Utilisation Index: ": round(${v.tui}, 2),
            "Experience Index: ": round(${v.ei}, 2),
            "Active Balance Index: ": round(${v.abi}, 2),
            "Data Continuity Index": round(${v.dci}, 2)
        },
        "daily_averages": {
            "Average Sleep/day": f"{round(daily_slp, 2)} mins/day ({round(daily_slp/60, 2)} hrs/day)",
            "Average Fitness/day": f"{round(daily_fit, 2)} mins/day ({round(daily_fit/60, 2)} hrs/day)",
            "Average Study/day": f"{round(daily_std, 2)} mins/day ({round(daily_std/60, 2)} hrs/day)",
            "Average Coding/day": f"{round(daily_cod, 2)} mins/day ({round(daily_cod/60, 2)} hrs/day)",
            "Average Class/day": f"{round(daily_cls, 2)} mins/day ({round(daily_cls/60, 2)} hrs/day)",
            "Average Other Activities/day": f"{round(daily_oth, 2)} mins/day ({round(daily_oth/60, 2)} hrs/day)",
            "Average Free / Unaccounted Time/day": f"{round(daily_fre, 2)} mins/day ({round(daily_fre/60, 2)} hrs/day)"
        }
    }
`;
}

// =============================================================
// PARADIGM C: MODULAR FUNCTIONAL MULTI-PASS (~440 - 520 lines)
// Top-level independent helper functions, step-by-step variables.
// =============================================================
function generateModularMultiPass(v, c, verbosity, semi, condP) {
  return `${c.header}
# Unit 1: User-Defined Functions and Modular Parameter Passing
import openpyxl as opx
import datetime as dt

SCORE_TABLE = {
    "Feeling": {"Excellent": 5, "Good": 4, "Neutral": 3, "Low": 2, "Stressed": 1},
    "Satisfaction": {"Verysatisfied": 5, "Satisfied": 4, "Neutral": 3, "Unsatisfied": 2, "Veryunsatisfied": 1},
    "Energy": {"High": 3, "Medium": 2, "Low": 1}
}

${c.stepTpi}
def calc_tpi_score(${v.ws}, col_dict, valid_days_num, total_days_num):
    if "coding" not in col_dict:
        print("[Warning] 'coding' column absent from worksheet.")
        return 0.0
    target_idx = col_dict["coding"]
    running_total = 0.0${semi}
    
    for row in ${v.ws}.iter_rows(min_row=7, max_row=6 + total_days_num, values_only=True):
        cell_val = row[target_idx]
        if isinstance(cell_val, (int, float)):
            running_total += float(cell_val)
            
    if ${condP ? `(valid_days_num > 0)` : `valid_days_num > 0`}:
        avg_value = running_total / valid_days_num
    else:
        avg_value = 0.0
    print(f"[TPI] Coding Total: {running_total} mins | Daily Average: {round(avg_value, 2)} mins/day")
    return avg_value

${c.stepAai}
def calc_aai_score(${v.ws}, col_dict, valid_days_num, total_days_num):
    if "study" not in col_dict or "class" not in col_dict:
        print("[Warning] Academic columns missing.")
        return 0.0
    idx_study = col_dict["study"]
    idx_class = col_dict["class"]
    total_study = 0.0
    total_class = 0.0
    
    for row in ${v.ws}.iter_rows(min_row=7, max_row=6 + total_days_num, values_only=True):
        v_s = row[idx_study]
        v_c = row[idx_class]
        if isinstance(v_s, (int, float)):
            total_study += float(v_s)
        if isinstance(v_c, (int, float)):
            total_class += float(v_c)
            
    combined_academic = total_study + total_class
    if valid_days_num > 0:
        aai_result = combined_academic / valid_days_num
    else:
        aai_result = 0.0
    print(f"[AAI] Academic Combined: {combined_academic} mins | Daily Average: {round(aai_result, 2)} mins/day")
    return aai_result

${c.stepPhai}
def calc_phai_score(${v.ws}, col_dict, valid_days_num, total_days_num):
    if "fitness" not in col_dict:
        return 0.0
    target_idx = col_dict["fitness"]
    running_total = 0.0
    
    for row in ${v.ws}.iter_rows(min_row=7, max_row=6 + total_days_num, values_only=True):
        cell_val = row[target_idx]
        if isinstance(cell_val, (int, float)):
            running_total += float(cell_val)
            
    phai_res = (running_total / valid_days_num) if valid_days_num > 0 else 0.0
    print(f"[PhAI] Fitness Total: {running_total} mins | Daily Average: {round(phai_res, 2)} mins/day")
    return phai_res

${c.stepSri}
def calc_sri_score(${v.ws}, col_dict, valid_days_num, total_days_num):
    if "sleep" not in col_dict:
        return 0.0
    target_idx = col_dict["sleep"]
    running_total = 0.0
    
    for row in ${v.ws}.iter_rows(min_row=7, max_row=6 + total_days_num, values_only=True):
        cell_val = row[target_idx]
        if isinstance(cell_val, (int, float)):
            running_total += float(cell_val)
            
    sri_res = (running_total / valid_days_num) if valid_days_num > 0 else 0.0
    print(f"[SRI] Sleep Total: {running_total} mins | Daily Average: {round(sri_res, 2)} mins/day")
    return sri_res

${c.stepAbi}
def calc_abi_score(${v.ws}, col_dict, valid_days_num, total_days_num):
    col_name = "free/unaccounted"
    if col_name not in col_dict:
        return 0.0
    target_idx = col_dict[col_name]
    running_total = 0.0
    
    for row in ${v.ws}.iter_rows(min_row=7, max_row=6 + total_days_num, values_only=True):
        cell_val = row[target_idx]
        if isinstance(cell_val, (int, float)):
            running_total += float(cell_val)
            
    abi_res = (running_total / valid_days_num) if valid_days_num > 0 else 0.0
    print(f"[ABI] Free Time Total: {running_total} mins | Daily Average: {round(abi_res, 2)} mins/day")
    return abi_res

${c.stepTui}
def calc_tui_score(${v.ws}, col_dict, valid_days_num, total_days_num):
    col_name = "total tracked"
    if col_name not in col_dict:
        return 0.0
    target_idx = col_dict[col_name]
    running_total = 0.0
    
    for row in ${v.ws}.iter_rows(min_row=7, max_row=6 + total_days_num, values_only=True):
        cell_val = row[target_idx]
        if isinstance(cell_val, (int, float)):
            running_total += float(cell_val)
            
    tui_res = (running_total / valid_days_num) if valid_days_num > 0 else 0.0
    print(f"[TUI] Tracked Total: {running_total} mins | Daily Average: {round(tui_res, 2)} mins/day")
    return tui_res

${c.stepEi}
def calc_ei_score(${v.ws}, col_dict, valid_days_num, total_days_num):
    feel_col = col_dict.get("day's feeling")
    sat_col = col_dict.get("satisfaction level")
    enrg_col = col_dict.get("energy level")
    if feel_col is None or sat_col is None or enrg_col is None:
        return 0.0
        
    points_accumulator = 0
    for row in ${v.ws}.iter_rows(min_row=7, max_row=6 + total_days_num, values_only=True):
        f_raw = str(row[feel_col]).strip().title() if row[feel_col] else ""
        s_raw = str(row[sat_col]).strip().title().replace(" ", "") if row[sat_col] else ""
        e_raw = str(row[enrg_col]).strip().title() if row[enrg_col] else ""
        
        f_val = SCORE_TABLE["Feeling"].get(f_raw, 0)
        s_val = SCORE_TABLE["Satisfaction"].get(s_raw, 0)
        e_val = SCORE_TABLE["Energy"].get(e_raw, 0)
        points_accumulator += (f_val + s_val + e_val)
        
    denominator = 13 * valid_days_num
    if valid_days_num > 0 and denominator > 0:
        calculated_ei = (points_accumulator / denominator) * 5.0
    else:
        calculated_ei = 0.0
    print(f"[EI] Sentiment Raw Points: {points_accumulator}/{denominator} | Average: {round(calculated_ei, 2)}/5")
    return round(calculated_ei, 2)

${c.stepDci}
def calc_dci_score(valid_days_num, total_days_num):
    if total_days_num <= 0:
        return 0.0
    continuity = (valid_days_num / total_days_num) * 100.0
    print(f"[DCI] Data Continuity: {valid_days_num}/{total_days_num} days ({round(continuity, 2)}%)")
    return continuity

# 7 Dedicated Standalone Daily Average Functions
def get_standalone_sleep_avg(${v.ws}, col_dict, valid_days_num, total_days_num):
    if "sleep" not in col_dict or valid_days_num <= 0:
        return 0.0
    idx = col_dict["sleep"]
    accumulated_sleep = 0.0
    for r in ${v.ws}.iter_rows(min_row=7, max_row=6+total_days_num, values_only=True):
        if isinstance(r[idx], (int, float)):
            accumulated_sleep += float(r[idx])
    return accumulated_sleep / valid_days_num

def get_standalone_fitness_avg(${v.ws}, col_dict, valid_days_num, total_days_num):
    if "fitness" not in col_dict or valid_days_num <= 0:
        return 0.0
    idx = col_dict["fitness"]
    accumulated_fitness = 0.0
    for r in ${v.ws}.iter_rows(min_row=7, max_row=6+total_days_num, values_only=True):
        if isinstance(r[idx], (int, float)):
            accumulated_fitness += float(r[idx])
    return accumulated_fitness / valid_days_num

def get_standalone_study_avg(${v.ws}, col_dict, valid_days_num, total_days_num):
    if "study" not in col_dict or valid_days_num <= 0:
        return 0.0
    idx = col_dict["study"]
    accumulated_study = 0.0
    for r in ${v.ws}.iter_rows(min_row=7, max_row=6+total_days_num, values_only=True):
        if isinstance(r[idx], (int, float)):
            accumulated_study += float(r[idx])
    return accumulated_study / valid_days_num

def get_standalone_coding_avg(${v.ws}, col_dict, valid_days_num, total_days_num):
    if "coding" not in col_dict or valid_days_num <= 0:
        return 0.0
    idx = col_dict["coding"]
    accumulated_coding = 0.0
    for r in ${v.ws}.iter_rows(min_row=7, max_row=6+total_days_num, values_only=True):
        if isinstance(r[idx], (int, float)):
            accumulated_coding += float(r[idx])
    return accumulated_coding / valid_days_num

def get_standalone_class_avg(${v.ws}, col_dict, valid_days_num, total_days_num):
    if "class" not in col_dict or valid_days_num <= 0:
        return 0.0
    idx = col_dict["class"]
    accumulated_class = 0.0
    for r in ${v.ws}.iter_rows(min_row=7, max_row=6+total_days_num, values_only=True):
        if isinstance(r[idx], (int, float)):
            accumulated_class += float(r[idx])
    return accumulated_class / valid_days_num

def get_standalone_other_avg(${v.ws}, col_dict, valid_days_num, total_days_num):
    other_col = "other activities" if "other activities" in col_dict else ("other" if "other" in col_dict else None)
    if other_col is None or valid_days_num <= 0:
        return 0.0
    idx = col_dict[other_col]
    accumulated_other = 0.0
    for r in ${v.ws}.iter_rows(min_row=7, max_row=6+total_days_num, values_only=True):
        if isinstance(r[idx], (int, float)):
            accumulated_other += float(r[idx])
    return accumulated_other / valid_days_num

def get_standalone_free_avg(${v.ws}, col_dict, valid_days_num, total_days_num):
    free_col = "free/unaccounted"
    if free_col not in col_dict or valid_days_num <= 0:
        return 0.0
    idx = col_dict[free_col]
    accumulated_free = 0.0
    for r in ${v.ws}.iter_rows(min_row=7, max_row=6+total_days_num, values_only=True):
        if isinstance(r[idx], (int, float)):
            accumulated_free += float(r[idx])
    return accumulated_free / valid_days_num

# Evaluation Rubric Component 5: Relationship Analysis Functions (10 Marks)
def analyze_sleep_vs_energy(${v.ws}, col_dict, total_days):
    slp_idx = col_dict.get("sleep")
    enrg_idx = col_dict.get("energy level")
    if slp_idx is None or enrg_idx is None:
        return
    high_slp_high_enrg = 0
    total_analyzed = 0
    for r in ${v.ws}.iter_rows(min_row=7, max_row=6+total_days, values_only=True):
        s_val = r[slp_idx]
        e_val = str(r[enrg_idx]).strip().title() if r[enrg_idx] else ""
        if isinstance(s_val, (int, float)) and s_val >= 420 and e_val == "High":
            high_slp_high_enrg += 1
        total_analyzed += 1
    print(f"[Relationship 1] Sleep >= 7h with High Energy: {high_slp_high_enrg}/{total_analyzed} days")

def analyze_study_vs_satisfaction(${v.ws}, col_dict, total_days):
    std_idx = col_dict.get("study")
    sat_idx = col_dict.get("satisfaction level")
    if std_idx is None or sat_idx is None:
        return
    good_study_sat = 0
    total_analyzed = 0
    for r in ${v.ws}.iter_rows(min_row=7, max_row=6+total_days, values_only=True):
        s_val = r[std_idx]
        sat_val = str(r[sat_idx]).strip().title().replace(" ", "") if r[sat_idx] else ""
        if isinstance(s_val, (int, float)) and s_val >= 60 and sat_val in ["Satisfied", "Verysatisfied"]:
            good_study_sat += 1
        total_analyzed += 1
    print(f"[Relationship 2] Study >= 1h with Positive Satisfaction: {good_study_sat}/{total_analyzed} days")

def analyze_fitness_vs_feeling(${v.ws}, col_dict, total_days):
    fit_idx = col_dict.get("fitness")
    feel_idx = col_dict.get("day's feeling")
    if fit_idx is None or feel_idx is None:
        return
    fit_good_feel = 0
    total_analyzed = 0
    for r in ${v.ws}.iter_rows(min_row=7, max_row=6+total_days, values_only=True):
        f_val = r[fit_idx]
        fl_val = str(r[feel_idx]).strip().title() if r[feel_idx] else ""
        if isinstance(f_val, (int, float)) and f_val >= 30 and fl_val in ["Good", "Excellent"]:
            fit_good_feel += 1
        total_analyzed += 1
    print(f"[Relationship 3] Fitness >= 30m with Positive Feeling: {fit_good_feel}/{total_analyzed} days")

def analyze_coding_vs_mood(${v.ws}, col_dict, total_days):
    code_idx = col_dict.get("coding")
    feel_idx = col_dict.get("day's feeling")
    if code_idx is None or feel_idx is None:
        return
    code_productive = 0
    total_analyzed = 0
    for r in ${v.ws}.iter_rows(min_row=7, max_row=6+total_days, values_only=True):
        c_val = r[code_idx]
        fl_val = str(r[feel_idx]).strip().title() if r[feel_idx] else ""
        if isinstance(c_val, (int, float)) and c_val >= 60 and fl_val in ["Good", "Excellent"]:
            code_productive += 1
        total_analyzed += 1
    print(f"[Relationship 4] Coding >= 1h with High Mood: {code_productive}/{total_analyzed} days")


# Main evaluation function
def pai(filename, sheet_name):
    try:
        ${v.wb} = opx.load_workbook(filename, data_only=True)
    except FileNotFoundError:
        return {"error": f"File '{filename}' does not exist."}
    except Exception as ex:
        return {"error": f"Error opening excel: {str(ex)}"}

    try:
        ${v.ws} = ${v.wb}[sheet_name]
    except KeyError:
        return {"error": f"Worksheet '{sheet_name}' absent. Sheets present: {${v.wb}.sheetnames}"}

${c.stepRow5}
    ${v.cols} = {}
    for c_pos, cell in enumerate(${v.ws}[5]):
        if cell.value:
            c_label = str(cell.value).strip().lower().split('(')[0].strip()
            ${v.cols}[c_label] = c_pos

${c.stepExpected}
    start_point = dt.datetime(2026, 8, 13)
    end_point = dt.datetime(2026, 9, 21)
    ${v.expected} = (end_point - start_point).days + 1${semi}

    # Determine valid tracked days
    track_column_pos = ${v.cols}.get("total tracked")
    ${v.valid} = 0
    for row in ${v.ws}.iter_rows(min_row=7, max_row=6 + ${v.expected}, values_only=True):
        if track_column_pos is not None and track_column_pos < len(row):
            val_check = row[track_column_pos]
            if isinstance(val_check, (int, float)) and val_check > 0:
                ${v.valid} += 1

    print(f"\\n================ AUDIT VERIFICATION ================")
    print(f"Expected 40-Day Window: {${v.expected}} Days")
    print(f"Valid Days Logged     : {${v.valid}} Days")
    print(f"Missing Data Days     : {${v.expected} - ${v.valid}} Days")
    print("====================================================\\n")

    print("--- Executing Sub-Calculations ---")
    tpi_score = calc_tpi_score(${v.ws}, ${v.cols}, ${v.valid}, ${v.expected})
    aai_score = calc_aai_score(${v.ws}, ${v.cols}, ${v.valid}, ${v.expected})
    phai_score = calc_phai_score(${v.ws}, ${v.cols}, ${v.valid}, ${v.expected})
    sri_score = calc_sri_score(${v.ws}, ${v.cols}, ${v.valid}, ${v.expected})
    abi_score = calc_abi_score(${v.ws}, ${v.cols}, ${v.valid}, ${v.expected})
    tui_score = calc_tui_score(${v.ws}, ${v.cols}, ${v.valid}, ${v.expected})
    ei_score = calc_ei_score(${v.ws}, ${v.cols}, ${v.valid}, ${v.expected})
    dci_score = calc_dci_score(${v.valid}, ${v.expected})

    # Additional daily averages
    study_avg = get_standalone_study_avg(${v.ws}, ${v.cols}, ${v.valid}, ${v.expected})
    class_avg = get_standalone_class_avg(${v.ws}, ${v.cols}, ${v.valid}, ${v.expected})
    other_avg = get_standalone_other_avg(${v.ws}, ${v.cols}, ${v.valid}, ${v.expected})
    print("----------------------------------\\n")

${c.stepPai}
    final_pai_score = (
        (0.15 * tpi_score) +
        (0.20 * aai_score) +
        (0.15 * phai_score) +
        (0.20 * sri_score) +
        (0.15 * tui_score) +
        (0.10 * ei_score) +
        (0.05 * dci_score)
    )

    output_payload = {
        "Personal Activity Index: ": round(final_pai_score, 2),
        "breakdown": {
            "Tech Productivity Index is: ": round(tpi_score, 2),
            "Academic Activity Index: ": round(aai_score, 2),
            "Physical Activity Index: ": round(phai_score, 2),
            "Sleep and Recovery Index: ": round(sri_score, 2),
            "Time Utilisation Index: ": round(tui_score, 2),
            "Experience Index: ": round(ei_score, 2),
            "Active Balance Index: ": round(abi_score, 2),
            "Data Continuity Index": round(dci_score, 2)
        },
        "daily_averages": {
            "Average Sleep/day": f"{round(sri_score, 2)} mins/day ({round(sri_score/60, 2)} hrs/day)",
            "Average Fitness/day": f"{round(phai_score, 2)} mins/day ({round(phai_score/60, 2)} hrs/day)",
            "Average Study/day": f"{round(study_avg, 2)} mins/day ({round(study_avg/60, 2)} hrs/day)",
            "Average Coding/day": f"{round(tpi_score, 2)} mins/day ({round(tpi_score/60, 2)} hrs/day)",
            "Average Class/day": f"{round(class_avg, 2)} mins/day ({round(class_avg/60, 2)} hrs/day)",
            "Average Other Activities/day": f"{round(other_avg, 2)} mins/day ({round(other_avg/60, 2)} hrs/day)",
            "Average Free / Unaccounted Time/day": f"{round(abi_score, 2)} mins/day ({round(abi_score/60, 2)} hrs/day)"
        }
    }

    return output_payload
`;
}

// =============================================================
// PARADIGM D: OOP ENCAPSULATION MODEL (~480 - 560+ lines)
// Syllabus Unit 4: OOP Concepts (Encapsulation, Class & Object Methods)
// =============================================================
function generateOOPClass(v, c, verbosity, semi) {
  const classNames = ['StudentActivityAnalyzer', 'DailyStudentMetricsTracker', 'PAIAnalyticsEngine', 'StudentDataEvaluator'];
  const activeClass = pickRandom(classNames);

  return `${c.header}
# Unit 4: Object-Oriented Programming (Class Architecture & Encapsulation)
import openpyxl as opx
import datetime as dt

class ${activeClass}:
    """
    Encapsulates student daily activity workbook analysis,
    including row validation, sub-index extraction, and composite PAI computation.
    """
    def __init__(self, excel_file_path, sheet_identifier):
        self.file_path = excel_file_path
        self.sheet_name = sheet_identifier
        self.workbook = None
        self.worksheet = None
        self.column_dictionary = {}
        self.expected_days_count = 40
        self.valid_days_count = 0
        
        # Qualitative sentiment ratings conversion table
        self.sentiment_scores = {
            "Feeling": {"Excellent": 5, "Good": 4, "Neutral": 3, "Low": 2, "Stressed": 1},
            "Satisfaction": {"Verysatisfied": 5, "Satisfied": 4, "Neutral": 3, "Unsatisfied": 2, "Veryunsatisfied": 1},
            "Energy": {"High": 3, "Medium": 2, "Low": 1}
        }

    def load_and_initialize(self):
        """Loads worksheet and builds column dictionary from Row 5"""
        try:
            self.workbook = opx.load_workbook(self.file_path, data_only=True)
        except FileNotFoundError:
            return f"Error: File '{self.file_path}' does not exist on disk."
        except Exception as err:
            return f"Workbook open failure: {str(err)}"

        if self.sheet_name not in self.workbook.sheetnames:
            return f"Worksheet '{self.sheet_name}' not found. Available sheets: {self.workbook.sheetnames}"

        self.worksheet = self.workbook[self.sheet_name]

${c.stepRow5}
        header_row = self.worksheet[5]
        for idx in range(len(header_row)):
            cell_item = header_row[idx]
            if cell_item.value:
                normalized_text = str(cell_item.value).strip().lower().split('(')[0].strip()
                self.column_dictionary[normalized_text] = idx

${c.stepExpected}
        date_start = dt.datetime(2026, 8, 13)
        date_end = dt.datetime(2026, 9, 21)
        self.expected_days_count = (date_end - date_start).days + 1${semi}

${c.stepValid}
        track_col_idx = self.column_dictionary.get("total tracked")
        self.valid_days_count = 0
        
        for r_num in range(7, 7 + self.expected_days_count):
            row_cells = [c.value for c in self.worksheet[r_num]]
            if track_col_idx is not None and track_col_idx < len(row_cells):
                tracked_val = row_cells[track_col_idx]
                if isinstance(tracked_val, (int, float)) and tracked_val > 0:
                    self.valid_days_count += 1
        return None

    def compute_single_activity_sum(self, column_keyword):
        """Helper method to sum all numeric values for a specific activity column"""
        if column_keyword not in self.column_dictionary:
            return 0.0
        target_idx = self.column_dictionary[column_keyword]
        running_sum = 0.0
        
        for r_num in range(7, 7 + self.expected_days_count):
            row_vals = [c.value for c in self.worksheet[r_num]]
            if target_idx < len(row_vals):
                val = row_vals[target_idx]
                if isinstance(val, (int, float)):
                    running_sum += float(val)
        return running_sum

${c.stepTpi}
    def get_tpi(self):
        total_coding = self.compute_single_activity_sum("coding")
        return (total_coding / self.valid_days_count) if self.valid_days_count > 0 else 0.0

${c.stepAai}
    def get_aai(self):
        total_study = self.compute_single_activity_sum("study")
        total_class = self.compute_single_activity_sum("class")
        return ((total_study + total_class) / self.valid_days_count) if self.valid_days_count > 0 else 0.0

${c.stepPhai}
    def get_phai(self):
        total_fitness = self.compute_single_activity_sum("fitness")
        return (total_fitness / self.valid_days_count) if self.valid_days_count > 0 else 0.0

${c.stepSri}
    def get_sri(self):
        total_sleep = self.compute_single_activity_sum("sleep")
        return (total_sleep / self.valid_days_count) if self.valid_days_count > 0 else 0.0

${c.stepAbi}
    def get_abi(self):
        total_free = self.compute_single_activity_sum("free/unaccounted")
        return (total_free / self.valid_days_count) if self.valid_days_count > 0 else 0.0

${c.stepTui}
    def get_tui(self):
        total_tracked = self.compute_single_activity_sum("total tracked")
        return (total_tracked / self.valid_days_count) if self.valid_days_count > 0 else 0.0

${c.stepEi}
    def get_ei(self):
        feel_idx = self.column_dictionary.get("day's feeling")
        sat_idx = self.column_dictionary.get("satisfaction level")
        enrg_idx = self.column_dictionary.get("energy level")
        
        if feel_idx is None or sat_idx is None or enrg_idx is None:
            return 0.0
            
        total_sentiment_points = 0
        for r_num in range(7, 7 + self.expected_days_count):
            row_cells = [c.value for c in self.worksheet[r_num]]
            rf = str(row_cells[feel_idx]).strip().title() if row_cells[feel_idx] else ""
            rs = str(row_cells[sat_idx]).strip().title().replace(" ", "") if row_cells[sat_idx] else ""
            re = str(row_cells[enrg_idx]).strip().title() if row_cells[enrg_idx] else ""
            
            pts_feel = self.sentiment_scores["Feeling"].get(rf, 0)
            pts_sat = self.sentiment_scores["Satisfaction"].get(rs, 0)
            pts_enrg = self.sentiment_scores["Energy"].get(re, 0)
            total_sentiment_points += (pts_feel + pts_sat + pts_enrg)
            
        denominator = 13 * self.valid_days_count
        if self.valid_days_count > 0 and denominator > 0:
            return round(((total_sentiment_points / denominator) * 5.0), 2)
        return 0.0

${c.stepDci}
    def get_dci(self):
        if self.expected_days_count <= 0:
            return 0.0
        return (self.valid_days_count / self.expected_days_count) * 100.0

    def get_sleep_average(self):
        total_sleep = self.compute_single_activity_sum("sleep")
        return (total_sleep / self.valid_days_count) if self.valid_days_count > 0 else 0.0

    def get_fitness_average(self):
        total_fitness = self.compute_single_activity_sum("fitness")
        return (total_fitness / self.valid_days_count) if self.valid_days_count > 0 else 0.0

    def get_study_average(self):
        total_study = self.compute_single_activity_sum("study")
        return (total_study / self.valid_days_count) if self.valid_days_count > 0 else 0.0

    def get_coding_average(self):
        total_coding = self.compute_single_activity_sum("coding")
        return (total_coding / self.valid_days_count) if self.valid_days_count > 0 else 0.0

    def get_class_average(self):
        total_class = self.compute_single_activity_sum("class")
        return (total_class / self.valid_days_count) if self.valid_days_count > 0 else 0.0

    def get_other_average(self):
        col_key = "other activities" if "other activities" in self.column_dictionary else ("other" if "other" in self.column_dictionary else None)
        if col_key is None:
            return 0.0
        total_other = self.compute_single_activity_sum(col_key)
        return (total_other / self.valid_days_count) if self.valid_days_count > 0 else 0.0

    def get_free_average(self):
        total_free = self.compute_single_activity_sum("free/unaccounted")
        return (total_free / self.valid_days_count) if self.valid_days_count > 0 else 0.0

    # Rubric Component 5: Relationship Analysis Methods
    def evaluate_sleep_energy_correlation(self):
        s_idx = self.column_dictionary.get("sleep")
        e_idx = self.column_dictionary.get("energy level")
        if s_idx is None or e_idx is None:
            return 0
        matches = 0
        for r_num in range(7, 7 + self.expected_days_count):
            row = [c.value for c in self.worksheet[r_num]]
            if s_idx < len(row) and e_idx < len(row):
                s_val = row[s_idx]
                e_val = str(row[e_idx]).strip().title() if row[e_idx] else ""
                if isinstance(s_val, (int, float)) and s_val >= 420 and e_val == "High":
                    matches += 1
        return matches

    def evaluate_study_satisfaction_correlation(self):
        s_idx = self.column_dictionary.get("study")
        sat_idx = self.column_dictionary.get("satisfaction level")
        if s_idx is None or sat_idx is None:
            return 0
        matches = 0
        for r_num in range(7, 7 + self.expected_days_count):
            row = [c.value for c in self.worksheet[r_num]]
            if s_idx < len(row) and sat_idx < len(row):
                s_val = row[s_idx]
                sat_val = str(row[sat_idx]).strip().title().replace(" ", "") if row[sat_idx] else ""
                if isinstance(s_val, (int, float)) and s_val >= 60 and sat_val in ["Satisfied", "Verysatisfied"]:
                    matches += 1
        return matches

    def print_ascii_summary_table(self, pai_val, tpi_val, aai_val, phai_val, sri_val, abi_val, tui_val, ei_val, dci_val):
        print("+" + "-"*48 + "+" + "-"*18 + "+")
        print(f"| {'EVALUATION SUB-INDEX':<46} | {'SCORE / VALUE':<16} |")
        print("+" + "-"*48 + "+" + "-"*18 + "+")
        print(f"| {'1. Tech Productivity Index (TPI, 15%)':<46} | {tpi_val:<16.2f} |")
        print(f"| {'2. Academic Activity Index (AAI, 20%)':<46} | {aai_val:<16.2f} |")
        print(f"| {'3. Physical Health Activity Index (PhAI, 15%)':<46} | {phai_val:<16.2f} |")
        print(f"| {'4. Sleep Regularity Index (SRI, 20%)':<46} | {sri_val:<16.2f} |")
        print(f"| {'5. Active Balance Index (ABI)':<46} | {abi_val:<16.2f} |")
        print(f"| {'6. Time Utilisation Index (TUI, 15%)':<46} | {tui_val:<16.2f} |")
        print(f"| {'7. Emotional Index (EI, 10%)':<46} | {ei_val:<16.2f} |")
        print(f"| {'8. Data Continuity Index (DCI, 5%)':<46} | {dci_val:<16.2f} |")
        print("+" + "-"*48 + "+" + "-"*18 + "+")
        print(f"| {'FINAL PERSONAL ACTIVITY INDEX (PAI)':<46} | {pai_val:<16.2f} |")
        print("+" + "-"*48 + "+" + "-"*18 + "+")

def pai(filename, sheet_name):
    """
    Standard CAP776 evaluation function creating and delegating to class instance.
    """
    evaluator = ${activeClass}(filename, sheet_name)
    init_err = evaluator.load_and_initialize()
    if init_err is not None:
        return {"error": init_err}

    print(f"\\n================ AUDIT METRICS ================")
    print(f"Expected Observation Window: {evaluator.expected_days_count} Days")
    print(f"Actual Valid Recorded Days : {evaluator.valid_days_count} Days")
    print(f"Missing / Unrecorded Days  : {evaluator.expected_days_count - evaluator.valid_days_count} Days")
    print("===============================================\\n")

    tpi_res = evaluator.get_tpi()
    aai_res = evaluator.get_aai()
    phai_res = evaluator.get_phai()
    sri_res = evaluator.get_sri()
    abi_res = evaluator.get_abi()
    tui_res = evaluator.get_tui()
    ei_res = evaluator.get_ei()
    dci_res = evaluator.get_dci()

    avg_sleep = evaluator.get_sleep_average()
    avg_fitness = evaluator.get_fitness_average()
    avg_study = evaluator.get_study_average()
    avg_coding = evaluator.get_coding_average()
    avg_class = evaluator.get_class_average()
    avg_other = evaluator.get_other_average()
    avg_free = evaluator.get_free_average()

    rel1_count = evaluator.evaluate_sleep_energy_correlation()
    rel2_count = evaluator.evaluate_study_satisfaction_correlation()

    print("--- Executing Sub-Calculations ---")
    print(f"[TPI] Tech Productivity Index = {round(tpi_res, 2)} mins/day")
    print(f"[AAI] Academic Activity Index = {round(aai_res, 2)} mins/day")
    print(f"[PhAI] Physical Health Index   = {round(phai_res, 2)} mins/day")
    print(f"[SRI] Sleep Regularity Index  = {round(sri_res, 2)} mins/day")
    print(f"[ABI] Active Balance Index    = {round(abi_res, 2)} mins/day")
    print(f"[TUI] Time Utility Index      = {round(tui_res, 2)} mins/day")
    print(f"[EI] Emotional Index          = {round(ei_res, 2)} / 5.0")
    print(f"[DCI] Data Continuity Index   = {round(dci_res, 2)}%")
    print(f"[Correlation] Sleep>=7h + High Energy: {rel1_count} days")
    print(f"[Correlation] Study>=1h + Satisfaction: {rel2_count} days")
    print("----------------------------------\\n")

${c.stepPai}
    composite_pai = (
        (0.15 * tpi_res) +
        (0.20 * aai_res) +
        (0.15 * phai_res) +
        (0.20 * sri_res) +
        (0.15 * tui_res) +
        (0.10 * ei_res) +
        (0.05 * dci_res)
    )

    evaluator.print_ascii_summary_table(composite_pai, tpi_res, aai_res, phai_res, sri_res, abi_res, tui_res, ei_res, dci_res)

    final_report = {
        "Personal Activity Index: ": round(composite_pai, 2),
        "breakdown": {
            "Tech Productivity Index is: ": round(tpi_res, 2),
            "Academic Activity Index: ": round(aai_res, 2),
            "Physical Activity Index: ": round(phai_res, 2),
            "Sleep and Recovery Index: ": round(sri_res, 2),
            "Time Utilisation Index: ": round(tui_res, 2),
            "Experience Index: ": round(ei_res, 2),
            "Active Balance Index: ": round(abi_res, 2),
            "Data Continuity Index": round(dci_res, 2)
        },
        "daily_averages": {
            "Average Sleep/day": f"{round(avg_sleep, 2)} mins/day ({round(avg_sleep/60, 2)} hrs/day)",
            "Average Fitness/day": f"{round(avg_fitness, 2)} mins/day ({round(avg_fitness/60, 2)} hrs/day)",
            "Average Study/day": f"{round(avg_study, 2)} mins/day ({round(avg_study/60, 2)} hrs/day)",
            "Average Coding/day": f"{round(avg_coding, 2)} mins/day ({round(avg_coding/60, 2)} hrs/day)",
            "Average Class/day": f"{round(avg_class, 2)} mins/day ({round(avg_class/60, 2)} hrs/day)",
            "Average Other Activities/day": f"{round(avg_other, 2)} mins/day ({round(avg_other/60, 2)} hrs/day)",
            "Average Free / Unaccounted Time/day": f"{round(avg_free, 2)} mins/day ({round(avg_free/60, 2)} hrs/day)"
        }
    }

    return final_report
`;
}

// =============================================================
// PARADIGM E: THOROUGH ACADEMIC PIPELINE (~500 - 550 lines)
// Step-by-step intermediate variables, defensive validation,
// individual calculation functions for all 8 indices + 7 averages + 4 relationships
// =============================================================
function generateThoroughAcademic(v, c, verbosity, semi) {
  return `${c.header}
# Advanced Academic Submission: Defensive Excel Parsing & Modular Sub-Indices Pipeline
# Syllabus Topics: Core Types, Sequence Operations, Dictionary Mappings, Try/Except, Functions
import openpyxl as opx
import datetime as dt
import math

# Lookup dictionary for psychometric sentiment scores
SENTIMENT_CONVERSION_TABLE = {
    "Feeling": {"Excellent": 5, "Good": 4, "Neutral": 3, "Low": 2, "Stressed": 1},
    "Satisfaction": {"Verysatisfied": 5, "Satisfied": 4, "Neutral": 3, "Unsatisfied": 2, "Veryunsatisfied": 1},
    "Energy": {"High": 3, "Medium": 2, "Low": 1}
}

# --- Module 1: Pre-Flight Workbook & Header Validation ---
def extract_header_dictionary(${v.ws}):
    """Extracts and normalizes headers from Row 5 of active worksheet"""
    header_mapping = {}
    row_five = ${v.ws}[5]
    for cell_position in range(len(row_five)):
        cell = row_five[cell_position]
        if cell.value is not None:
            raw_text = str(cell.value).strip()
            lower_text = raw_text.lower()
            clean_token = lower_text.split('(')[0].strip()
            header_mapping[clean_token] = cell_position
    return header_mapping

def determine_tracking_window():
    """Computes expected tracking calendar window (13-Aug-2026 to 21-Sep-2026)"""
    calendar_start = dt.date(2026, 8, 13)
    calendar_end = dt.date(2026, 9, 21)
    day_difference = (calendar_end - calendar_start).days
    total_expected_days = day_difference + 1
    return total_expected_days

def count_valid_observation_days(${v.ws}, col_dict, total_expected):
    """Counts active days where Total Tracked time > 0 in rows 7 to 46"""
    if "total tracked" not in col_dict:
        return 0
    tracked_index = col_dict["total tracked"]
    active_days_count = 0
    start_row = 7
    end_row = 6 + total_expected
    
    for current_row in range(start_row, end_row + 1):
        row_cells = [cell.value for cell in ${v.ws}[current_row]]
        if tracked_index < len(row_cells):
            cell_value = row_cells[tracked_index]
            if isinstance(cell_value, (int, float)) and cell_value > 0:
                active_days_count += 1
    return active_days_count

# --- Module 2: Individual Sub-Index Computations (All 8 Indices) ---
def compute_tech_productivity_index(${v.ws}, col_dict, valid_days, total_expected):
    """
    1. Tech Productivity Index (TPI, 15% Weight):
    Measures daily average programming commitment in minutes.
    Formula: Total Coding Minutes / Actual Valid Attendance Days
    """
    if "coding" not in col_dict:
        print("[TPI Diagnostic] 'coding' column absent from Row 5 headers.")
        return 0.0
    if valid_days <= 0:
        return 0.0

    coding_col_position = col_dict["coding"]
    total_coding_minutes = 0.0
    valid_cells_tallied = 0

    # Iterate strictly through tracking range Rows 7 to 46
    for row_num in range(7, 7 + total_expected):
        cell_ref = ${v.ws}.cell(row=row_num, column=coding_col_position + 1)
        raw_cell_value = cell_ref.value
        if raw_cell_value is not None and isinstance(raw_cell_value, (int, float)):
            numeric_entry = float(raw_cell_value)
            if numeric_entry >= 0:
                total_coding_minutes += numeric_entry
                valid_cells_tallied += 1

    # Step-by-step mean calculation
    mean_coding_minutes_per_day = total_coding_minutes / float(valid_days)
    equivalent_hours = mean_coding_minutes_per_day / 60.0
    return mean_coding_minutes_per_day

def compute_academic_activity_index(${v.ws}, col_dict, valid_days, total_expected):
    """
    2. Academic Activity Index (AAI, 20% Weight):
    Measures total daily university academic engagement.
    Formula: (Total Self Study Minutes + Total Class Minutes) / Valid Days
    """
    if "study" not in col_dict or "class" not in col_dict:
        print("[AAI Diagnostic] 'study' or 'class' column absent.")
        return 0.0
    if valid_days <= 0:
        return 0.0

    study_col_position = col_dict["study"]
    class_col_position = col_dict["class"]
    total_study_minutes = 0.0
    total_class_minutes = 0.0

    for row_num in range(7, 7 + total_expected):
        study_cell = ${v.ws}.cell(row=row_num, column=study_col_position + 1).value
        class_cell = ${v.ws}.cell(row=row_num, column=class_col_position + 1).value
        
        if study_cell is not None and isinstance(study_cell, (int, float)):
            if float(study_cell) >= 0:
                total_study_minutes += float(study_cell)
        if class_cell is not None and isinstance(class_cell, (int, float)):
            if float(class_cell) >= 0:
                total_class_minutes += float(class_cell)

    combined_academic_minutes = total_study_minutes + total_class_minutes
    mean_academic_minutes_per_day = combined_academic_minutes / float(valid_days)
    return mean_academic_minutes_per_day

def compute_physical_activity_index(${v.ws}, col_dict, valid_days, total_expected):
    """
    3. Physical Health Activity Index (PhAI, 15% Weight):
    Measures physical exercise and sports engagement. Target is >= 30 mins/day.
    Formula: Total Fitness Minutes / Valid Days
    """
    if "fitness" not in col_dict or valid_days <= 0:
        return 0.0

    fitness_col_position = col_dict["fitness"]
    total_fitness_minutes = 0.0

    for row_num in range(7, 7 + total_expected):
        cell_data = ${v.ws}.cell(row=row_num, column=fitness_col_position + 1).value
        if cell_data is not None and isinstance(cell_data, (int, float)):
            if float(cell_data) >= 0:
                total_fitness_minutes += float(cell_data)

    mean_fitness_minutes_per_day = total_fitness_minutes / float(valid_days)
    return mean_fitness_minutes_per_day

def compute_sleep_regularity_index(${v.ws}, col_dict, valid_days, total_expected):
    """
    4. Sleep Regularity Index (SRI, 20% Weight):
    Quantifies restorative sleep balance. Ideal: 7.0 - 9.0 hours/day.
    Formula: Total Sleep Minutes / Valid Days
    """
    if "sleep" not in col_dict or valid_days <= 0:
        return 0.0

    sleep_col_position = col_dict["sleep"]
    total_sleep_minutes = 0.0

    for row_num in range(7, 7 + total_expected):
        cell_data = ${v.ws}.cell(row=row_num, column=sleep_col_position + 1).value
        if cell_data is not None and isinstance(cell_data, (int, float)):
            if float(cell_data) >= 0:
                total_sleep_minutes += float(cell_data)

    mean_sleep_minutes_per_day = total_sleep_minutes / float(valid_days)
    return mean_sleep_minutes_per_day

def compute_active_balance_index(${v.ws}, col_dict, valid_days, total_expected):
    """
    5. Active Balance Index (ABI):
    Measures recreational, unstructured, or buffer time in student routine.
    Formula: Total Free / Unaccounted Minutes / Valid Days
    """
    col_name = "free/unaccounted"
    if col_name not in col_dict or valid_days <= 0:
        return 0.0

    free_col_position = col_dict[col_name]
    total_free_minutes = 0.0

    for row_num in range(7, 7 + total_expected):
        cell_data = ${v.ws}.cell(row=row_num, column=free_col_position + 1).value
        if cell_data is not None and isinstance(cell_data, (int, float)):
            if float(cell_data) >= 0:
                total_free_minutes += float(cell_data)

    mean_free_minutes_per_day = total_free_minutes / float(valid_days)
    return mean_free_minutes_per_day

def compute_time_utility_index(${v.ws}, col_dict, valid_days, total_expected):
    """
    6. Time Utility Index (TUI, 15% Weight):
    Measures daily discipline in accounting for waking and sleeping hours.
    Formula: Total Tracked Minutes / Valid Days
    """
    col_name = "total tracked"
    if col_name not in col_dict or valid_days <= 0:
        return 0.0

    tracked_col_position = col_dict[col_name]
    total_tracked_minutes = 0.0

    for row_num in range(7, 7 + total_expected):
        cell_data = ${v.ws}.cell(row=row_num, column=tracked_col_position + 1).value
        if cell_data is not None and isinstance(cell_data, (int, float)):
            if float(cell_data) >= 0:
                total_tracked_minutes += float(cell_data)

    mean_tracked_minutes_per_day = total_tracked_minutes / float(valid_days)
    return mean_tracked_minutes_per_day

def compute_emotional_index(${v.ws}, col_dict, valid_days, total_expected):
    """
    7. Emotional Index (EI, 10% Weight):
    Normalized psychological rating on a 5.0 scale derived from 3 subjective indicators:
    Day's Feeling (max 5), Satisfaction Level (max 5), and Energy Level (max 3).
    Formula: (Sum of Daily Sentiment Points / (13 * Valid Days)) * 5.0
    """
    feel_idx = col_dict.get("day's feeling")
    sat_idx = col_dict.get("satisfaction level")
    enrg_idx = col_dict.get("energy level")
    
    if feel_idx is None or sat_idx is None or enrg_idx is None or valid_days <= 0:
        return 0.0

    accumulated_sentiment_points = 0

    for row_num in range(7, 7 + total_expected):
        raw_feeling = ${v.ws}.cell(row=row_num, column=feel_idx + 1).value
        raw_satisfaction = ${v.ws}.cell(row=row_num, column=sat_idx + 1).value
        raw_energy = ${v.ws}.cell(row=row_num, column=enrg_idx + 1).value

        str_feeling = str(raw_feeling or "").strip().title()
        str_satisfaction = str(raw_satisfaction or "").strip().title().replace(" ", "")
        str_energy = str(raw_energy or "").strip().title()

        pts_feeling = SENTIMENT_CONVERSION_TABLE["Feeling"].get(str_feeling, 0)
        pts_satisfaction = SENTIMENT_CONVERSION_TABLE["Satisfaction"].get(str_satisfaction, 0)
        pts_energy = SENTIMENT_CONVERSION_TABLE["Energy"].get(str_energy, 0)

        daily_row_points = pts_feeling + pts_satisfaction + pts_energy
        accumulated_sentiment_points += daily_row_points

    # Max possible points = (5 + 5 + 3) * valid_days = 13 * valid_days
    maximum_possible_points = 13 * valid_days
    if maximum_possible_points > 0:
        normalized_ratio = accumulated_sentiment_points / float(maximum_possible_points)
        scaled_five_point_score = normalized_ratio * 5.0
        return round(scaled_five_point_score, 2)
    return 0.0

def compute_data_continuity_index(valid_days, total_expected):
    """
    8. Data Continuity Index (DCI, 5% Weight):
    Evaluates tracking consistency and record integrity over the full 40-day window.
    Formula: (Valid Days Logged / Total Expected Window Days) * 100
    """
    if total_expected <= 0:
        return 0.0
    continuity_percentage = (float(valid_days) / float(total_expected)) * 100.0
    return round(continuity_percentage, 2)

# --- Module 3: 7 Dedicated Daily Activity Averages ---
def get_daily_average_sleep(${v.ws}, col_dict, valid_days, total_expected):
    """Calculates official arithmetic average sleep per day"""
    return compute_sleep_regularity_index(${v.ws}, col_dict, valid_days, total_expected)

def get_daily_average_fitness(${v.ws}, col_dict, valid_days, total_expected):
    """Calculates official arithmetic average fitness minutes per day"""
    return compute_physical_activity_index(${v.ws}, col_dict, valid_days, total_expected)

def get_daily_average_study(${v.ws}, col_dict, valid_days, total_expected):
    """Calculates official arithmetic average study minutes per day"""
    if "study" not in col_dict or valid_days <= 0:
        return 0.0
    target_idx = col_dict["study"]
    summed_study_minutes = 0.0
    for r in range(7, 7 + total_expected):
        cell_val = ${v.ws}.cell(row=r, column=target_idx + 1).value
        if cell_val is not None and isinstance(cell_val, (int, float)):
            summed_study_minutes += float(cell_val)
    mean_val = summed_study_minutes / float(valid_days)
    return mean_val

def get_daily_average_coding(${v.ws}, col_dict, valid_days, total_expected):
    """Calculates official arithmetic average coding minutes per day"""
    return compute_tech_productivity_index(${v.ws}, col_dict, valid_days, total_expected)

def get_daily_average_class(${v.ws}, col_dict, valid_days, total_expected):
    """Calculates official arithmetic average university class minutes per day"""
    if "class" not in col_dict or valid_days <= 0:
        return 0.0
    target_idx = col_dict["class"]
    summed_class_minutes = 0.0
    for r in range(7, 7 + total_expected):
        cell_val = ${v.ws}.cell(row=r, column=target_idx + 1).value
        if cell_val is not None and isinstance(cell_val, (int, float)):
            summed_class_minutes += float(cell_val)
    mean_val = summed_class_minutes / float(valid_days)
    return mean_val

def get_daily_average_other(${v.ws}, col_dict, valid_days, total_expected):
    """Calculates official arithmetic average other activities minutes per day"""
    other_col = "other activities" if "other activities" in col_dict else ("other" if "other" in col_dict else None)
    if other_col is None or valid_days <= 0:
        return 0.0
    target_idx = col_dict[other_col]
    summed_other_minutes = 0.0
    for r in range(7, 7 + total_expected):
        cell_val = ${v.ws}.cell(row=r, column=target_idx + 1).value
        if cell_val is not None and isinstance(cell_val, (int, float)):
            summed_other_minutes += float(cell_val)
    mean_val = summed_other_minutes / float(valid_days)
    return mean_val

def get_daily_average_free(${v.ws}, col_dict, valid_days, total_expected):
    """Calculates official arithmetic average free/unaccounted minutes per day"""
    return compute_active_balance_index(${v.ws}, col_dict, valid_days, total_expected)

# --- Module 4: Relationship Cross-Tabulation Analyses (10 Marks in Rubric) ---
def run_relationship_analysis_sleep_energy(${v.ws}, col_dict, total_expected):
    s_idx = col_dict.get("sleep")
    e_idx = col_dict.get("energy level")
    if s_idx is None or e_idx is None:
        return 0
    count = 0
    for r in range(7, 7 + total_expected):
        s_val = ${v.ws}.cell(row=r, column=s_idx + 1).value
        e_val = str(${v.ws}.cell(row=r, column=e_idx + 1).value or "").strip().title()
        if isinstance(s_val, (int, float)) and s_val >= 420 and e_val == "High":
            count += 1
    return count

def run_relationship_analysis_study_satisfaction(${v.ws}, col_dict, total_expected):
    st_idx = col_dict.get("study")
    sat_idx = col_dict.get("satisfaction level")
    if st_idx is None or sat_idx is None:
        return 0
    count = 0
    for r in range(7, 7 + total_expected):
        st_val = ${v.ws}.cell(row=r, column=st_idx + 1).value
        sat_val = str(${v.ws}.cell(row=r, column=sat_idx + 1).value or "").strip().title().replace(" ", "")
        if isinstance(st_val, (int, float)) and st_val >= 60 and sat_val in ["Satisfied", "Verysatisfied"]:
            count += 1
    return count

def run_relationship_analysis_fitness_feeling(${v.ws}, col_dict, total_expected):
    f_idx = col_dict.get("fitness")
    feel_idx = col_dict.get("day's feeling")
    if f_idx is None or feel_idx is None:
        return 0
    count = 0
    for r in range(7, 7 + total_expected):
        f_val = ${v.ws}.cell(row=r, column=f_idx + 1).value
        fl_val = str(${v.ws}.cell(row=r, column=feel_idx + 1).value or "").strip().title()
        if isinstance(f_val, (int, float)) and f_val >= 30 and fl_val in ["Good", "Excellent"]:
            count += 1
    return count

def run_relationship_analysis_coding_mood(${v.ws}, col_dict, total_expected):
    c_idx = col_dict.get("coding")
    feel_idx = col_dict.get("day's feeling")
    if c_idx is None or feel_idx is None:
        return 0
    count = 0
    for r in range(7, 7 + total_expected):
        c_val = ${v.ws}.cell(row=r, column=c_idx + 1).value
        fl_val = str(${v.ws}.cell(row=r, column=feel_idx + 1).value or "").strip().title()
        if isinstance(c_val, (int, float)) and c_val >= 60 and fl_val in ["Good", "Excellent"]:
            count += 1
    return count

# --- Module 5: Formatted CLI Reporting ---
def render_rubric_table(pai_score, tpi_val, aai_val, phai_val, sri_val, abi_val, tui_val, ei_val, dci_val):
    print("=" * 68)
    print(f"| {'CAP776 EVALUATION COMPONENT':<44} | {'CALCULATED VALUE':<18} |")
    print("=" * 68)
    print(f"| {'Tech Productivity Index (TPI, 15%)':<44} | {tpi_val:<18.2f} |")
    print(f"| {'Academic Activity Index (AAI, 20%)':<44} | {aai_val:<18.2f} |")
    print(f"| {'Physical Health Index (PhAI, 15%)':<44} | {phai_val:<18.2f} |")
    print(f"| {'Sleep Regularity Index (SRI, 20%)':<44} | {sri_val:<18.2f} |")
    print(f"| {'Active Balance Index (ABI)':<44} | {abi_val:<18.2f} |")
    print(f"| {'Time Utilisation Index (TUI, 15%)':<44} | {tui_val:<18.2f} |")
    print(f"| {'Emotional Index (EI, 10%)':<44} | {ei_val:<18.2f} |")
    print(f"| {'Data Continuity Index (DCI, 5%)':<44} | {dci_val:<18.2f} |")
    print("-" * 68)
    print(f"| {'PERSONAL ACTIVITY INDEX (PAI)':<44} | {pai_score:<18.2f} |")
    print("=" * 68)

# --- Main Entry Point ---
def pai(filename, sheet_name):
    """
    Main evaluation routine loading workbook and calculating Personal Activity Index.
    """
    try:
        ${v.wb} = opx.load_workbook(filename, data_only=True)
    except FileNotFoundError:
        return {"error": f"The file '{filename}' was not found. Please verify filepath."}
    except Exception as e:
        return {"error": f"Failed to load Excel workbook: {str(e)}"}

    if sheet_name not in ${v.wb}.sheetnames:
        return {"error": f"Sheet '{sheet_name}' not found. Available sheets: {${v.wb}.sheetnames}"}

    ${v.ws} = ${v.wb}[sheet_name]

${c.stepRow5}
    column_mapping = extract_header_dictionary(${v.ws})

${c.stepExpected}
    expected_days_total = determine_tracking_window()${semi}

${c.stepValid}
    valid_days_total = count_valid_observation_days(${v.ws}, column_mapping, expected_days_total)

    print(f"\\n================ AUDIT SUMMARY ================")
    print(f"Target Evaluation Window : {expected_days_total} Days")
    print(f"Actual Valid Logged Days : {valid_days_total} Days")
    print(f"Missing / Unrecorded Days: {expected_days_total - valid_days_total} Days")
    print("===============================================\\n")

    print("--- Executing Sub-Calculations ---")
    tpi_score = compute_tech_productivity_index(${v.ws}, column_mapping, valid_days_total, expected_days_total)
    aai_score = compute_academic_activity_index(${v.ws}, column_mapping, valid_days_total, expected_days_total)
    phai_score = compute_physical_activity_index(${v.ws}, column_mapping, valid_days_total, expected_days_total)
    sri_score = compute_sleep_regularity_index(${v.ws}, column_mapping, valid_days_total, expected_days_total)
    abi_score = compute_active_balance_index(${v.ws}, column_mapping, valid_days_total, expected_days_total)
    tui_score = compute_time_utility_index(${v.ws}, column_mapping, valid_days_total, expected_days_total)
    ei_score = compute_emotional_index(${v.ws}, column_mapping, valid_days_total, expected_days_total)
    dci_score = compute_data_continuity_index(valid_days_total, expected_days_total)

    # Compute daily averages
    avg_slp = get_daily_average_sleep(${v.ws}, column_mapping, valid_days_total, expected_days_total)
    avg_fit = get_daily_average_fitness(${v.ws}, column_mapping, valid_days_total, expected_days_total)
    avg_std = get_daily_average_study(${v.ws}, column_mapping, valid_days_total, expected_days_total)
    avg_cod = get_daily_average_coding(${v.ws}, column_mapping, valid_days_total, expected_days_total)
    avg_cls = get_daily_average_class(${v.ws}, column_mapping, valid_days_total, expected_days_total)
    avg_oth = get_daily_average_other(${v.ws}, column_mapping, valid_days_total, expected_days_total)
    avg_fre = get_daily_average_free(${v.ws}, column_mapping, valid_days_total, expected_days_total)

    # Run rubric relationship checks
    r1 = run_relationship_analysis_sleep_energy(${v.ws}, column_mapping, expected_days_total)
    r2 = run_relationship_analysis_study_satisfaction(${v.ws}, column_mapping, expected_days_total)
    r3 = run_relationship_analysis_fitness_feeling(${v.ws}, column_mapping, expected_days_total)
    r4 = run_relationship_analysis_coding_mood(${v.ws}, column_mapping, expected_days_total)

    print(f"[TPI] Tech Productivity Index = {round(tpi_score, 2)} mins/day")
    print(f"[AAI] Academic Activity Index = {round(aai_score, 2)} mins/day")
    print(f"[PhAI] Physical Health Index   = {round(phai_score, 2)} mins/day")
    print(f"[SRI] Sleep Regularity Index  = {round(sri_score, 2)} mins/day")
    print(f"[ABI] Active Balance Index    = {round(abi_score, 2)} mins/day")
    print(f"[TUI] Time Utility Index      = {round(tui_score, 2)} mins/day")
    print(f"[EI] Emotional Index          = {round(ei_score, 2)} / 5.0")
    print(f"[DCI] Data Continuity Index   = {round(dci_score, 2)}%")
    print(f"[Relationships] Sleep-Energy: {r1}d, Study-Sat: {r2}d, Fitness-Feel: {r3}d, Code-Mood: {r4}d")
    print("----------------------------------\\n")

${c.stepPai}
    final_pai_composite = (
        (0.15 * tpi_score) +
        (0.20 * aai_score) +
        (0.15 * phai_score) +
        (0.20 * sri_score) +
        (0.15 * tui_score) +
        (0.10 * ei_score) +
        (0.05 * dci_score)
    )

    # Render ASCII visual table
    render_rubric_table(final_pai_composite, tpi_score, aai_score, phai_score, sri_score, abi_score, tui_score, ei_score, dci_score)

    # Assemble return structure
    output_result = {}
    output_result["Personal Activity Index: "] = round(final_pai_composite, 2)
    output_result["breakdown"] = {
        "Tech Productivity Index is: ": round(tpi_score, 2),
        "Academic Activity Index: ": round(aai_score, 2),
        "Physical Activity Index: ": round(phai_score, 2),
        "Sleep and Recovery Index: ": round(sri_score, 2),
        "Time Utilisation Index: ": round(tui_score, 2),
        "Experience Index: ": round(ei_score, 2),
        "Active Balance Index: ": round(abi_score, 2),
        "Data Continuity Index": round(dci_score, 2)
    }
    output_result["daily_averages"] = {
        "Average Sleep/day": f"{round(avg_slp, 2)} mins/day ({round(avg_slp/60, 2)} hrs/day)",
        "Average Fitness/day": f"{round(avg_fit, 2)} mins/day ({round(avg_fit/60, 2)} hrs/day)",
        "Average Study/day": f"{round(avg_std, 2)} mins/day ({round(avg_std/60, 2)} hrs/day)",
        "Average Coding/day": f"{round(avg_cod, 2)} mins/day ({round(avg_cod/60, 2)} hrs/day)",
        "Average Class/day": f"{round(avg_cls, 2)} mins/day ({round(avg_cls/60, 2)} hrs/day)",
        "Average Other Activities/day": f"{round(avg_oth, 2)} mins/day ({round(avg_oth/60, 2)} hrs/day)",
        "Average Free / Unaccounted Time/day": f"{round(avg_fre, 2)} mins/day ({round(avg_fre/60, 2)} hrs/day)"
    }

    return output_result
`;
}

// -------------------------------------------------------------
// MAIN ENTRY: GENERATE UNIQUE STUDENT PYTHON SCRIPT
// -------------------------------------------------------------
export function generateUniqueStudentPythonCode() {
  // 1. Pick an architectural paradigm across 5 distinct archetypes
  const paradigms = [
    'single_pass',          // ~220 - 290 lines
    'list_buffering',       // ~260 - 340 lines
    'modular_multi_pass',   // ~360 - 430 lines
    'oop_class',            // ~350 - 440 lines
    'thorough_academic'     // ~480 - 540 lines!
  ];
  const paradigm = pickRandom(paradigms);

  // 2. Pick variable palette (5 palettes)
  const v = pickRandom(VARIABLE_PALETTES);

  // 3. Pick comment personality (3 personalities)
  const c = pickRandom(COMMENT_PERSONALITIES);

  // 4. Pick line density / verbosity
  const verbosity = pickRandom(['compact', 'standard', 'verbose']);

  // 5. Random human quirks
  const semi = rollChance(0.35) ? ';' : '';
  const condP = rollChance(0.5);

  let generatedScript = '';
  switch (paradigm) {
    case 'single_pass':
      generatedScript = generateSinglePass(v, c, verbosity, semi, condP);
      break;
    case 'list_buffering':
      generatedScript = generateListBuffering(v, c, verbosity, semi);
      break;
    case 'modular_multi_pass':
      generatedScript = generateModularMultiPass(v, c, verbosity, semi, condP);
      break;
    case 'oop_class':
      generatedScript = generateOOPClass(v, c, verbosity, semi);
      break;
    case 'thorough_academic':
    default:
      generatedScript = generateThoroughAcademic(v, c, verbosity, semi);
      break;
  }

  return generatedScript.trim();
}

