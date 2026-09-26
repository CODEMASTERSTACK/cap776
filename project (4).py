# Student Name: CAP776 Project
# Course: CAP776 Python Programming
# Task: Personal Activity Index (PAI) calculation script
# Unit 4: Object-Oriented Programming (Class Architecture & Encapsulation)
import openpyxl as opx
import datetime as dt

class PAIAnalyticsEngine:
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

# loop through row 5 cells to locate column headers
        header_row = self.worksheet[5]
        for idx in range(len(header_row)):
            cell_item = header_row[idx]
            if cell_item.value:
                normalized_text = str(cell_item.value).strip().lower().split('(')[0].strip()
                self.column_dictionary[normalized_text] = idx

# total 40 days in the tracking period
        date_start = dt.datetime(2026, 8, 13)
        date_end = dt.datetime(2026, 9, 21)
        self.expected_days_count = (date_end - date_start).days + 1

# count days where data was actually logged
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

# coding average per valid day
    def get_tpi(self):
        total_coding = self.compute_single_activity_sum("coding")
        return (total_coding / self.valid_days_count) if self.valid_days_count > 0 else 0.0

# academic commitment: study plus class
    def get_aai(self):
        total_study = self.compute_single_activity_sum("study")
        total_class = self.compute_single_activity_sum("class")
        return ((total_study + total_class) / self.valid_days_count) if self.valid_days_count > 0 else 0.0

# physical fitness tracking
    def get_phai(self):
        total_fitness = self.compute_single_activity_sum("fitness")
        return (total_fitness / self.valid_days_count) if self.valid_days_count > 0 else 0.0

# sleep duration average
    def get_sri(self):
        total_sleep = self.compute_single_activity_sum("sleep")
        return (total_sleep / self.valid_days_count) if self.valid_days_count > 0 else 0.0

# leisure / free unaccounted buffer
    def get_abi(self):
        total_free = self.compute_single_activity_sum("free/unaccounted")
        return (total_free / self.valid_days_count) if self.valid_days_count > 0 else 0.0

# utility index: total hours tracked
    def get_tui(self):
        total_tracked = self.compute_single_activity_sum("total tracked")
        return (total_tracked / self.valid_days_count) if self.valid_days_count > 0 else 0.0

# sentiment points converted to 5-point scale
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

# percentage of completed days
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
    evaluator = PAIAnalyticsEngine(filename, sheet_name)
    init_err = evaluator.load_and_initialize()
    if init_err is not None:
        return {"error": init_err}

    print(f"\n================ AUDIT METRICS ================")
    print(f"Expected Observation Window: {evaluator.expected_days_count} Days")
    print(f"Actual Valid Recorded Days : {evaluator.valid_days_count} Days")
    print(f"Missing / Unrecorded Days  : {evaluator.expected_days_count - evaluator.valid_days_count} Days")
    print("===============================================\n")

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
    print("----------------------------------\n")

# final weighted formula
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