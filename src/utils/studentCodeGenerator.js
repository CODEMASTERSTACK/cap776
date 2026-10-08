/**
 * CAP776 Student Python Code Generator
 *
 * Generates unique, student-authentic Python scripts that strictly follow
 * the teacher's mandated structure from project.py:
 *   - string_to_value dict at module level
 *   - All sub-index functions (tpi, aai, phai, sri, abi, tui, ei, dci) NESTED inside pai()
 *   - All avg functions also nested inside pai()
 *   - pai(filename, sheet_name) is the only top-level exported function
 *
 * Uniqueness: 5 variable palettes × 3 comment styles × style quirks ≈ 200+ variants
 * Target output: 200-250 lines per generated script.
 */

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function rollChance(prob = 0.5) {
    return Math.random() < prob;
}

// ---------------------------------------------------------------
// 1. VARIABLE NAMING PALETTES  (5 distinct student name styles)
// ---------------------------------------------------------------
const VARIABLE_PALETTES = [
    {
        wb: 'wb', ws: 'ws', cols: 'column_list',
        valid: 'valid_days', expected: 'expected_days',
        tpi: 'tpi_val', aai: 'aai_val', phai: 'phai_val',
        sri: 'sri_val', abi: 'abi_val', tui: 'tui_val',
        ei: 'ei_val', dci: 'dci_val', pai: 'final_pai',
        row: 'row', val: 'val', idx: 'idx',
        sentSum: 'sentiment_sum', denom: 'formula_denominator'
    },
    {
        wb: 'excel_wb', ws: 'data_sheet', cols: 'header_map',
        valid: 'actual_valid_days', expected: 'target_days',
        tpi: 'tpi_result', aai: 'aai_result', phai: 'phai_result',
        sri: 'sri_result', abi: 'abi_result', tui: 'tui_result',
        ei: 'ei_result', dci: 'dci_result', pai: 'pai_score',
        row: 'data_row', val: 'cell_val', idx: 'col_idx',
        sentSum: 'emotion_total', denom: 'max_score'
    },
    {
        wb: 'workbook', ws: 'worksheet', cols: 'col_indices',
        valid: 'valid_days_count', expected: 'total_days',
        tpi: 'tpi_score', aai: 'aai_score', phai: 'phai_score',
        sri: 'sri_score', abi: 'abi_score', tui: 'tui_score',
        ei: 'ei_score', dci: 'dci_score', pai: 'overall_pai',
        row: 'r', val: 'v', idx: 'col_i',
        sentSum: 'raw_sentiment', denom: 'denominator'
    },
    {
        wb: 'student_wb', ws: 'student_ws', cols: 'col_dict',
        valid: 'valid_count', expected: 'expected_count',
        tpi: 'tpi_metric', aai: 'aai_metric', phai: 'phai_metric',
        sri: 'sri_metric', abi: 'abi_metric', tui: 'tui_metric',
        ei: 'ei_metric', dci: 'dci_metric', pai: 'composite_pai',
        row: 'each_row', val: 'each_val', idx: 'c_idx',
        sentSum: 'sentiment_aggregate', denom: 'total_possible'
    },
    {
        wb: 'my_excel', ws: 'my_sheet', cols: 'headers_dict',
        valid: 'counted_days', expected: 'period_days',
        tpi: 'val_tpi', aai: 'val_aai', phai: 'val_phai',
        sri: 'val_sri', abi: 'val_abi', tui: 'val_tui',
        ei: 'val_ei', dci: 'val_dci', pai: 'personal_activity_index',
        row: 'row_data', val: 'num_val', idx: 'column_pos',
        sentSum: 'total_score', denom: 'max_possible'
    }
];

