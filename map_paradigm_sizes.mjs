// Map actual sizes per paradigm by running 20 samples and detecting paradigm from content
import { generateUniqueStudentPythonCode } from './src/utils/studentCodeGenerator.js';

const results = { single_pass: [], list_buffering: [], modular_multi_pass: [], oop_class: [], thorough_academic: [] };

for (let i = 0; i < 100; i++) {
    const code = generateUniqueStudentPythonCode({ startDate: '2026-08-13' });
    const lines = code.split('\n').length;
    
    let paradigm = 'single_pass';
    if (/class PAIAnalyticsEngine|class PAICalculator|class StudentPAI/i.test(code)) paradigm = 'oop_class';
    else if (/def compute_tpi.*\ndef compute_aai|def calc_tpi|def modular|def run_phase/i.test(code)) paradigm = 'modular_multi_pass';
    else if (/row_buffer|daily_rows|data_buffer|activity_rows/i.test(code)) paradigm = 'list_buffering';
    else if (/thorough|comprehensive|detailed_analysis|academic_report|======.*THOROUGH/i.test(code)) paradigm = 'thorough_academic';
    
    results[paradigm].push(lines);
}

console.log('\n=== LINE COUNT DISTRIBUTION PER PARADIGM (100 samples) ===\n');
for (const [name, sizes] of Object.entries(results)) {
    if (sizes.length === 0) { console.log(`${name}: NOT SAMPLED`); continue; }
    const min = Math.min(...sizes);
    const max = Math.max(...sizes);
    const avg = Math.round(sizes.reduce((a,b) => a+b, 0) / sizes.length);
    console.log(`${name.padEnd(20)} | samples=${String(sizes.length).padStart(2)} | min=${min} max=${max} avg=${avg}`);
}
console.log('\nAll raw sizes:', JSON.stringify(results, null, 2));
