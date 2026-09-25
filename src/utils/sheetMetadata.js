/**
 * Utility to parse header metadata (Author, Course, Session) from spreadsheet header rows.
 */
export function extractSheetMetadata(rows = []) {
  const result = {
    name: '',
    regNo: '',
    section: '',
    month: ''
  };

  if (!rows || rows.length === 0) return result;

  const maxScanRows = Math.min(6, rows.length);

  for (let r = 0; r < maxScanRows; r++) {
    const row = rows[r] || [];
    
    for (let c = 0; c < row.length; c++) {
      const rawVal = String(row[c] || '').trim();
      const lower = rawVal.toLowerCase();

      // 1. Detect Name field
      if (lower.startsWith('name') && !result.name) {
        for (let next = c + 1; next < Math.min(c + 5, row.length); next++) {
          const candidate = String(row[next] || '').trim();
          if (candidate && !candidate.toLowerCase().includes('registration') && !candidate.toLowerCase().includes('course')) {
            result.name = candidate;
            break;
          }
        }
      }

      // 2. Detect Registration ID
      if ((lower.includes('reg') || lower.includes('registration')) && !result.regNo) {
        for (let next = c + 1; next < Math.min(c + 5, row.length); next++) {
          const candidate = String(row[next] || '').trim();
          if (candidate && (/\d{5,}/.test(candidate) || !candidate.toLowerCase().includes('month'))) {
            result.regNo = candidate;
            break;
          }
        }
      }

      // 3. Detect Course / Section
      if ((lower.includes('course') || lower.includes('sec')) && !result.section) {
        for (let next = c + 1; next < Math.min(c + 4, row.length); next++) {
          const candidate = String(row[next] || '').trim();
          if (candidate && !candidate.toLowerCase().includes('month')) {
            result.section = candidate;
            break;
          }
        }
      }

      // 4. Detect Month / Period
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
