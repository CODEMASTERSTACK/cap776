import openpyxl as opx
import datetime as dt
import math


string_to_value = {"Feeling" :{"Excellent":5, "Good":4, "Neutral":3,"Low":2,"Stressed":1},
                              "Satisfaction":{"Verysatisfied":5, "Satisfied":4, "Neutral":3, "Unsatisfied":2, "veryunsatisfied":1},
                              "Energy":{"High":3, "Medium":2, "Low":1}}


#The main function (Personal Activity Index)
def pai(filename, sheet_name):
    try:
        workbook = opx.load_workbook(filename, data_only=True)
    except FileNotFoundError:
        return {"error": f"The file '{filename}' was not found. Please check the path."}
    except Exception as e: 
        return {"error": f"Failed to load Excel file '{filename}': {str(e)}"}

    try:
        worksheet = workbook[sheet_name]
    except KeyError:
        return {"error": f"Sheet '{sheet_name}' not found. Available sheets: {workbook.sheetnames}"}


    # looping row 5 to get column positions
    col_indices = {}
    for col_i, cell in enumerate(worksheet[5]):
        if cell.value:
            v = str(cell.value).strip().lower().split('(')[0].strip()
            col_indices[v] = col_i


    # calculating how many days in the tracking window
    total_days = (dt.datetime(2026, 9, 21) - dt.datetime(2026, 8, 13)).days + 1

    # count rows where student actually logged data
    valid_days_count = 0
    _ti = col_indices.get("total tracked")
    for r in worksheet.iter_rows(min_row=7, max_row=6+total_days, values_only=True):
        if _ti is not None and _ti < len(r):
            v = r[_ti]
            if isinstance(v, (int, float)) and v > 0:
                valid_days_count += 1

    missing_or_invalid_days = total_days - valid_days_count

    print(f"\n[Audit] Expected Days in Range: {total_days}")
    print(f"[Audit] Actual Valid Days with Data: {valid_days_count}")
    print(f"[Audit] Missing or Invalid (Nil/Zero) Days: {total_days - valid_days_count}\n")


    def tpi():
        # TODO: handle if sheet has extra empty rows

        _coding = 0
        if "coding" not in col_indices:
            return 0
        for r in worksheet.iter_rows(min_row=7, max_row=6 + total_days, values_only=True):
            v = r[col_indices["coding"]]
            if isinstance(v, (int, float)):
                _coding += v
        tpi_score = _coding / valid_days_count if valid_days_count > 0 else 0;
        print(f"[TPI] Tech Productivity Index = {round(tpi_score, 2)} mins/day")
        return tpi_score


    def aai():
        sum_of_study = 0
        sum_of_class = 0
        if "study" not in col_indices or "class" not in col_indices:
            print("Invalid column for AAI calculation")
            return 0
        for r in worksheet.iter_rows(min_row=7, max_row=6 + total_days, values_only=True):
            sv = r[col_indices["study"]]
            cv = r[col_indices["class"]]
            if isinstance(sv, (int, float)): sum_of_study += sv
            if isinstance(cv, (int, float)): sum_of_class += cv
        aai_score = (sum_of_study + sum_of_class) / valid_days_count if valid_days_count > 0 else 0
        print(f"[AAI] Academic Activity Index = {round(aai_score, 2)} mins/day")
        return aai_score


    def phai():
        _fitness = 0
        if "fitness" not in col_indices:
            return 0
        for r in worksheet.iter_rows(min_row=7, max_row=6 + total_days, values_only=True):
            v = r[col_indices["fitness"]]
            if isinstance(v, (int, float)):
                _fitness += v
        phai_score = _fitness / valid_days_count if valid_days_count > 0 else 0;
        print(f"[PhAI] Physical Health Activity Index = {round(phai_score, 2)} mins/day")
        return phai_score


    def sri():
        _sleep = 0
        if "sleep" not in col_indices:
            return 0
        for r in worksheet.iter_rows(min_row=7, max_row=6 + total_days, values_only=True):
            v = r[col_indices["sleep"]]
            if isinstance(v, (int, float)):
                _sleep += v
        sri_score = _sleep / valid_days_count if valid_days_count > 0 else 0;
        print(f"[SRI] Sleep Regularity Index = {round(sri_score, 2)} mins/day")
        return sri_score


    def abi():
        _free = 0
        if "free/unaccounted" not in col_indices:
            return 0
        for r in worksheet.iter_rows(min_row=7, max_row=6 + total_days, values_only=True):
            v = r[col_indices["free/unaccounted"]]
            if isinstance(v, (int, float)):
                _free += v
        abi_score = _free / valid_days_count if valid_days_count > 0 else 0;
        print(f"[ABI] Active Balance Index = {round(abi_score, 2)} mins/day")
        return abi_score


    def tui():
        _tracked = 0
        if "total tracked" not in col_indices:
            return 0
        for r in worksheet.iter_rows(min_row=7, max_row=6 + total_days, values_only=True):
            v = r[col_indices["total tracked"]]
            if isinstance(v, (int, float)):
                _tracked += v
        tui_score = _tracked / valid_days_count if valid_days_count > 0 else 0;
        print(f"[TUI] Time Utility Index = {round(tui_score, 2)} mins/day")
        return tui_score


    def ei():
        # convert qualitative responses to numeric score
        required_columns = ["day's feeling", "satisfaction level", "energy level"]
        if not all(col in col_indices for col in required_columns):
            print("One or more columns for EI calculation are missing.")
            return 0
        raw_sentiment = 0
        feeling_column_idx = col_indices["day's feeling"]
        satisfaction_column_idx = col_indices["satisfaction level"]
        energy_column_idx = col_indices["energy level"]
        for r in worksheet.iter_rows(min_row=7, max_row=6 + total_days, values_only=True):
            raw_feeling = r[feeling_column_idx]
            raw_satisfaction = r[satisfaction_column_idx]
            raw_energy = r[energy_column_idx]
            val_feeling = string_to_value["Feeling"].get(raw_feeling.strip().title() if raw_feeling else "", 0)
            val_satisfaction = string_to_value["Satisfaction"].get(raw_satisfaction.strip().title().replace(" ", "") if raw_satisfaction else "", 0)
            val_energy = string_to_value["Energy"].get(raw_energy.strip().title() if raw_energy else "", 0)
            raw_sentiment += val_feeling + val_satisfaction + val_energy
        denominator = 13 * valid_days_count
        if valid_days_count > 0 and denominator > 0:
            ei_score = round((raw_sentiment / denominator) * 5, 2)
        else:
            ei_score = 0
        print(f"[EI] Emotional Index = {ei_score}")
        return ei_score


    def dci():
        if "total tracked" not in col_indices:
            print("Error: 'total tracked' column missing.")
            return 0
        continuity_score = (valid_days_count / total_days) * 100 if total_days > 0 else 0
        print(f"[DCI] Data Continuity Index = {valid_days_count}/{total_days} ({round(continuity_score, 2)}%)")
        return continuity_score

    def avg_study():
        s = 0
        idx_s = col_indices.get("study")
        if idx_s is None: return 0
        for r in worksheet.iter_rows(min_row=7, max_row=6 + total_days, values_only=True):
            if isinstance(r[idx_s], (int, float)):
                s += r[idx_s]
        result = s / valid_days_count if valid_days_count > 0 else 0
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
        if class_col in col_indices:
            idx = col_indices[class_col]
            for r in worksheet.iter_rows(min_row=7, max_row=6 + total_days, values_only=True):
                v = r[idx]
                if isinstance(v, (int, float)):
                    c += v
        res = c / valid_days_count if valid_days_count > 0 else 0
        print(f"[Avg Class] Total = {c} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")
        return res


    def avg_other_activities():
        sum_of_other = 0
        other_col = "other activities" if "other activities" in col_indices else ("other" if "other" in col_indices else None)
        if other_col is not None:
            idx = col_indices[other_col]
            for r in worksheet.iter_rows(min_row=7, max_row=6 + total_days, values_only=True):
                v = r[idx]
                if isinstance(v, (int, float)):
                    sum_of_other += v
        res = sum_of_other / valid_days_count if valid_days_count > 0 else 0
        print(f"[Avg Other Activities] Total = {sum_of_other} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")
        return res


    def avg_free_unaccounted():
        return abi()

    print("--- Executing Sub-Calculations ---")
    tpi_score = tpi()
    aai_score = aai()
    phai_score = phai()
    sri_score = sri()
    tui_score = tui()
    ei_score = ei()
    abi_score = abi()
    dci_score = dci()

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
    overall_pai = ((0.15 * tpi_score) + (0.20 * aai_score) + (0.15 * phai_score) +(0.20 * sri_score) +
     (0.15 * tui_score) + (0.10 * ei_score) +(0.05 * dci_score))

    return {
        "Personal Activity Index: ": round(overall_pai, 2),
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
            "Average Sleep/day": f"{round(avg_sleep_val, 2)} mins/day ({round(avg_sleep_val/60, 2)} hrs/day)",
            "Average Fitness/day": f"{round(avg_fitness_val, 2)} mins/day ({round(avg_fitness_val/60, 2)} hrs/day)",
            "Average Study/day": f"{round(avg_study_val, 2)} mins/day ({round(avg_study_val/60, 2)} hrs/day)",
            "Average Coding/day": f"{round(avg_coding_val, 2)} mins/day ({round(avg_coding_val/60, 2)} hrs/day)",
            "Average Class/day": f"{round(avg_class_val, 2)} mins/day ({round(avg_class_val/60, 2)} hrs/day)",
            "Average Other Activities/day": f"{round(avg_other_val, 2)} mins/day ({round(avg_other_val/60, 2)} hrs/day)",
            "Average Free / Unaccounted Time/day": f"{round(avg_free_val, 2)} mins/day ({round(avg_free_val/60, 2)} hrs/day)"
        }
    }