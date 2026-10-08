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
        excel_wb = opx.load_workbook(filename, data_only=True)
    except FileNotFoundError:
        return {"error": f"The file '{filename}' was not found. Please check the path."}
    except Exception as e: 
        return {"error": f"Failed to load Excel file '{filename}': {str(e)}"}

    try:
        data_sheet = excel_wb[sheet_name]
    except KeyError:
        return {"error": f"Sheet '{sheet_name}' not found. Available sheets: {excel_wb.sheetnames}"}


    # Iterating over Row 5 (ws[5]) to correctly capture the actual column headers
    header_map = {}
    for cell_val, cell in enumerate(data_sheet[5]):
        if cell.value:
            col_name = str(cell.value).strip().lower()
            clean_name = col_name.split('(')[0].strip()
            header_map[clean_name] = cell_val


    #Calculating the default days from 13 Aug - 21th Sep
    target_days = (dt.datetime(2026, 9, 21) - dt.datetime(2026, 8, 13)).days + 1

    tracked_index = header_map.get("total tracked")
    actual_valid_days = 0
    for data_row in data_sheet.iter_rows(min_row=7, max_row=6+target_days, values_only=True):
        if tracked_index is not None and tracked_index < len(data_row):
            cell_val = data_row[tracked_index]
            if isinstance(cell_val, (int, float)) and cell_val > 0:
                actual_valid_days += 1

    missing_or_invalid_days = target_days - actual_valid_days

    print(f"\n[Audit] Expected Days in Range: {target_days}")
    print(f"[Audit] Actual Valid Days with Data: {actual_valid_days}")
    print(f"[Audit] Missing or Invalid (Nil/Zero) Days: {target_days - actual_valid_days}\n")


    def tpi():
        # Iterate and sum up coding minutes starting from row 6
        # TODO: handle if sheet has extra empty rows

        _coding = 0
        if "coding" not in header_map:
            return 0
        for data_row in data_sheet.iter_rows(min_row=7, max_row=6 + target_days, values_only=True):
            cell_val = data_row[header_map["coding"]]
            if isinstance(cell_val, (int, float)):
                _coding += cell_val
        tpi_result = _coding / actual_valid_days if actual_valid_days > 0 else 0;
        print(f"[TPI] Tech Productivity Index: Total Coding = {round(tpi_result, 2)} mins/day")
        return tpi_result


    def aai():
        sum_of_study = 0
        sum_of_class = 0
        if "study" not in header_map or "class" not in header_map:
            print("Invalid column for AAI calculation")
            return 0
        for data_row in data_sheet.iter_rows(min_row=7, max_row=6 + target_days, values_only=True):
            sv = data_row[header_map["study"]]
            cv = data_row[header_map["class"]]
            if isinstance(sv, (int, float)): sum_of_study += sv
            if isinstance(cv, (int, float)): sum_of_class += cv
        aai_result = (sum_of_study + sum_of_class) / actual_valid_days if actual_valid_days > 0 else 0
        print(f"[AAI] Academic Activity Index: Study+Class = {round(aai_result, 2)} mins/day")
        return aai_result


    def phai():
        _fitness = 0
        if "fitness" not in header_map:
            return 0
        for data_row in data_sheet.iter_rows(min_row=7, max_row=6 + target_days, values_only=True):
            cell_val = data_row[header_map["fitness"]]
            if isinstance(cell_val, (int, float)):
                _fitness += cell_val
        phai_result = _fitness / actual_valid_days if actual_valid_days > 0 else 0;
        print(f"[PhAI] Physical Health Activity Index: Fitness = {round(phai_result, 2)} mins/day")
        return phai_result


    def sri():
        _sleep = 0
        if "sleep" not in header_map:
            return 0
        for data_row in data_sheet.iter_rows(min_row=7, max_row=6 + target_days, values_only=True):
            cell_val = data_row[header_map["sleep"]]
            if isinstance(cell_val, (int, float)):
                _sleep += cell_val
        sri_result = _sleep / actual_valid_days if actual_valid_days > 0 else 0;
        print(f"[SRI] Sleep Regularity Index: Sleep avg = {round(sri_result, 2)} mins/day")
        return sri_result


    def abi():
        _free = 0
        if "free/unaccounted" not in header_map:
            return 0
        for data_row in data_sheet.iter_rows(min_row=7, max_row=6 + target_days, values_only=True):
            cell_val = data_row[header_map["free/unaccounted"]]
            if isinstance(cell_val, (int, float)):
                _free += cell_val
        abi_result = _free / actual_valid_days if actual_valid_days > 0 else 0;
        print(f"[ABI] Active Balance Index: Free/Unaccounted = {round(abi_result, 2)} mins/day")
        return abi_result


    def tui():
        _tracked = 0
        if "total tracked" not in header_map:
            return 0
        for data_row in data_sheet.iter_rows(min_row=7, max_row=6 + target_days, values_only=True):
            cell_val = data_row[header_map["total tracked"]]
            if isinstance(cell_val, (int, float)):
                _tracked += cell_val
        tui_result = _tracked / actual_valid_days if actual_valid_days > 0 else 0;
        print(f"[TUI] Time Utility Index: Total tracked avg = {round(tui_result, 2)} mins/day")
        return tui_result


    def ei():
        if "day's feeling" not in header_map or "satisfaction level" not in header_map or "energy level" not in header_map:
            print("EI columns missing")
            return 0
        emotion_total = 0
        feeling_column_idx = header_map["day's feeling"]
        satisfaction_column_idx = header_map["satisfaction level"]
        energy_column_idx = header_map["energy level"]
        for data_row in data_sheet.iter_rows(min_row=7, max_row=6 + target_days, values_only=True):
            raw_feeling = data_row[feeling_column_idx]
            raw_satisfaction = data_row[satisfaction_column_idx]
            raw_energy = data_row[energy_column_idx]
            val_feeling = string_to_value["Feeling"].get(raw_feeling.strip().title() if raw_feeling else "", 0)
            val_satisfaction = string_to_value["Satisfaction"].get(raw_satisfaction.strip().title().replace(" ", "") if raw_satisfaction else "", 0)
            val_energy = string_to_value["Energy"].get(raw_energy.strip().title() if raw_energy else "", 0)
            emotion_total += val_feeling + val_satisfaction + val_energy
        max_score = 13 * actual_valid_days
        if actual_valid_days > 0 and max_score > 0:
            ei_result = round((emotion_total / max_score) * 5, 2)
        else:
            ei_result = 0
        print(f"[EI] Emotional Index: Raw Sentiment = {ei_result}")
        return ei_result


    def dci():
        if "total tracked" not in header_map:
            print("Error: 'total tracked' column missing.")
            return 0
        continuity_score = (actual_valid_days / target_days) * 100 if target_days > 0 else 0
        print(f"[DCI] Data Continuity Index = {actual_valid_days}/{target_days} ({round(continuity_score, 2)}%)")
        return continuity_score

    # --- Specific Daily Average Functions ---
    def avg_study():
        sum_of_study = 0
        study_col = "study"
        if study_col in header_map:
            idx = header_map[study_col]
            for data_row in data_sheet.iter_rows(min_row=7, max_row=6 + target_days, values_only=True):
                cell_val = data_row[idx]
                if isinstance(cell_val, (int, float)):
                    sum_of_study += cell_val
        res = sum_of_study / actual_valid_days if actual_valid_days > 0 else 0
        print(f"[Avg Study] Total = {sum_of_study} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")
        return res


    def avg_fitness():
        return phai()


    def avg_sleep():
        return sri()


    def avg_coding():
        return tpi()


    def avg_class():
        c = 0
        class_col = "class"
        if class_col in header_map:
            idx = header_map[class_col]
            for data_row in data_sheet.iter_rows(min_row=7, max_row=6 + target_days, values_only=True):
                cell_val = data_row[idx]
                if isinstance(cell_val, (int, float)):
                    c += cell_val
        res = c / actual_valid_days if actual_valid_days > 0 else 0
        print(f"[Avg Class] Total = {c} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")
        return res


    def avg_other_activities():
        sum_of_other = 0
        other_col = "other activities" if "other activities" in header_map else ("other" if "other" in header_map else None)
        if other_col is not None:
            idx = header_map[other_col]
            for data_row in data_sheet.iter_rows(min_row=7, max_row=6 + target_days, values_only=True):
                cell_val = data_row[idx]
                if isinstance(cell_val, (int, float)):
                    sum_of_other += cell_val
        res = sum_of_other / actual_valid_days if actual_valid_days > 0 else 0
        print(f"[Avg Other Activities] Total = {sum_of_other} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")
        return res


    def avg_free_unaccounted():
        return abi()

    print("--- Executing Sub-Calculations ---")
    tpi_result = tpi()
    aai_result = aai()
    phai_result = phai()
    sri_result = sri()
    tui_result = tui()
    ei_result = ei()
    abi_result = abi()
    dci_result = dci()

    # Calculate requested daily averages
    avg_sleep_val = avg_sleep()
    avg_fitness_val = avg_fitness()
    avg_study_val = avg_study()
    avg_coding_val = avg_coding()
    avg_class_val = avg_class()
    avg_other_val = avg_other_activities()
    avg_free_val = avg_free_unaccounted()
    print("----------------------------------\n")

    pai_score = ((0.15 * tpi_result) + (0.20 * aai_result) + (0.15 * phai_result) +(0.20 * sri_result) +
     (0.15 * tui_result) + (0.10 * ei_result) +(0.05 * dci_result))

    return {
        "Personal Activity Index: ": round(pai_score, 2),
        "breakdown": {
            "Tech Productivity Index is: ": round(tpi_result, 2),
            "Academic Activity Index: ": round(aai_result, 2),
            "Physical Activity Index: ": round(phai_result, 2),
            "Sleep and Recovery Index: ": round(sri_result, 2),
            "Time Utilisation Index: ": round(tui_result, 2),
            "Experience Index: ": round(ei_result, 2),
            "Active Balance Index: ": round(abi_result, 2),
            "Data Continuity Index": round(dci_result, 2)
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