// ---------------------------------------------------------------
// 2. COMMENT PERSONALITIES  (3 styles matching project.py tone)
// ---------------------------------------------------------------
const COMMENT_PERSONALITIES = [
    {
        // Informal student
        moduleHeader: null,
        mainFnLabel: '#The main function (Personal Activity Index)',
        row5Label: '# looping row 5 to get column positions',
        daysLabel: '# calculating how many days in the tracking window',
        validLabel: '# count rows where student actually logged data',
        auditVerbose: true,
        avgSectionLabel: null,
        paiLabel: '# weighted formula to get final PAI score',
        tpiLabel: null, aaiLabel: null, phaiLabel: null,
        sriLabel: null, abiLabel: null, tuiLabel: null,
        eiLabel: '# convert qualitative responses to numeric score',
        dciLabel: null
    },
    {
        // Formal student
        moduleHeader: '# CAP776 Python Project - Personal Activity Index (PAI)\n# Student submission - openpyxl implementation',
        mainFnLabel: '#The main fucntion (Personal Activity Index (PAI))',
        row5Label: '# Iterating over Row 5 (ws[5]) to correctly capture the actual column headers',
        daysLabel: '#Calculating the default days from 13 Aug - 21th Sep',
        validLabel: null,
        auditVerbose: true,
        avgSectionLabel: '# --- Specific Daily Average Functions ---',
        paiLabel: null,
        tpiLabel: '# Iterate and sum up coding minutes starting from row 6',
        aaiLabel: null, phaiLabel: null, sriLabel: null,
        abiLabel: null, tuiLabel: null,
        eiLabel: null,
        dciLabel: null
    },
    {
        // Minimal student - barely any comments
        moduleHeader: null,
        mainFnLabel: null,
        row5Label: '# get column headers from row 5',
        daysLabel: null,
        validLabel: '# count valid days',
        auditVerbose: false,
        avgSectionLabel: null,
        paiLabel: null,
        tpiLabel: null, aaiLabel: null, phaiLabel: null,
        sriLabel: null, abiLabel: null, tuiLabel: null,
        eiLabel: null, dciLabel: null
    }
];

