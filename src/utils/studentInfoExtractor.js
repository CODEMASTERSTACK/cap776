/**
 * Extracts student metadata (Name, Registration Number, Course/Section)
 * from the first 5 rows of the CAP776 student tracking Excel sheet.
 */
export function extractStudentMetadata(rows = []) {
  const result = {
    name: '',
    regNo: '',
    section: '',
    month: ''
  };

  if (!rows || rows.length === 0) return result;

  // Scan top 6 rows
  const maxScanRows = Math.min(6, rows.length);

  for (let r = 0; r < maxScanRows; r++) {
    const row = rows[r] || [];
    
    for (let c = 0; c < row.length; c++) {
      const rawVal = String(row[c] || '').trim();
      const lower = rawVal.toLowerCase();

      // 1. Detect Name: (e.g. "Name:" in cell A2, name in B2..D2)
      if (lower.startsWith('name') && !result.name) {
        // Look ahead in adjacent cells on this row
        for (let next = c + 1; next < Math.min(c + 5, row.length); next++) {
          const candidate = String(row[next] || '').trim();
          if (candidate && !candidate.toLowerCase().includes('registration') && !candidate.toLowerCase().includes('course')) {
            result.name = candidate;
            break;
          }
        }
      }

      // 2. Detect Registration No (e.g. "Registration" in E2, number in F2..H2)
      if ((lower.includes('reg') || lower.includes('registration')) && !result.regNo) {
        for (let next = c + 1; next < Math.min(c + 5, row.length); next++) {
          const candidate = String(row[next] || '').trim();
          // Registration number is typically numeric digits
          if (candidate && (/\d{5,}/.test(candidate) || !candidate.toLowerCase().includes('month'))) {
            result.regNo = candidate;
            break;
          }
        }
      }

      // 3. Detect Course / Section (e.g. "Course / Sec" in A3, section code in B3)
      if ((lower.includes('course') || lower.includes('sec')) && !result.section) {
        for (let next = c + 1; next < Math.min(c + 4, row.length); next++) {
          const candidate = String(row[next] || '').trim();
          if (candidate && !candidate.toLowerCase().includes('month')) {
            result.section = candidate;
            break;
          }
        }
      }

      // 4. Detect Month
      if (lower.includes('month') && !result.month) {
        for (let next = c + 1; next < Math.min(c + 4, row.length); next++) {
          const candidate = String(row[next] || '').trim();
          if (candidate) {
            result.month = candidate;
            break;
          }
        }
      }
    }
  }

  return result;
}
