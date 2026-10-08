# CAP776 Python Project - Personal Activity Index (PAI)
# Student submission - openpyxl implementation
import openpyxl as opx
import datetime as dt
import math


string_to_value = {
    "Feeling": {"Excellent": 5, "Good": 4, "Neutral": 3, "Low": 2, "Stressed": 1},
    "Satisfaction": {"Verysatisfied": 5, "Satisfied": 4, "Neutral": 3, "Unsatisfied": 2, "veryunsatisfied": 1},
    "Energy": {"High": 3, "Medium": 2, "Low": 1}
}


#The main fucntion (Personal Activity Index (PAI))
def pai(filename, sheet_name):
    try:
        my_excel = opx.load_workbook(filename, data_only=True)
    except FileNotFoundError:
        return {"error": f"The file '{filename}' was not found. Please check the path."}
    except Exception as e: 
        return {"error": f"Failed to load Excel file '{filename}': {str(e)}"}

    try:
        my_sheet = my_excel[sheet_name]
    except KeyError:
        return {"error": f"Sheet '{sheet_name}' not found. Available sheets: {my_excel.sheetnames}"}


    # Iterating over Row 5 (ws[5]) to correctly capture the actual column headers
    headers_dict = {}
    for column_pos, cell in enumerate(my_sheet[5]):
        if cell.value:
            num_val = str(cell.value).strip().lower().split('(')[0].strip()
            headers_dict[num_val] = column_pos


    #Calculating the default days from 13 Aug - 21th Sep
    period_days = (dt.datetime(2026, 9, 21) - dt.datetime(2026, 8, 13)).days + 1

    counted_days = 0
    _ti = headers_dict.get("total tracked")
    for row_data in my_sheet.iter_rows(min_row=7, max_row=6+period_days, values_only=True):
        if _ti is not None and _ti < len(row_data):
            num_val = row_data[_ti]
            if isinstance(num_val, (int, float)) and num_val > 0:
                counted_days += 1

    missing_or_invalid_days = period_days - counted_days

    print(f"\n[Audit] Expected Days in Range: {period_days}")
    print(f"[Audit] Actual Valid Days with Data: {counted_days}")
    print(f"[Audit] Missing or Invalid (Nil/Zero) Days: {period_days - counted_days}\n")


    def tpi():
        # Iterate and sum up coding minutes starting from row 6
        _coding = 0
        if "coding" not in headers_dict:
            return 0
        for row_data in my_sheet.iter_rows(min_row=7, max_row=6 + period_days, values_only=True):
            num_val = row_data[headers_dict["coding"]]
            if isinstance(num_val, (int, float)):
                _coding += num_val
        val_tpi = _coding / counted_days if counted_days > 0 else 0
        print(f"[TPI] Tech Productivity Index: Total Coding = {round(val_tpi, 2)} mins/day")
        return val_tpi


    def aai():
        sum_of_study = 0
        sum_of_class = 0
        if "study" not in headers_dict or "class" not in headers_dict:
            print("Invalid column for AAI calculation")
            return 0
        for row_data in my_sheet.iter_rows(min_row=7, max_row=6 + period_days, values_only=True):
            sv = row_data[headers_dict["study"]]
            cv = row_data[headers_dict["class"]]
            if isinstance(sv, (int, float)): sum_of_study += sv
            if isinstance(cv, (int, float)): sum_of_class += cv
        val_aai = (sum_of_study + sum_of_class) / counted_days if counted_days > 0 else 0
        print(f"[AAI] Academic Activity Index: Study+Class = {round(val_aai, 2)} mins/day")
        return val_aai


    def phai():
        _fitness = 0
        if "fitness" not in headers_dict:
            return 0
        for row_data in my_sheet.iter_rows(min_row=7, max_row=6 + period_days, values_only=True):
            num_val = row_data[headers_dict["fitness"]]
            if isinstance(num_val, (int, float)):
                _fitness += num_val
        val_phai = _fitness / counted_days if counted_days > 0 else 0
        print(f"[PhAI] Physical Health Activity Index: Fitness = {round(val_phai, 2)} mins/day")
        return val_phai


    def sri():
        _sleep = 0
        if "sleep" not in headers_dict:
            return 0
        for row_data in my_sheet.iter_rows(min_row=7, max_row=6 + period_days, values_only=True):
            num_val = row_data[headers_dict["sleep"]]
            if isinstance(num_val, (int, float)):
                _sleep += num_val
        val_sri = _sleep / counted_days if counted_days > 0 else 0
        print(f"[SRI] Sleep Regularity Index: Sleep avg = {round(val_sri, 2)} mins/day")
        return val_sri


    def abi():
        _free = 0
        if "free/unaccounted" not in headers_dict:
            return 0
        for row_data in my_sheet.iter_rows(min_row=7, max_row=6 + period_days, values_only=True):
            num_val = row_data[headers_dict["free/unaccounted"]]
            if isinstance(num_val, (int, float)):
                _free += num_val
        val_abi = _free / counted_days if counted_days > 0 else 0
        print(f"[ABI] Active Balance Index: Free/Unaccounted = {round(val_abi, 2)} mins/day")
        return val_abi


    def tui():
        _tracked = 0
        if "total tracked" not in headers_dict:
            return 0
        for row_data in my_sheet.iter_rows(min_row=7, max_row=6 + period_days, values_only=True):
            num_val = row_data[headers_dict["total tracked"]]
            if isinstance(num_val, (int, float)):
                _tracked += num_val
        val_tui = _tracked / counted_days if counted_days > 0 else 0
        print(f"[TUI] Time Utility Index: Total tracked avg = {round(val_tui, 2)} mins/day")
        return val_tui


    def ei():
        if "day's feeling" not in headers_dict or "satisfaction level" not in headers_dict or "energy level" not in headers_dict:
            print("EI columns missing")
            return 0
        total_score = 0
        feeling_column_idx = headers_dict["day's feeling"]
        satisfaction_column_idx = headers_dict["satisfaction level"]
        energy_column_idx = headers_dict["energy level"]
        for row_data in my_sheet.iter_rows(min_row=7, max_row=6 + period_days, values_only=True):
            raw_feeling = row_data[feeling_column_idx]
            raw_satisfaction = row_data[satisfaction_column_idx]
            raw_energy = row_data[energy_column_idx]
            val_feeling = string_to_value["Feeling"].get(raw_feeling.strip().title() if raw_feeling else "", 0)
            val_satisfaction = string_to_value["Satisfaction"].get(raw_satisfaction.strip().title().replace(" ", "") if raw_satisfaction else "", 0)
            val_energy = string_to_value["Energy"].get(raw_energy.strip().title() if raw_energy else "", 0)
            total_score += val_feeling + val_satisfaction + val_energy
        max_possible = 13 * counted_days
        if counted_days > 0 and max_possible > 0:
            val_ei = round((total_score / max_possible) * 5, 2)
        else:
            val_ei = 0
        print(f"[EI] Emotional Index: Raw Sentiment = {val_ei}")
        return val_ei


    def dci():
        if "total tracked" not in headers_dict:
            print("Error: 'total tracked' column missing.")
            return 0
        continuity_score = (counted_days / period_days) * 100 if period_days > 0 else 0
        print(f"[DCI] Data Continuity Index = {counted_days}/{period_days} ({round(continuity_score, 2)}%)")
        return continuity_score

    # --- Specific Daily Average Functions ---
    def avg_study():
        s = 0
        idx_s = headers_dict.get("study")
        if idx_s is None: return 0
        for row_data in my_sheet.iter_rows(min_row=7, max_row=6 + period_days, values_only=True):
            if isinstance(row_data[idx_s], (int, float)):
                s += row_data[idx_s]
        result = s / counted_days if counted_days > 0 else 0
        print(f"[Avg Study] Daily Avg = {round(result, 2)} mins/day")
        return result


    def avg_fitness():
        return phai()


    def avg_sleep():
        return sri()


    def avg_coding():
        return tpi()


    def avg_class():
        c = 0
        class_col = "class"
        if class_col in headers_dict:
            idx = headers_dict[class_col]
            for row_data in my_sheet.iter_rows(min_row=7, max_row=6 + period_days, values_only=True):
                num_val = row_data[idx]
                if isinstance(num_val, (int, float)):
                    c += num_val
        res = c / counted_days if counted_days > 0 else 0
        print(f"[Avg Class] Total = {c} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")
        return res


    def avg_other_activities():
        sum_of_other = 0
        other_col = "other activities" if "other activities" in headers_dict else ("other" if "other" in headers_dict else None)
        if other_col is not None:
            idx = headers_dict[other_col]
            for row_data in my_sheet.iter_rows(min_row=7, max_row=6 + period_days, values_only=True):
                num_val = row_data[idx]
                if isinstance(num_val, (int, float)):
                    sum_of_other += num_val
        res = sum_of_other / counted_days if counted_days > 0 else 0
        print(f"[Avg Other Activities] Total = {sum_of_other} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")
        return res


    def avg_free_unaccounted():
        return abi()

    print("--- Executing Sub-Calculations ---")
    val_tpi = tpi()
    val_aai = aai()
    val_phai = phai()
    val_sri = sri()
    val_tui = tui()
    val_ei = ei()
    val_abi = abi()
    val_dci = dci()

    # Calculate requested daily averages
    avg_sleep_val = avg_sleep()
    avg_fitness_val = avg_fitness()
    avg_study_val = avg_study()
    avg_coding_val = avg_coding()
    avg_class_val = avg_class()
    avg_other_val = avg_other_activities()
    avg_free_val = avg_free_unaccounted()
    print("----------------------------------\n")

    personal_activity_index = ((0.15 * val_tpi) + (0.20 * val_aai) + (0.15 * val_phai) +(0.20 * val_sri) +
     (0.15 * val_tui) + (0.10 * val_ei) +(0.05 * val_dci))

    return {
        "Personal Activity Index: ": round(personal_activity_index, 2),
        "breakdown": {
            "Tech Productivity Index is: ": round(val_tpi, 2),
            "Academic Activity Index: ": round(val_aai, 2),
            "Physical Activity Index: ": round(val_phai, 2),
            "Sleep and Recovery Index: ": round(val_sri, 2),
            "Time Utilisation Index: ": round(val_tui, 2),
            "Experience Index: ": round(val_ei, 2),
            "Active Balance Index: ": round(val_abi, 2),
            "Data Continuity Index": round(val_dci, 2)
        },
        "daily_averages": {
            "Average Sleep/day": f"{round(avg_sleep_val, 2)} mins/day ({round(avg_sleep_val/60, 2)} hrs/day)",
            "Average Fitness/day": f"{round(avg_fitness_val, 2)} mins/day ({round(avg_fitness_val/60, 2)} hrs/day)",
            "Average Study/day": f"{round(avg_study_val, 2)} mins/day ({round(avg_study_val/60, 2)} hrs/day)",
            "Average Coding/day": f"{round(avg_coding_val, 2)} mins/day ({round(avg_coding_val/60, 2)} hrs/day)",
            "Average Class/day": f"{round(avg_class_val, 2)} mins/day ({round(avg_class_val/60, 2)} hrs/day)",
            "Average Other Activities/day": f"{round(avg_other_val, 2)} mins/day ({round(avg_other_val/60, 2)} hrs/day)",
            "Average Free / Unaccounted Time/day": f"{round(avg_free_val, 2)} mins/day ({round(avg_free_val/60, 2)} hrs/day)"
        }
    }