import openpyxl as opx
import datetime as dt
import math


string_to_value = {"Feeling" :{"Excellent":5, "Good":4, "Neutral":3,"Low":2,"Stressed":1},
                              "Satisfaction":{"Verysatisfied":5, "Satisfied":4, "Neutral":3, "Unsatisfied":2, "veryunsatisfied":1},
                              "Energy":{"High":3, "Medium":2, "Low":1}}


#The main function (Personal Activity Index)
def pai(filename, sheet_name):
    try:
        student_wb = opx.load_workbook(filename, data_only=True)
    except FileNotFoundError:
        return {"error": f"The file '{filename}' was not found. Please check the path."}
    except Exception as e: 
        return {"error": f"Failed to load Excel file '{filename}': {str(e)}"}

    try:
        student_ws = student_wb[sheet_name]
    except KeyError:
        return {"error": f"Sheet '{sheet_name}' not found. Available sheets: {student_wb.sheetnames}"}


    # looping row 5 to get column positions
    col_dict = {}
    for c_idx, cell in enumerate(student_ws[5]):
        if cell.value:
            each_val = str(cell.value).strip().lower().split('(')[0].strip()
            col_dict[each_val] = c_idx


    # calculating how many days in the tracking window
    expected_count = (dt.datetime(2026, 9, 21) - dt.datetime(2026, 8, 13)).days + 1

    # count rows where student actually logged data
    valid_count = 0
    _ti = col_dict.get("total tracked")
    for each_row in student_ws.iter_rows(min_row=7, max_row=6+expected_count, values_only=True):
        if _ti is not None and _ti < len(each_row):
            each_val = each_row[_ti]
            if isinstance(each_val, (int, float)) and each_val > 0:
                valid_count += 1

    missing_or_invalid_days = expected_count - valid_count

    print(f"\n[Audit] Expected Days in Range: {expected_count}")
    print(f"[Audit] Actual Valid Days with Data: {valid_count}")
    print(f"[Audit] Missing or Invalid (Nil/Zero) Days: {expected_count - valid_count}\n")


    def tpi():
        _coding = 0
        if "coding" not in col_dict:
            return 0
        for each_row in student_ws.iter_rows(min_row=7, max_row=6 + expected_count, values_only=True):
            each_val = each_row[col_dict["coding"]]
            if isinstance(each_val, (int, float)):
                _coding += each_val
        tpi_metric = _coding / valid_count if valid_count > 0 else 0
        print(f"[TPI] Tech Productivity Index: Total Coding = {round(tpi_metric, 2)} mins/day")
        return tpi_metric


    def aai():
        sum_of_study = 0
        sum_of_class = 0
        if "study" not in col_dict or "class" not in col_dict:
            print("Invalid column for AAI calculation")
            return 0
        for each_row in student_ws.iter_rows(min_row=7, max_row=6 + expected_count, values_only=True):
            sv = each_row[col_dict["study"]]
            cv = each_row[col_dict["class"]]
            if isinstance(sv, (int, float)): sum_of_study += sv
            if isinstance(cv, (int, float)): sum_of_class += cv
        aai_metric = (sum_of_study + sum_of_class) / valid_count if valid_count > 0 else 0
        print(f"[AAI] Academic Activity Index: Study+Class = {round(aai_metric, 2)} mins/day")
        return aai_metric


    def phai():
        _fitness = 0
        if "fitness" not in col_dict:
            return 0
        for each_row in student_ws.iter_rows(min_row=7, max_row=6 + expected_count, values_only=True):
            each_val = each_row[col_dict["fitness"]]
            if isinstance(each_val, (int, float)):
                _fitness += each_val
        phai_metric = _fitness / valid_count if valid_count > 0 else 0
        print(f"[PhAI] Physical Health Activity Index: Fitness = {round(phai_metric, 2)} mins/day")
        return phai_metric


    def sri():
        _sleep = 0
        if "sleep" not in col_dict:
            return 0
        for each_row in student_ws.iter_rows(min_row=7, max_row=6 + expected_count, values_only=True):
            each_val = each_row[col_dict["sleep"]]
            if isinstance(each_val, (int, float)):
                _sleep += each_val
        sri_metric = _sleep / valid_count if valid_count > 0 else 0
        print(f"[SRI] Sleep Regularity Index: Sleep avg = {round(sri_metric, 2)} mins/day")
        return sri_metric


    def abi():
        _free = 0
        if "free/unaccounted" not in col_dict:
            return 0
        for each_row in student_ws.iter_rows(min_row=7, max_row=6 + expected_count, values_only=True):
            each_val = each_row[col_dict["free/unaccounted"]]
            if isinstance(each_val, (int, float)):
                _free += each_val
        abi_metric = _free / valid_count if valid_count > 0 else 0
        print(f"[ABI] Active Balance Index: Free/Unaccounted = {round(abi_metric, 2)} mins/day")
        return abi_metric


    def tui():
        _tracked = 0
        if "total tracked" not in col_dict:
            return 0
        for each_row in student_ws.iter_rows(min_row=7, max_row=6 + expected_count, values_only=True):
            each_val = each_row[col_dict["total tracked"]]
            if isinstance(each_val, (int, float)):
                _tracked += each_val
        tui_metric = _tracked / valid_count if valid_count > 0 else 0
        print(f"[TUI] Time Utility Index: Total tracked avg = {round(tui_metric, 2)} mins/day")
        return tui_metric


    def ei():
        # convert qualitative responses to numeric score
        required_columns = ["day's feeling", "satisfaction level", "energy level"]
        if not all(col in col_dict for col in required_columns):
            print("One or more columns for EI calculation are missing.")
            return 0
        sentiment_aggregate = 0
        feeling_column_idx = col_dict["day's feeling"]
        satisfaction_column_idx = col_dict["satisfaction level"]
        energy_column_idx = col_dict["energy level"]
        for each_row in student_ws.iter_rows(min_row=7, max_row=6 + expected_count, values_only=True):
            raw_feeling = each_row[feeling_column_idx]
            raw_satisfaction = each_row[satisfaction_column_idx]
            raw_energy = each_row[energy_column_idx]
            val_feeling = string_to_value["Feeling"].get(raw_feeling.strip().title() if raw_feeling else "", 0)
            val_satisfaction = string_to_value["Satisfaction"].get(raw_satisfaction.strip().title().replace(" ", "") if raw_satisfaction else "", 0)
            val_energy = string_to_value["Energy"].get(raw_energy.strip().title() if raw_energy else "", 0)
            sentiment_aggregate += val_feeling + val_satisfaction + val_energy
        total_possible = 13 * valid_count
        if valid_count > 0 and total_possible > 0:
            ei_metric = round((sentiment_aggregate / total_possible) * 5, 2)
        else:
            ei_metric = 0
        print(f"[EI] Emotional Index: Raw Sentiment = {ei_metric}")
        return ei_metric


    def dci():
        if "total tracked" not in col_dict:
            print("Error: 'total tracked' column missing.")
            return 0
        continuity_score = (valid_count / expected_count) * 100 if expected_count > 0 else 0
        print(f"[DCI] Data Continuity Index = {valid_count}/{expected_count} ({round(continuity_score, 2)}%)")
        return continuity_score

    def avg_study():
        s = 0
        idx_s = col_dict.get("study")
        if idx_s is None: return 0
        for each_row in student_ws.iter_rows(min_row=7, max_row=6 + expected_count, values_only=True):
            if isinstance(each_row[idx_s], (int, float)):
                s += each_row[idx_s]
        result = s / valid_count if valid_count > 0 else 0
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
        if class_col in col_dict:
            idx = col_dict[class_col]
            for each_row in student_ws.iter_rows(min_row=7, max_row=6 + expected_count, values_only=True):
                each_val = each_row[idx]
                if isinstance(each_val, (int, float)):
                    c += each_val
        res = c / valid_count if valid_count > 0 else 0
        print(f"[Avg Class] Total = {c} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")
        return res


    def avg_other_activities():
        sum_of_other = 0
        other_col = "other activities" if "other activities" in col_dict else ("other" if "other" in col_dict else None)
        if other_col is not None:
            idx = col_dict[other_col]
            for each_row in student_ws.iter_rows(min_row=7, max_row=6 + expected_count, values_only=True):
                each_val = each_row[idx]
                if isinstance(each_val, (int, float)):
                    sum_of_other += each_val
        res = sum_of_other / valid_count if valid_count > 0 else 0
        print(f"[Avg Other Activities] Total = {sum_of_other} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")
        return res


    def avg_free_unaccounted():
        return abi()

    print("--- Executing Sub-Calculations ---")
    tpi_metric = tpi()
    aai_metric = aai()
    phai_metric = phai()
    sri_metric = sri()
    tui_metric = tui()
    ei_metric = ei()
    abi_metric = abi()
    dci_metric = dci()

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
    composite_pai = ((0.15 * tpi_metric) + (0.20 * aai_metric) + (0.15 * phai_metric) +(0.20 * sri_metric) +
     (0.15 * tui_metric) + (0.10 * ei_metric) +(0.05 * dci_metric))

    return {
        "Personal Activity Index: ": round(composite_pai, 2),
        "breakdown": {
            "Tech Productivity Index is: ": round(tpi_metric, 2),
            "Academic Activity Index: ": round(aai_metric, 2),
            "Physical Activity Index: ": round(phai_metric, 2),
            "Sleep and Recovery Index: ": round(sri_metric, 2),
            "Time Utilisation Index: ": round(tui_metric, 2),
            "Experience Index: ": round(ei_metric, 2),
            "Active Balance Index: ": round(abi_metric, 2),
            "Data Continuity Index": round(dci_metric, 2)
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