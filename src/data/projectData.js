export const projectData = {
  meta: {
    code: "CAP776",
    title: "CAP776 Mini Project",
    subtitle: "Personal Activity & Quantitative Productivity Analytics System",
    institution: "Lovely Professional University (LPU)",
    accreditation: "NAAC A++",
    academicSession: "Academic Session 2026",
    recordingPeriod: {
      startDate: "13th August 2026",
      endDate: "21st September 2026",
      note: "Continuous daily activity logging period"
    },
    status: "Project Guidelines & Formulas Specification",
    version: "1.0.0"
  },
  
  parameters: [
    {
      id: "tpi",
      code: "TPI",
      name: "Tech Productivity",
      unit: "min / day",
      formula: "TPI = (Σ Coding) / (Number of Valid Days)",
      numerator: "Σ Coding",
      denominator: "Number of Valid Days",
      question: "How much time, on average, did I devote to coding?",
      description: "Measures average daily active coding duration devoted to technical development and programming tasks.",
      weightInPAI: "15%",
      inputs: ["Daily coding time (minutes)", "Number of valid recorded days"],
      example: { coding: 7200, days: 30, result: "240 min/day (4 hrs/day)" }
    },
    {
      id: "aai",
      code: "AAI",
      name: "Academic Activity",
      unit: "min / day",
      formula: "AAI = (Σ (Study + Class)) / (Number of Valid Days)",
      numerator: "Σ (Study + Class)",
      denominator: "Number of Valid Days",
      question: "How much time, on average, did I devote to formal and independent academic activity?",
      description: "Quantifies the total time spent attending lectures, laboratory sessions, coursework, and independent academic study.",
      weightInPAI: "20%",
      inputs: ["Class hours (minutes)", "Self-study time (minutes)", "Number of valid recorded days"],
      example: { studyClass: 10800, days: 30, result: "360 min/day (6 hrs/day)" }
    },
    {
      id: "phai",
      code: "PhAI",
      name: "Physical Activity",
      unit: "min / day",
      formula: "PhAI = (Σ Fitness) / (Number of Valid Days)",
      numerator: "Σ Fitness",
      denominator: "Number of Valid Days",
      question: "How much time, on average, am I active in a day?",
      description: "Tracks physical exercise, sports, gym, walking, and other physical fitness activities to evaluate health maintenance.",
      weightInPAI: "15%",
      inputs: ["Fitness & exercise time (minutes)", "Number of valid recorded days"],
      example: { fitness: 1800, days: 30, result: "60 min/day (1 hr/day)" }
    },
    {
      id: "sri",
      code: "SRI",
      name: "Sleep & Recovery",
      unit: "min / day",
      formula: "SRI = (Σ Sleep) / (Number of Valid Days)",
      numerator: "Σ Sleep",
      denominator: "Number of Valid Days",
      question: "My sleep monitoring parameter",
      description: "Monitors daily sleep duration to ensure physical rest, cognitive recovery, and sustainable work-life balance.",
      weightInPAI: "20%",
      inputs: ["Total sleep duration (minutes)", "Number of valid recorded days"],
      example: { sleep: 14400, days: 30, result: "480 min/day (8 hrs/day)" }
    },
    {
      id: "abi",
      code: "ABI",
      name: "Activity Balance",
      unit: "min / day",
      formula: "ABI = (Σ Free / Unaccounted Time) / (Number of Valid Days)",
      numerator: "Σ Free / Unaccounted Time",
      denominator: "Number of Valid Days",
      question: "How much of my day, on average, was not accounted for by the activities I recorded?",
      description: "Calculates the gap of unrecorded or idle time in a 24-hour cycle (1440 minutes) not logged under primary activities.",
      weightInPAI: "N/A (Analytical Diagnostic)",
      inputs: ["Unaccounted/free time (minutes)", "Number of valid recorded days"],
      example: { unaccounted: 3600, days: 30, result: "120 min/day (2 hrs/day)" }
    },
    {
      id: "tui",
      code: "TUI",
      name: "Time Utilization",
      unit: "min / day",
      formula: "TUI = (Σ Total Tracked Time) / (Number of Valid Days)",
      numerator: "Σ Total Tracked Time",
      denominator: "Number of Valid Days",
      question: "What is my aggregate actively recorded and tracked time per day?",
      description: "Aggregates all systematically recorded activity blocks throughout each valid day.",
      weightInPAI: "15%",
      inputs: ["Sum of all tracked activity durations", "Number of valid recorded days"],
      example: { totalTracked: 39600, days: 30, result: "1320 min/day (22 hrs/day)" }
    },
    {
      id: "ei",
      code: "EI",
      name: "Experience Index",
      unit: "Scale of 1 - 5",
      formula: "EI = (Σ (Feeling + Satisfaction + Energy)) / (3 × Number of Valid Days)",
      numerator: "Σ (Feeling + Satisfaction + Energy)",
      denominator: "3 × Number of Valid Days",
      question: "My overall experience on a scale of 1-5",
      description: "Qualitative subjective self-assessment evaluating daily emotional feeling, task satisfaction, and energy levels on a 1–5 scale.",
      weightInPAI: "10%",
      inputs: ["Daily Feeling (1-5)", "Daily Satisfaction (1-5)", "Daily Energy (1-5)", "Valid Days"],
      example: { scoreSum: 360, days: 30, result: "4.0 / 5.0 (Positive Experience)" }
    },
    {
      id: "dci",
      code: "DCI",
      name: "Data Continuity Index",
      unit: "% (Percentage)",
      formula: "DCI = (Valid Recorded Days / Expected Days) × 100",
      numerator: "Valid Recorded Days",
      denominator: "Expected Days",
      question: "How consistent is my data logging over the required duration?",
      description: "Measures logging continuity from 13th August 2026 to 21st September 2026 (inclusive tracking window).",
      weightInPAI: "5% (or 15% with adjusted scale)",
      inputs: ["Valid recorded days count", "Total expected days in tracking window (40 days)"],
      example: { recordedDays: 38, expectedDays: 40, result: "95.0% Continuity" }
    },
    {
      id: "pai",
      code: "PAI",
      name: "Personal Activity Index",
      unit: "Composite Score",
      formula: "PAI = 0.15·TPI_s + 0.20·AAI_s + 0.15·PhAI_s + 0.20·SRI_s + 0.15·TUI_s + 0.10·EI_s + 0.05·DCI",
      numerator: "Weighted Sum of Standardized Indices",
      denominator: "100% Normalized Weights",
      question: "The overall participation and time utilization & distribution parameter",
      description: "The primary composite benchmark representing a student's holistic performance, time utilization balance, consistency, and well-being.",
      weightInPAI: "Composite (100%)",
      weightsBreakdown: [
        { parameter: "TPI (Tech Productivity)", weight: "15%", subscript: "TPI_s" },
        { parameter: "AAI (Academic Activity)", weight: "20%", subscript: "AAI_s" },
        { parameter: "PhAI (Physical Activity)", weight: "15%", subscript: "PhAI_s" },
        { parameter: "SRI (Sleep & Recovery)", weight: "20%", subscript: "SRI_s" },
        { parameter: "TUI (Time Utilization)", weight: "15%", subscript: "TUI_s" },
        { parameter: "EI (Experience Index)", weight: "10%", subscript: "EI_s" },
        { parameter: "DCI (Data Continuity)", weight: "5%", subscript: "DCI" }
      ],
      inputs: ["Standardized scores (index_s) for each core parameter"]
    }
  ],

  rules: [
    {
      title: "Recording Timeline & Expected Window",
      description: "Data logging begins strictly on 13th August 2026 and concludes on 21st September 2026. The total expected days count corresponds to this exact timeline."
    },
    {
      title: "Valid Days Definition",
      description: "A day is recognized as a 'Valid Day' only if all mandatory activity dimensions (Coding, Academic, Fitness, Sleep, and Experience ratings) have been logged without omission."
    },
    {
      title: "Scale Boundaries for Experience (EI)",
      description: "Qualitative metrics (Feeling, Satisfaction, Energy) must be strictly scored on an integer scale from 1 (lowest) to 5 (highest)."
    },
    {
      title: "Standardization Subscript (index_s)",
      description: "Before computing the composite PAI score, each parameter value is normalized/standardized onto a unified 0–100 or benchmark scale to eliminate unit disparity."
    },
    {
      title: "Time Conservation Rule (24 Hours)",
      description: "In every 24-hour cycle (1440 minutes), Total Tracked Time (TUI) + Free/Unaccounted Time (ABI) must sum to 1440 minutes."
    }
  ],

  evaluationRubric: {
    title: "Project Evaluation Rubric",
    totalRawMarks: 100,
    scaledMaxMarks: 15,
    scalingNote: "*Scaled down to 15 marks for final academic evaluation",
    components: [
      {
        id: "ev-1",
        component: "Data File & Data Continuity",
        marks: 10,
        criteria: "Student's own activity data, correct date sequence, completeness and consistency"
      },
      {
        id: "ev-2",
        component: "File Handling & Data Reading",
        marks: 10,
        criteria: "Reading the Excel file correctly using Python; appropriate use of file-handling concepts"
      },
      {
        id: "ev-3",
        component: "Data Validation & Exception Handling",
        marks: 10,
        criteria: "Checking missing/invalid values, handling errors using try-except and appropriate validation"
      },
      {
        id: "ev-4",
        component: "Python Fundamentals",
        marks: 10,
        criteria: "Variables, data types, operators, conditions, loops and basic calculations"
      },
      {
        id: "ev-5",
        component: "Functions & Modular Programming",
        marks: 15,
        criteria: "Use of user-defined functions; logical decomposition; reusable code"
      },
      {
        id: "ev-6",
        component: "Python Data Structures",
        marks: 10,
        criteria: "Appropriate use of lists, dictionaries, tuples/sets where applicable"
      },
      {
        id: "ev-7",
        component: "Calculation of Activity Indices",
        marks: 15,
        criteria: "Correct calculation of TPI, AAI, PhAI, SRI, ABI, TUI, EI and DCI"
      },
      {
        id: "ev-8",
        component: "Relationship Analysis",
        marks: 10,
        criteria: "At least 3 meaningful relationships, e.g. Sleep–Energy, Study–Satisfaction, Coding–Energy"
      },
      {
        id: "ev-9",
        component: "Interpretation & Findings",
        marks: 5,
        criteria: "Evidence-based personal findings derived from the student's own data"
      },
      {
        id: "ev-10",
        component: "Documentation & Reproducibility",
        marks: 5,
        criteria: "Readability, comments, instructions and ability to reproduce the results"
      }
    ]
  },

  checklist: [
    { id: "c-1", title: "Review all 9 index parameters (PAI, TPI, AAI, PhAI, SRI, ABI, TUI, EI, DCI)", defaultChecked: true },
    { id: "c-2", title: "Verify mathematical formulas, numerators and denominators", defaultChecked: true },
    { id: "c-3", title: "Confirm logging dates: 13th Aug 2026 to 21st Sept 2026", defaultChecked: true },
    { id: "c-4", title: "Check PAI weighted formula coefficients (15%, 20%, 15%, 20%, 15%, 10%, 5%)", defaultChecked: false },
    { id: "c-5", title: "Review 10-point evaluation criteria (100 marks scaled down to 15)", defaultChecked: false },
    { id: "c-6", title: "Verify Python Excel file handling, validation & 3 relationship analyses", defaultChecked: false }
  ]
};
