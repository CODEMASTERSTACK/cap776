/**
 * Raw text content of project.py for client-side download
 */
export const PROJECT_PYTHON_CODE = `import openpyxl as opx
import datetime as dt
import math


string_to_value = {"Feeling" :{"Excellent":5, "Good":4, "Neutral":3,"Low":2,"Stressed":1},
                              "Satisfaction":{"Verysatisfied":5, "Satisfied":4, "Neutral":3, "Unsatisfied":2, "veryunsatisfied":1},
                              "Energy":{"High":3, "Medium":2, "Low":1}}


#The main fucntion (Personal Activity Index (PAI))
def pai(filename, sheet_name):
    try:
        wb =opx.load_workbook(filename, data_only=True)
    except FileNotFoundError:
        return {"error": f"The file '{filename}' was not found. Please check the path."}
    except Exception as e: 
        return {"error": f"Failed to load Excel file '{filename}': {str(e)}"}

    try:
        ws = wb[sheet_name]
    except KeyError:
        return {"error": f"Sheet '{sheet_name}' not found. Available sheets: {wb.sheetnames}"}


    # Iterating over Row 5 (ws[5]) to correctly capture the actual column headers
    column_list = {}
    for value, cell in enumerate(ws[5]):
        if cell.value:
            column_name = str(cell.value).strip().lower()
            clean_name = column_name.split('(')[0].strip() 
            column_list[clean_name] = value


    #Calculating the default days from 13 Aug - 21th Sep
    expected_days = (dt.datetime(2026, 9, 21) - dt.datetime(2026, 8, 13)).days + 1

    tracked_index = column_list.get("total tracked")
    valid_days = 0

    for row in ws.iter_rows(min_row=7, max_row=6+expected_days, values_only=True):
        if tracked_index is not None and tracked_index < len(row):
            val = row[tracked_index]
            if isinstance(val, (int, float)) and val > 0:
                valid_days += 1

    missing_or_invalid_days = expected_days - valid_days

    print(f"\\n[Audit] Expected Days in Range: {expected_days}")
    print(f"[Audit] Actual Valid Days with Data: {valid_days}")
    print(f"[Audit] Missing or Invalid (Nil/Zero) Days: {missing_or_invalid_days}\\n")


    def tpi():
        sum_of_coding = 0
        coding_column = "coding"
        if coding_column not in column_list:
            print("coding column is not available in your excel sheet.")
            return 0

        index_coding = column_list[coding_column]

        # Iterate and sum up coding minutes starting from row 6
        for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
            coding_val = row[index_coding]
            if isinstance(coding_val, (int, float)):
               sum_of_coding += coding_val

        if valid_days > 0:
               tpi_cal = sum_of_coding / valid_days
        else:
            tpi_cal = 0;
        print(f"[TPI] Tech Productivity Index: Total Coding = {sum_of_coding} mins | Daily Avg = {round(tpi_cal, 2)} mins/day")
        return tpi_cal


    def aai():
        sum_of_study = 0
        sum_of_class = 0

        study_column = "study"
        class_column = "class"

        if study_column not in column_list or class_column not in column_list:
            print("Invalid column for AAI calculation")
            return 0

        index_study = column_list[study_column]
        index_class = column_list[class_column]

        for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
            study_val = row[index_study]
            class_val = row[index_class]

            if isinstance(study_val,(int, float)):
               sum_of_study += study_val
            if isinstance(class_val,(int, float)):
               sum_of_class += class_val

        if valid_days > 0:
               aai_cal = (sum_of_study + sum_of_class) / valid_days
        else:
            aai_cal = 0
        print(f"[AAI] Academic Activity Index: Total Study = {sum_of_study} mins, Total Class = {sum_of_class} mins | Daily Avg = {round(aai_cal, 2)} mins/day")
        return aai_cal

    def phai():
        sum_of_fitness = 0
        fitness_column = "fitness"

        if fitness_column not in column_list:
            print("Invalid column for PhAI calculation")
            return 0

        index_fitness = column_list[fitness_column]

        for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
            fitness_val = row[index_fitness]

            if isinstance(fitness_val,(int, float)):
               sum_of_fitness += fitness_val

        if valid_days > 0:
           phai_cal = sum_of_fitness / valid_days
        else:
            phai_cal = 0
        print(f"[PhAI] Physical Health Activity Index: Total Fitness = {sum_of_fitness} mins | Daily Avg = {round(phai_cal, 2)} mins/day")
        return phai_cal


    def sri():
        sum_of_sleep = 0
        sleep_column = "sleep"

        if sleep_column not in column_list:
            print("Invalid column for SRI calculation.")
            return 0

        for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
            sleep_val = row[column_list[sleep_column]]

            if isinstance(sleep_val,(int, float)):
               sum_of_sleep += sleep_val

        if valid_days > 0:
           sri_cal = sum_of_sleep / valid_days
        else:
            sri_cal = 0
        print(f"[SRI] Sleep Regularity Index: Total Sleep = {sum_of_sleep} mins | Daily Avg = {round(sri_cal, 2)} mins/day")
        return sri_cal

    def abi():
        sum_of_free_unaccount_time = 0
        free_unaccount_time = "free/unaccounted"

        if free_unaccount_time not in column_list:
            print("Invalid column for ABI calculation")
            return 0

        index_free_time = column_list[free_unaccount_time]

        for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
            free_time = row[index_free_time]

            if isinstance(free_time,(int, float)):
               sum_of_free_unaccount_time += free_time

        if valid_days > 0:
           abi_cal = sum_of_free_unaccount_time / valid_days
        else:
            abi_cal = 0
        print(f"[ABI] Active Balance Index: Total Free/Unaccounted = {sum_of_free_unaccount_time} mins | Daily Avg = {round(abi_cal, 2)} mins/day")
        return abi_cal

    def tui():
        sum_of_tracked = 0
        tracked_column = "total tracked"

        if tracked_column not in column_list:
            print("Invalid column in TUI for calculation.")
            return 0

        index_tracked = column_list[tracked_column]

        for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
            tracked_val = row[index_tracked]

            if isinstance(tracked_val,(int, float)):
                 sum_of_tracked += tracked_val

        if valid_days > 0:
           tui_cal = sum_of_tracked / valid_days
        else:
            tui_cal = 0
        print(f"[TUI] Time Utility Index: Total Tracked Time = {sum_of_tracked} mins | Daily Avg = {round(tui_cal, 2)} mins/day")
        return tui_cal

    def ei():
        total_sum = 0

        required_columns = ["day's feeling", "satisfaction level", "energy level"]
        if not all(col in column_list for col in required_columns):
            print("One or more columns for EI calculation are missing.")
            return 0

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

            row_total = val_feeling + val_satisfaction + val_energy
            total_sum += row_total

        formula_denominator = 13 * valid_days

        if valid_days > 0 and formula_denominator > 0:
           ei_cal = (total_sum / formula_denominator) * 5
        else:
            ei_cal = 0
        print(f"[EI] Emotional Index: Raw Sentiment Score Sum = {total_sum} / Max Possible ({formula_denominator}) | Average Score = {round(ei_cal, 2)}")
        return round(ei_cal, 2)

    def dci():
        if "total tracked" not in column_list:
            print("Error: 'total tracked' column missing.")
            return 0

        continuity_score = (valid_days / expected_days) * 100 if expected_days > 0 else 0
        print(f"[The Data Continuity Index is: {valid_days}/{expected_days} valid days ({round(continuity_score, 2)}%)")
        return continuity_score

    # --- Specific Daily Average Functions ---
    def avg_sleep():
        return sri()

    def avg_fitness():
        return phai()

    def avg_study():
        sum_of_study = 0
        study_col = "study"
        if study_col in column_list:
            idx = column_list[study_col]
            for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
                val = row[idx]
                if isinstance(val, (int, float)):
                    sum_of_study += val
        res = sum_of_study / valid_days if valid_days > 0 else 0
        print(f"[Avg Study] Total = {sum_of_study} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")
        return res

    def avg_coding():
        return tpi()

    def avg_class():
        sum_of_class = 0
        class_col = "class"
        if class_col in column_list:
            idx = column_list[class_col]
            for row in ws.iter_rows(min_row=7, max_row=6 + expected_days, values_only=True):
                val = row[idx]
                if isinstance(val, (int, float)):
                    sum_of_class += val
        res = sum_of_class / valid_days if valid_days > 0 else 0
        print(f"[Avg Class] Total = {sum_of_class} mins | Daily Avg = {round(res, 2)} mins/day ({round(res/60, 2)} hrs/day)")
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
    print("----------------------------------\\n")

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
`;

export { generateUniqueStudentPythonCode } from './studentCodeGenerator';