// ---------------------------------------------------------------
// 3. BUILD A SINGLE SCRIPT  (nested-function architecture)
// ---------------------------------------------------------------
function buildScript(v, c, dateCfg) {
    const { startY, startM, startD, endY, endM, endD } = dateCfg;
    const semi = rollChance(0.35) ? ';' : '';
    const resultVar = rollChance(0.4);    // use intermediate var before return
    const todoNote = rollChance(0.25);    // add TODO comment
    const verbosePrint = rollChance(0.5); // longer print labels

    // Inner function indent is always 4 spaces (inside pai) + 4 spaces = 8 spaces body
    // Nested fn defs are at 4-space indent level (inside pai())
    const I = '    ';  // one level = 4 spaces

    // helper: optional intermediate return
    const ret = (varName, expr) => resultVar
        ? `${I}${I}${varName} = ${expr}\n${I}${I}return ${varName}`
        : `${I}${I}return ${expr}`;

    // helper: short vs long print labels
    const lbl = (short, long) => verbosePrint ? long : short;

    // ---- string_to_value layout variant ----
    const stvLayouts = [
        `string_to_value = {"Feeling" :{"Excellent":5, "Good":4, "Neutral":3,"Low":2,"Stressed":1},\n                              "Satisfaction":{"Verysatisfied":5, "Satisfied":4, "Neutral":3, "Unsatisfied":2, "veryunsatisfied":1},\n                              "Energy":{"High":3, "Medium":2, "Low":1}}`,
        `string_to_value = {\n    "Feeling": {"Excellent": 5, "Good": 4, "Neutral": 3, "Low": 2, "Stressed": 1},\n    "Satisfaction": {"Verysatisfied": 5, "Satisfied": 4, "Neutral": 3, "Unsatisfied": 2, "veryunsatisfied": 1},\n    "Energy": {"High": 3, "Medium": 2, "Low": 1}\n}`,
    ];
    const stv = pickRandom(stvLayouts);

    // ---- row-5 column mapping variant ----
    const row5 = rollChance(0.5)
        ? `${I}${v.cols} = {}\n${I}for ${v.val}, cell in enumerate(${v.ws}[5]):\n${I}${I}if cell.value:\n${I}${I}${I}col_name = str(cell.value).strip().lower()\n${I}${I}${I}clean_name = col_name.split('(')[0].strip()\n${I}${I}${I}${v.cols}[clean_name] = ${v.val}`
        : `${I}${v.cols} = {}\n${I}for ${v.idx}, cell in enumerate(${v.ws}[5]):\n${I}${I}if cell.value:\n${I}${I}${I}${v.val} = str(cell.value).strip().lower().split('(')[0].strip()\n${I}${I}${I}${v.cols}[${v.val}] = ${v.idx}`;

    // ---- valid days loop variant ----
    const validLoop = rollChance(0.5)
        ? `${I}tracked_index = ${v.cols}.get("total tracked")\n${I}${v.valid} = 0\n${I}for ${v.row} in ${v.ws}.iter_rows(min_row=7, max_row=6+${v.expected}, values_only=True):\n${I}${I}if tracked_index is not None and tracked_index < len(${v.row}):\n${I}${I}${I}${v.val} = ${v.row}[tracked_index]\n${I}${I}${I}if isinstance(${v.val}, (int, float)) and ${v.val} > 0:\n${I}${I}${I}${I}${v.valid} += 1`
        : `${I}${v.valid} = 0\n${I}_ti = ${v.cols}.get("total tracked")\n${I}for ${v.row} in ${v.ws}.iter_rows(min_row=7, max_row=6+${v.expected}, values_only=True):\n${I}${I}if _ti is not None and _ti < len(${v.row}):\n${I}${I}${I}${v.val} = ${v.row}[_ti]\n${I}${I}${I}if isinstance(${v.val}, (int, float)) and ${v.val} > 0:\n${I}${I}${I}${I}${v.valid} += 1`;

    // ---- audit print variant ----
    const audit = c.auditVerbose
        ? `${I}print(f"\\n[Audit] Expected Days in Range: {${v.expected}}")\n${I}print(f"[Audit] Actual Valid Days with Data: {${v.valid}}")\n${I}print(f"[Audit] Missing or Invalid (Nil/Zero) Days: {${v.expected} - ${v.valid}}\\n")`
        : `${I}print(f"Expected: {${v.expected}} | Valid: {${v.valid}}")`;

    // ---- single-column sum helper (used inline per function) ----
    const colSum = (colKey, sumVar) =>
        `${I}${I}${sumVar} = 0\n` +
        `${I}${I}if "${colKey}" not in ${v.cols}:\n` +
        `${I}${I}${I}return 0\n` +
        `${I}${I}for ${v.row} in ${v.ws}.iter_rows(min_row=7, max_row=6 + ${v.expected}, values_only=True):\n` +
        `${I}${I}${I}${v.val} = ${v.row}[${v.cols}["${colKey}"]]\n` +
        `${I}${I}${I}if isinstance(${v.val}, (int, float)):\n` +
        `${I}${I}${I}${I}${sumVar} += ${v.val}`;

    const todoLine = todoNote ? `${I}${I}# TODO: handle if sheet has extra empty rows\n` : '';

    // ---- 8 nested sub-index functions ----
    const fnTPI = [
        `${I}def tpi():`,
        c.tpiLabel ? `${I}${I}${c.tpiLabel}` : null,
        todoLine || null,
        colSum('coding', '_coding'),
        `${I}${I}${v.tpi} = _coding / ${v.valid} if ${v.valid} > 0 else 0${semi}`,
        `${I}${I}print(f"[TPI] ${lbl('Tech Productivity Index', 'Tech Productivity Index: Total Coding')} = {round(${v.tpi}, 2)} mins/day")`,
        ret('_r', `${v.tpi}`),
    ].filter(Boolean).join('\n');

    const fnAAI = [
        `${I}def aai():`,
        c.aaiLabel ? `${I}${I}${c.aaiLabel}` : null,
        `${I}${I}sum_of_study = 0`,
        `${I}${I}sum_of_class = 0`,
        `${I}${I}if "study" not in ${v.cols} or "class" not in ${v.cols}:`,
        `${I}${I}${I}print("Invalid column for AAI calculation")`,
        `${I}${I}${I}return 0`,
        `${I}${I}for ${v.row} in ${v.ws}.iter_rows(min_row=7, max_row=6 + ${v.expected}, values_only=True):`,
        `${I}${I}${I}sv = ${v.row}[${v.cols}["study"]]`,
        `${I}${I}${I}cv = ${v.row}[${v.cols}["class"]]`,
        `${I}${I}${I}if isinstance(sv, (int, float)): sum_of_study += sv`,
        `${I}${I}${I}if isinstance(cv, (int, float)): sum_of_class += cv`,
        `${I}${I}${v.aai} = (sum_of_study + sum_of_class) / ${v.valid} if ${v.valid} > 0 else 0`,
        `${I}${I}print(f"[AAI] ${lbl('Academic Activity Index', 'Academic Activity Index: Study+Class')} = {round(${v.aai}, 2)} mins/day")`,
        ret('_r', `${v.aai}`),
    ].filter(Boolean).join('\n');

    const fnPHAI = [
        `${I}def phai():`,
        c.phaiLabel ? `${I}${I}${c.phaiLabel}` : null,
        colSum('fitness', '_fitness'),
        `${I}${I}${v.phai} = _fitness / ${v.valid} if ${v.valid} > 0 else 0${semi}`,
        `${I}${I}print(f"[PhAI] ${lbl('Physical Health Activity Index', 'Physical Health Activity Index: Fitness')} = {round(${v.phai}, 2)} mins/day")`,
        ret('_r', `${v.phai}`),
    ].filter(Boolean).join('\n');

    const fnSRI = [
        `${I}def sri():`,
        c.sriLabel ? `${I}${I}${c.sriLabel}` : null,
        colSum('sleep', '_sleep'),
        `${I}${I}${v.sri} = _sleep / ${v.valid} if ${v.valid} > 0 else 0${semi}`,
        `${I}${I}print(f"[SRI] ${lbl('Sleep Regularity Index', 'Sleep Regularity Index: Sleep avg')} = {round(${v.sri}, 2)} mins/day")`,
        ret('_r', `${v.sri}`),
    ].filter(Boolean).join('\n');

    const fnABI = [
        `${I}def abi():`,
        c.abiLabel ? `${I}${I}${c.abiLabel}` : null,
        colSum('free/unaccounted', '_free'),
        `${I}${I}${v.abi} = _free / ${v.valid} if ${v.valid} > 0 else 0${semi}`,
        `${I}${I}print(f"[ABI] ${lbl('Active Balance Index', 'Active Balance Index: Free/Unaccounted')} = {round(${v.abi}, 2)} mins/day")`,
        ret('_r', `${v.abi}`),
    ].filter(Boolean).join('\n');

    const fnTUI = [
        `${I}def tui():`,
        c.tuiLabel ? `${I}${I}${c.tuiLabel}` : null,
        colSum('total tracked', '_tracked'),
        `${I}${I}${v.tui} = _tracked / ${v.valid} if ${v.valid} > 0 else 0${semi}`,
        `${I}${I}print(f"[TUI] ${lbl('Time Utility Index', 'Time Utility Index: Total tracked avg')} = {round(${v.tui}, 2)} mins/day")`,
        ret('_r', `${v.tui}`),
    ].filter(Boolean).join('\n');

    const eiCheck = rollChance(0.5)
        ? `${I}${I}required_columns = ["day's feeling", "satisfaction level", "energy level"]\n${I}${I}if not all(col in ${v.cols} for col in required_columns):\n${I}${I}${I}print("One or more columns for EI calculation are missing.")\n${I}${I}${I}return 0`
        : `${I}${I}if "day's feeling" not in ${v.cols} or "satisfaction level" not in ${v.cols} or "energy level" not in ${v.cols}:\n${I}${I}${I}print("EI columns missing")\n${I}${I}${I}return 0`;

    const fnEI = [
        `${I}def ei():`,
        c.eiLabel ? `${I}${I}${c.eiLabel}` : null,
        eiCheck,
        `${I}${I}${v.sentSum} = 0`,
        `${I}${I}feeling_column_idx = ${v.cols}["day's feeling"]`,
        `${I}${I}satisfaction_column_idx = ${v.cols}["satisfaction level"]`,
        `${I}${I}energy_column_idx = ${v.cols}["energy level"]`,
        `${I}${I}for ${v.row} in ${v.ws}.iter_rows(min_row=7, max_row=6 + ${v.expected}, values_only=True):`,
        `${I}${I}${I}raw_feeling = ${v.row}[feeling_column_idx]`,
        `${I}${I}${I}raw_satisfaction = ${v.row}[satisfaction_column_idx]`,
        `${I}${I}${I}raw_energy = ${v.row}[energy_column_idx]`,
        `${I}${I}${I}val_feeling = string_to_value["Feeling"].get(raw_feeling.strip().title() if raw_feeling else "", 0)`,
        `${I}${I}${I}val_satisfaction = string_to_value["Satisfaction"].get(raw_satisfaction.strip().title().replace(" ", "") if raw_satisfaction else "", 0)`,
        `${I}${I}${I}val_energy = string_to_value["Energy"].get(raw_energy.strip().title() if raw_energy else "", 0)`,
        `${I}${I}${I}${v.sentSum} += val_feeling + val_satisfaction + val_energy`,
        `${I}${I}${v.denom} = 13 * ${v.valid}`,
        `${I}${I}if ${v.valid} > 0 and ${v.denom} > 0:`,
        `${I}${I}${I}${v.ei} = round((${v.sentSum} / ${v.denom}) * 5, 2)`,
        `${I}${I}else:`,
        `${I}${I}${I}${v.ei} = 0`,
        `${I}${I}print(f"[EI] ${lbl('Emotional Index', 'Emotional Index: Raw Sentiment')} = {${v.ei}}")`,
        ret('_r', `${v.ei}`),
    ].filter(Boolean).join('\n');

    const fnDCI = [
        `${I}def dci():`,
        c.dciLabel ? `${I}${I}${c.dciLabel}` : null,
        `${I}${I}if "total tracked" not in ${v.cols}:`,
        `${I}${I}${I}print("Error: 'total tracked' column missing.")`,
        `${I}${I}${I}return 0`,
        `${I}${I}continuity_score = (${v.valid} / ${v.expected}) * 100 if ${v.expected} > 0 else 0`,
        `${I}${I}print(f"[DCI] ${lbl('Data Continuity Index', 'Data Continuity Index')} = {${v.valid}}/{${v.expected}} ({round(continuity_score, 2)}%)")`,
        ret('_r', 'continuity_score'),
    ].filter(Boolean).join('\n');

    // ---- avg helper functions (nested) ----
    const fnAvgStudy = rollChance(0.5)
        ? `${I}def avg_study():\n${I}${I}sum_of_study = 0\n${I}${I}study_col = "study"\n${I}${I}if study_col in ${v.cols}:\n${I}${I}${I}idx = ${v.cols}[study_col]\n${I}${I}${I}for ${v.row} in ${v.ws}.iter_rows(min_row=7, max_row=6 + ${v.expected}, values_only=True):\n${I}${I}${I}${I}${v.val} = ${v.row}[idx]\n${I}${I}${I}${I}if isinstance(${v.val}, (int, float)):\n${I}${I}${I}${I}${I}sum_of_study += ${v.val}\n${I}${I}res = sum_of_study / ${v.valid} if ${v.valid} > 0 else 0\n${I}${I}print(f"[Avg Study] Total = {sum_of_study} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")\n${I}${I}return res`
        : `${I}def avg_study():\n${I}${I}s = 0\n${I}${I}idx_s = ${v.cols}.get("study")\n${I}${I}if idx_s is None: return 0\n${I}${I}for ${v.row} in ${v.ws}.iter_rows(min_row=7, max_row=6 + ${v.expected}, values_only=True):\n${I}${I}${I}if isinstance(${v.row}[idx_s], (int, float)):\n${I}${I}${I}${I}s += ${v.row}[idx_s]\n${I}${I}result = s / ${v.valid} if ${v.valid} > 0 else 0\n${I}${I}print(f"[Avg Study] Daily Avg = {round(result, 2)} mins/day")\n${I}${I}return result`;

    const fnAvgClass = `${I}def avg_class():\n${I}${I}c = 0\n${I}${I}class_col = "class"\n${I}${I}if class_col in ${v.cols}:\n${I}${I}${I}idx = ${v.cols}[class_col]\n${I}${I}${I}for ${v.row} in ${v.ws}.iter_rows(min_row=7, max_row=6 + ${v.expected}, values_only=True):\n${I}${I}${I}${I}${v.val} = ${v.row}[idx]\n${I}${I}${I}${I}if isinstance(${v.val}, (int, float)):\n${I}${I}${I}${I}${I}c += ${v.val}\n${I}${I}res = c / ${v.valid} if ${v.valid} > 0 else 0\n${I}${I}print(f"[Avg Class] Total = {c} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")\n${I}${I}return res`;

    const fnAvgOther = `${I}def avg_other_activities():\n${I}${I}sum_of_other = 0\n${I}${I}other_col = "other activities" if "other activities" in ${v.cols} else ("other" if "other" in ${v.cols} else None)\n${I}${I}if other_col is not None:\n${I}${I}${I}idx = ${v.cols}[other_col]\n${I}${I}${I}for ${v.row} in ${v.ws}.iter_rows(min_row=7, max_row=6 + ${v.expected}, values_only=True):\n${I}${I}${I}${I}${v.val} = ${v.row}[idx]\n${I}${I}${I}${I}if isinstance(${v.val}, (int, float)):\n${I}${I}${I}${I}${I}sum_of_other += ${v.val}\n${I}${I}res = sum_of_other / ${v.valid} if ${v.valid} > 0 else 0\n${I}${I}print(f"[Avg Other Activities] Total = {sum_of_other} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")\n${I}${I}return res`;

    // ---- Assemble the full script ----
    const lines = [];

    // Module-level header comment
    if (c.moduleHeader) {
        lines.push(c.moduleHeader);
    }
    lines.push('import openpyxl as opx');
    lines.push('import datetime as dt');
    lines.push('import math');
    lines.push('');
    lines.push('');
    lines.push(stv);
    lines.push('');
    lines.push('');
    // Main function comment on its own line
    if (c.mainFnLabel) {
        lines.push(c.mainFnLabel);
    }
    lines.push('def pai(filename, sheet_name):');
    lines.push('    try:');
    lines.push(`        ${v.wb} = opx.load_workbook(filename, data_only=True)`);
    lines.push('    except FileNotFoundError:');
    lines.push(`        return {"error": f"The file '{filename}' was not found. Please check the path."}`);
    lines.push('    except Exception as e: ');
    lines.push(`        return {"error": f"Failed to load Excel file '{filename}': {str(e)}"}`);
    lines.push('');
    lines.push('    try:');
    lines.push(`        ${v.ws} = ${v.wb}[sheet_name]`);
    lines.push('    except KeyError:');
    lines.push(`        return {"error": f"Sheet '{sheet_name}' not found. Available sheets: {${v.wb}.sheetnames}"}`);
    lines.push('');
    lines.push('');
    if (c.row5Label) lines.push(`    ${c.row5Label}`);
    row5.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    if (c.daysLabel) lines.push(`    ${c.daysLabel}`);
    lines.push(`    ${v.expected} = (dt.datetime(${endY}, ${endM}, ${endD}) - dt.datetime(${startY}, ${startM}, ${startD})).days + 1`);
    lines.push('');
    if (c.validLabel) lines.push(`    ${c.validLabel}`);
    validLoop.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push(`    missing_or_invalid_days = ${v.expected} - ${v.valid}`);
    lines.push('');
    audit.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    fnTPI.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    fnAAI.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    fnPHAI.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    fnSRI.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    fnABI.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    fnTUI.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    fnEI.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    fnDCI.split('\n').forEach(l => lines.push(l));
    lines.push('');
    if (c.avgSectionLabel) lines.push(`    ${c.avgSectionLabel}`);
    fnAvgStudy.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    `${I}def avg_fitness():\n${I}${I}return phai()`.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    `${I}def avg_sleep():\n${I}${I}return sri()`.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    `${I}def avg_coding():\n${I}${I}return tpi()`.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    fnAvgClass.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    fnAvgOther.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push('');
    `${I}def avg_free_unaccounted():\n${I}${I}return abi()`.split('\n').forEach(l => lines.push(l));
    lines.push('');
    lines.push(`    print("--- Executing Sub-Calculations ---")`);
    lines.push(`    ${v.tpi} = tpi()`);
    lines.push(`    ${v.aai} = aai()`);
    lines.push(`    ${v.phai} = phai()`);
    lines.push(`    ${v.sri} = sri()`);
    lines.push(`    ${v.tui} = tui()`);
    lines.push(`    ${v.ei} = ei()`);
    lines.push(`    ${v.abi} = abi()`);
    lines.push(`    ${v.dci} = dci()`);
    lines.push('');
    lines.push('    # Calculate requested daily averages');
    lines.push(`    avg_sleep_val = avg_sleep()`);
    lines.push(`    avg_fitness_val = avg_fitness()`);
    lines.push(`    avg_study_val = avg_study()`);
    lines.push(`    avg_coding_val = avg_coding()`);
    lines.push(`    avg_class_val = avg_class()`);
    lines.push(`    avg_other_val = avg_other_activities()`);
    lines.push(`    avg_free_val = avg_free_unaccounted()`);
    lines.push(`    print("----------------------------------\\n")`);
    lines.push('');
    if (c.paiLabel) lines.push(`    ${c.paiLabel}`);
    lines.push(`    ${v.pai} = ((0.15 * ${v.tpi}) + (0.20 * ${v.aai}) + (0.15 * ${v.phai}) +(0.20 * ${v.sri}) +`);
    lines.push(`     (0.15 * ${v.tui}) + (0.10 * ${v.ei}) +(0.05 * ${v.dci}))`);
    lines.push('');
    lines.push('    return {');
    lines.push(`        "Personal Activity Index: ": round(${v.pai}, 2),`);
    lines.push('        "breakdown": {');
    lines.push(`            "Tech Productivity Index is: ": round(${v.tpi}, 2),`);
    lines.push(`            "Academic Activity Index: ": round(${v.aai}, 2),`);
    lines.push(`            "Physical Activity Index: ": round(${v.phai}, 2),`);
    lines.push(`            "Sleep and Recovery Index: ": round(${v.sri}, 2),`);
    lines.push(`            "Time Utilisation Index: ": round(${v.tui}, 2),`);
    lines.push(`            "Experience Index: ": round(${v.ei}, 2),`);
    lines.push(`            "Active Balance Index: ": round(${v.abi}, 2),`);
    lines.push(`            "Data Continuity Index": round(${v.dci}, 2)`);
    lines.push('        },');
    lines.push('        "daily_averages": {');
    lines.push(`            "Average Sleep/day": f"{round(avg_sleep_val, 2)} mins/day ({round(avg_sleep_val/60, 2)} hrs/day)",`);
    lines.push(`            "Average Fitness/day": f"{round(avg_fitness_val, 2)} mins/day ({round(avg_fitness_val/60, 2)} hrs/day)",`);
    lines.push(`            "Average Study/day": f"{round(avg_study_val, 2)} mins/day ({round(avg_study_val/60, 2)} hrs/day)",`);
    lines.push(`            "Average Coding/day": f"{round(avg_coding_val, 2)} mins/day ({round(avg_coding_val/60, 2)} hrs/day)",`);
    lines.push(`            "Average Class/day": f"{round(avg_class_val, 2)} mins/day ({round(avg_class_val/60, 2)} hrs/day)",`);
    lines.push(`            "Average Other Activities/day": f"{round(avg_other_val, 2)} mins/day ({round(avg_other_val/60, 2)} hrs/day)",`);
    lines.push(`            "Average Free / Unaccounted Time/day": f"{round(avg_free_val, 2)} mins/day ({round(avg_free_val/60, 2)} hrs/day)"`);
    lines.push('        }');
    lines.push('    }');

    return lines.join('\n');
}

// ---------------------------------------------------------------
// MAIN ENTRY POINT
// ---------------------------------------------------------------
export function generateUniqueStudentPythonCode(options = {}) {
    const startDateStr = options?.startDate || "2026-08-13";
    const parts = String(startDateStr).split("-").map(Number);
    const startY = parts[0] || 2026;
    const startM = parts[1] || 8;
    const startD = parts[2] || 13;

    const dateCfg = { startY, startM, startD, endY: 2026, endM: 9, endD: 21 };

    const v = pickRandom(VARIABLE_PALETTES);
    const c = pickRandom(COMMENT_PERSONALITIES);

    return buildScript(v, c, dateCfg).trim();
}
