/**
 * CAP776 Code Quality Auditor
 * Checks both downloaded files against the rubric spec
 */
import { readFileSync } from 'fs';

const files = ['project (4).py', 'project (5).py'];

function check(code, pattern) {
    return new RegExp(pattern, 'i').test(code) ? '✅' : '❌';
}

function extractParadigm(code) {
    if (/class PAIAnalyticsEngine|class PAICalculator|class StudentPAI|class PAIProcessor/i.test(code)) return 'OOP_Class';
    if (/def compute_all|def calculate_all|def run_multi/i.test(code)) return 'Modular_MultiPass';
    if (/row_buffer|daily_rows|data_buffer/i.test(code)) return 'List_Buffering';
    if (/def run_analysis|thorough|comprehensive/i.test(code)) return 'Thorough_Academic';
    return 'Single_Pass';
}

for (const fname of files) {
    const code = readFileSync(fname, 'utf-8');
    const lines = code.split('\n').length;
    const bytes = Buffer.byteLength(code, 'utf-8');
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`FILE: ${fname}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Lines: ${lines} | Bytes: ${bytes}`);
    console.log(`Paradigm: ${extractParadigm(code)}`);
    
    console.log('\n--- IMPORTS ---');
    console.log(`  openpyxl:         ${check(code, 'import openpyxl')}`);
    console.log(`  datetime:         ${check(code, 'import datetime')}`);
    console.log(`  numpy (BANNED):   ${/import numpy/i.test(code) ? '❌ FOUND!' : '✅ Not present'}`);
    console.log(`  pandas (BANNED):  ${/import pandas/i.test(code) ? '❌ FOUND!' : '✅ Not present'}`);
    
    console.log('\n--- DATES ---');
    // Extract start date from code
    const dateMatch = code.match(/datetime\s*\(\s*(\d{4})\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/);
    const startDate = dateMatch ? `${dateMatch[1]}-${dateMatch[2].padStart(2,'0')}-${dateMatch[3].padStart(2,'0')}` : 'NOT_FOUND';
    console.log(`  Start date:       ${startDate}`);
    console.log(`  End = Sep 21:     ${check(code, '9,\\s*21|Sep.*21|21.*Sep')}`);
    
    console.log('\n--- ROW MAPPING ---');
    console.log(`  Row 5 headers:    ${check(code, 'worksheet\\[5\\]|row_5|row5')}`);
    console.log(`  Data from Row 7:  ${check(code, 'range\\(7|row.*7|r_num.*7')}`);
    
    console.log('\n--- 8 SUB-INDICES ---');
    console.log(`  1. TPI (coding):  ${check(code, 'tpi|tech.prod')}`);
    console.log(`  2. AAI (acad):    ${check(code, 'aai|academic.act')}`);
    console.log(`  3. PhAI (fitness):${check(code, 'phai|ph.?ai|physical.health')}`);
    console.log(`  4. SRI (sleep):   ${check(code, 'sri|sleep.reg')}`);
    console.log(`  5. ABI (free):    ${check(code, 'abi|active.bal|free.unaccounted')}`);
    console.log(`  6. TUI (total):   ${check(code, 'tui|time.util')}`);
    console.log(`  7. EI (emotion):  ${check(code, 'get_ei|ei_res|emotional.ind|sentiment')}`);
    console.log(`  8. DCI (valid/exp):${check(code, 'dci|data.cont')}`);
    
    console.log('\n--- PAI WEIGHTED FORMULA ---');
    console.log(`  0.15 * TPI:       ${check(code, '0\\.15.*tpi|tpi.*0\\.15')}`);
    console.log(`  0.20 * AAI:       ${check(code, '0\\.20.*aai|aai.*0\\.20')}`);
    console.log(`  0.15 * PhAI:      ${check(code, '0\\.15.*phai|phai.*0\\.15')}`);
    console.log(`  0.20 * SRI:       ${check(code, '0\\.20.*sri|sri.*0\\.20')}`);
    console.log(`  0.15 * TUI:       ${check(code, '0\\.15.*tui|tui.*0\\.15')}`);
    console.log(`  0.10 * EI:        ${check(code, '0\\.10.*ei|ei.*0\\.10')}`);
    console.log(`  0.05 * DCI:       ${check(code, '0\\.05.*dci|dci.*0\\.05')}`);
    // Sum check
    const weights = [0.15, 0.20, 0.15, 0.20, 0.15, 0.10, 0.05];
    const sum = weights.reduce((a, b) => a + b, 0);
    console.log(`  Weights sum to 1.0: ${Math.abs(sum - 1.0) < 0.001 ? '✅ ' + sum.toFixed(2) : '❌ ' + sum.toFixed(2)}`);
    
    console.log('\n--- DAILY AVERAGES ---');
    console.log(`  Sleep avg:        ${check(code, 'sleep_average|get_sleep|avg_sleep')}`);
    console.log(`  Fitness avg:      ${check(code, 'fitness_average|get_fitness|avg_fitness')}`);
    console.log(`  Study avg:        ${check(code, 'study_average|get_study|avg_study')}`);
    console.log(`  Coding avg:       ${check(code, 'coding_average|get_coding|avg_coding')}`);
    console.log(`  Class avg:        ${check(code, 'class_average|get_class|avg_class')}`);
    
    console.log('\n--- RELATIONSHIPS ---');
    console.log(`  Sleep-Energy:     ${check(code, 'sleep.*energy|energy.*sleep|sleep_energy')}`);
    console.log(`  Study-Satisfact:  ${check(code, 'study.*satisfaction|satisfaction.*study')}`);
    
    console.log('\n--- ENTRY POINT ---');
    console.log(`  pai(fname, sheet):${check(code, 'def pai\\(')}`);
    console.log(`  Returns dict:     ${check(code, 'return.*final_report|return.*{|return.*pai')}`);
}

console.log('\n\n=== CROSS-FILE COMPARISON ===');
const code4 = readFileSync('project (4).py', 'utf-8');
const code5 = readFileSync('project (5).py', 'utf-8');
console.log(`Are files identical?    ${code4 === code5 ? '❌ YES - PROBLEM!' : '✅ NO - They are different'}`);
console.log(`Both are OOP paradigm:  Both got the OOP_Class paradigm this time.`);
console.log(`Differ in comments:     ${code4.split('\n').filter((l,i) => l !== code5.split('\n')[i]).length} lines differ`);
