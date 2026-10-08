import openpyxl as opx
import datetime as dt
import math


string_to_value = {"Feeling" :{"Excellent":5, "Good":4, "Neutral":3,"Low":2,"Stressed":1},
                              "Satisfaction":{"Verysatisfied":5, "Satisfied":4, "Neutral":3, "Unsatisfied":2, "veryunsatisfied":1},
                              "Energy":{"High":3, "Medium":2, "Low":1}}


#The main function (Personal Activity Index)
def pai(filename, sheet_name):
    try:
        wb = opx.load_workbook(filename, data_only=True)
    except FileNotFoundError:
        return {"error": f"The file '{filename}' was not found. Please check the path."}
    except Exception as e: 
        return {"error": f"Failed to load Excel file '{filename}': {str(e)}"}

    try:
        ws = wb[sheet_name]
    except KeyError:
        return {"error": f"Sheet '{sheet_name}' not found. Available sheets: {wb.sheetnames}"}


    # looping row 5 to get column positions
    column_list = {}
    for idx, cell in enumerate(ws[5]):
        if cell.value:
            val = str(cell.value).strip().lower().split('(')[0].strip()
            column_list[val] = idx


    # calculating how many days in the tracking window
    expected_days = (dt.datetime(2026, 9, 21) - dt.datetime(2026, 8, 13)).days + 1

    # count rows where student actually logged data
    tracked_index = column_list.get("total tracked")
    valid_days = 0
    for row in ws.iter_rows(min_row=7, max_row=6+expected_days, values_only=True):
        if tracked_index is not None and tracked_index < len(row):
            val = row[tracked_index]
            if isinstance(val, (int, float)) and val > 0:
                valid_days += 1

    missing_or_invalid_days = expected_days - valid_days

    print(f"\n[Audit] Expected Days in Range: {expected_days}")
    print(f"[Audit] Actual Valid Days with Data: {valid_days}")
    print(f"[Audit] Missing or Invalid (Nil/Zero) Days: {expected_days - valid_days}\n")


    def tpi():
        _coding = 0
        if "coding" not in column_list:
            return 0
        for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
            val = row[column_list["coding"]]
            if isinstance(val, (int, float)):
                _coding += val
        tpi_val = _coding / valid_days if valid_days > 0 else 0;
        print(f"[TPI] Tech Productivity Index: Total Coding = {round(tpi_val, 2)} mins/day")
        _r = tpi_val
        return _r


    def aai():
        sum_of_study = 0
        sum_of_class = 0
        if "study" not in column_list or "class" not in column_list:
            print("Invalid column for AAI calculation")
            return 0
        for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
            sv = row[column_list["study"]]
            cv = row[column_list["class"]]
            if isinstance(sv, (int, float)): sum_of_study += sv
            if isinstance(cv, (int, float)): sum_of_class += cv
        aai_val = (sum_of_study + sum_of_class) / valid_days if valid_days > 0 else 0
        print(f"[AAI] Academic Activity Index: Study+Class = {round(aai_val, 2)} mins/day")
        _r = aai_val
        return _r


    def phai():
        _fitness = 0
        if "fitness" not in column_list:
            return 0
        for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
            val = row[column_list["fitness"]]
            if isinstance(val, (int, float)):
                _fitness += val
        phai_val = _fitness / valid_days if valid_days > 0 else 0;
        print(f"[PhAI] Physical Health Activity Index: Fitness = {round(phai_val, 2)} mins/day")
        _r = phai_val
        return _r


    def sri():
        _sleep = 0
        if "sleep" not in column_list:
            return 0
        for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
            val = row[column_list["sleep"]]
            if isinstance(val, (int, float)):
                _sleep += val
        sri_val = _sleep / valid_days if valid_days > 0 else 0;
        print(f"[SRI] Sleep Regularity Index: Sleep avg = {round(sri_val, 2)} mins/day")
        _r = sri_val
        return _r


    def abi():
        _free = 0
        if "free/unaccounted" not in column_list:
            return 0
        for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
            val = row[column_list["free/unaccounted"]]
            if isinstance(val, (int, float)):
                _free += val
        abi_val = _free / valid_days if valid_days > 0 else 0;
        print(f"[ABI] Active Balance Index: Free/Unaccounted = {round(abi_val, 2)} mins/day")
        _r = abi_val
        return _r


    def tui():
        _tracked = 0
        if "total tracked" not in column_list:
            return 0
        for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
            val = row[column_list["total tracked"]]
            if isinstance(val, (int, float)):
                _tracked += val
        tui_val = _tracked / valid_days if valid_days > 0 else 0;
        print(f"[TUI] Time Utility Index: Total tracked avg = {round(tui_val, 2)} mins/day")
        _r = tui_val
        return _r


    def ei():
        # convert qualitative responses to numeric score
        if "day's feeling" not in column_list or "satisfaction level" not in column_list or "energy level" not in column_list:
            print("EI columns missing")
            return 0
        sentiment_sum = 0
        feeling_column_idx = column_list["day's feeling"]
        satisfaction_column_idx = column_list["satisfaction level"]
        energy_column_idx = column_list["energy level"]
        for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
            raw_feeling = row[feeling_column_idx]
            raw_satisfaction = row[satisfaction_column_idx]
            raw_energy = row[energy_column_idx]
            val_feeling = string_to_value["Feeling"].get(raw_feeling.strip().title() if raw_feeling else "", 0)
            val_satisfaction = string_to_value["Satisfaction"].get(raw_satisfaction.strip().title().replace(" ", "") if raw_satisfaction else "", 0)
            val_energy = string_to_value["Energy"].get(raw_energy.strip().title() if raw_energy else "", 0)
            sentiment_sum += val_feeling + val_satisfaction + val_energy
        formula_denominator = 13 * valid_days
        if valid_days > 0 and formula_denominator > 0:
            ei_val = round((sentiment_sum / formula_denominator) * 5, 2)
        else:
            ei_val = 0
        print(f"[EI] Emotional Index: Raw Sentiment = {ei_val}")
        _r = ei_val
        return _r


    def dci():
        if "total tracked" not in column_list:
            print("Error: 'total tracked' column missing.")
            return 0
        continuity_score = (valid_days / expected_days) * 100 if expected_days > 0 else 0
        print(f"[DCI] Data Continuity Index = {valid_days}/{expected_days} ({round(continuity_score, 2)}%)")
        _r = continuity_score
        return _r

    def avg_study():
        s = 0
        idx_s = column_list.get("study")
        if idx_s is None: return 0
        for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
            if isinstance(row[idx_s], (int, float)):
                s += row[idx_s]
        result = s / valid_days if valid_days > 0 else 0
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
        if class_col in column_list:
            idx = column_list[class_col]
            for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
                val = row[idx]
                if isinstance(val, (int, float)):
                    c += val
        res = c / valid_days if valid_days > 0 else 0
        print(f"[Avg Class] Total = {c} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")
        return res


    def avg_other_activities():
        sum_of_other = 0
        other_col = "other activities" if "other activities" in column_list else ("other" if "other" in column_list else None)
        if other_col is not None:
            idx = column_list[other_col]
            for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
                val = row[idx]
                if isinstance(val, (int, float)):
                    sum_of_other += val
        res = sum_of_other / valid_days if valid_days > 0 else 0
        print(f"[Avg Other Activities] Total = {sum_of_other} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")
        return res


    def avg_free_unaccounted():
        return abi()

    print("--- Executing Sub-Calculations ---")
    tpi_val = tpi()
    aai_val = aai()
    phai_val = phai()
    sri_val = sri()
    tui_val = tui()
    ei_val = ei()
    abi_val = abi()
    dci_val = dci()

    # Calculate requested daily averages
    avg_sleep_val = avg_sleep()
    avg_fitness_val = avg_fitness()
    avg_study_val = avg_study()
    avg_coding_val = avg_coding()
    avg_class_val = avg_class()
    avg_other_val = avg_other_activities()
    avg_free_val = avg_free_unaccounted()
    print("----------------------------------\n")

    # weighted formula to get final PAI score
    final_pai = ((0.15 * tpi_val) + (0.20 * aai_val) + (0.15 * phai_val) +(0.20 * sri_val) +
     (0.15 * tui_val) + (0.10 * ei_val) +(0.05 * dci_val))

    return {
        "Personal Activity Index: ": round(final_pai, 2),
        "breakdown": {
            "Tech Productivity Index is: ": round(tpi_val, 2),
            "Academic Activity Index: ": round(aai_val, 2),
            "Physical Activity Index: ": round(phai_val, 2),
            "Sleep and Recovery Index: ": round(sri_val, 2),
            "Time Utilisation Index: ": round(tui_val, 2),
            "Experience Index: ": round(ei_val, 2),
            "Active Balance Index: ": round(abi_val, 2),
            "Data Continuity Index": round(dci_val, 2)
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