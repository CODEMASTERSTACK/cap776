import { generateUniqueStudentPythonCode } from './src/utils/studentCodeGenerator.js';
import crypto from 'crypto';
import { writeFileSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';

console.log('\n=== FULL AUDIT: New Nested-Function Generator ===\n');

const samples = [];
const tmpDir = './tmp_audit';
try { mkdirSync(tmpDir); } catch(e) {}

for (let i = 0; i < 20; i++) {
    const code = generateUniqueStudentPythonCode({ startDate: '2026-08-13' });
    const lines = code.split('\n').length;
    const hash = crypto.createHash('md5').update(code).digest('hex').slice(0, 8);

    // Write to temp file and syntax-check
    const tmpFile = `${tmpDir}/sample_${i}.py`;
    writeFileSync(tmpFile, code, 'utf-8');
    let syntaxOk = false;
    try {
        execSync(`python -m py_compile ${tmpFile}`, { stdio: 'pipe' });
        syntaxOk = true;
    } catch(e) {
        syntaxOk = false;
    }

    // Structure checks
    const hasNestedTPI = /^    def tpi\(\):/m.test(code);
    const hasNestedAAI = /^    def aai\(\):/m.test(code);
    const hasNestedEI = /^    def ei\(\):/m.test(code);
    const hasNestedDCI = /^    def dci\(\):/m.test(code);
    const hasAvgStudy = /def avg_study\(\):/m.test(code);
    const hasTopLevelPai = /^def pai\(filename, sheet_name\):/m.test(code);
    const hasStringToValue = /^string_to_value = /m.test(code);
    const hasClass = /^class /m.test(code);
    const hasWeightedFormula = /0\.15.*tpi|tpi.*0\.15/i.test(code);

    const allStructureOk = hasNestedTPI && hasNestedAAI && hasNestedEI && hasNestedDCI 
        && hasAvgStudy && hasTopLevelPai && hasStringToValue && !hasClass && hasWeightedFormula;

    samples.push({ i: i+1, lines, hash, syntaxOk, allStructureOk, hasClass });
    
    const status = syntaxOk && allStructureOk ? '✅' : '❌';
    console.log(`${status} Sample ${String(i+1).padStart(2)} | ${lines} lines | hash=${hash} | syntax=${syntaxOk ? 'OK' : 'FAIL'} | struct=${allStructureOk ? 'OK' : 'FAIL'} | class=${hasClass ? 'YES-BAD' : 'none'}`);
}

const lineCounts = samples.map(s => s.lines);
const syntaxPass = samples.filter(s => s.syntaxOk).length;
const structPass = samples.filter(s => s.allStructureOk).length;
const uniqueHashes = new Set(samples.map(s => s.hash)).size;

console.log('\n=== SUMMARY ===');
console.log(`Lines: min=${Math.min(...lineCounts)} max=${Math.max(...lineCounts)} avg=${Math.round(lineCounts.reduce((a,b)=>a+b,0)/lineCounts.length)}`);
console.log(`Syntax valid: ${syntaxPass}/20`);
console.log(`Structure valid: ${structPass}/20`);
console.log(`Unique files: ${uniqueHashes}/20`);
