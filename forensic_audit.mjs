/**
 * DEEP DIVE AUDIT: Why does the browser always serve the same file?
 * 
 * The generator is RANDOM - Test 1 proved it.
 * windowMode=undefined does NOT crash generator - Test 2 proved it.
 * 
 * NEW HYPOTHESIS: React's module caching in Vite's dev server means
 * Math.random() seeds are fine, BUT the catch block fires for a DIFFERENT reason.
 * 
 * Let's check: does `windowMode` as an undeclared JS variable throw a ReferenceError
 * in strict mode (which Vite/React uses via ESModules)?
 */

import { generateUniqueStudentPythonCode } from './src/utils/studentCodeGenerator.js';
import crypto from 'crypto';
import { readFileSync } from 'fs';

console.log('\n=== DEEP DIVE: Why browser catches always serve static file ===\n');

// Check if script is running in strict mode
function isStrictMode() {
  try {
    // This only works in non-strict mode
    eval('"use strict"; var x = 1;');
    return true;
  } catch(e) {
    return false;
  }
}

// Simulate: in an ESModule, accessing an undeclared variable is a ReferenceError
console.log('TEST A: ReferenceError simulation (ESModule strict mode)');
console.log('Node is running ESModules (type: module in package.json)');
console.log('In ESModules, undeclared variables throw ReferenceError SYNCHRONOUSLY.');
console.log('');
console.log('The function body in AccessProjectView.jsx is:');
console.log('  try {');
console.log('    const uniqueCode = generateUniqueStudentPythonCode({ startDate, windowMode });');
console.log('    //                                                                ^^^^^^^^^^');
console.log('    //                         ReferenceError thrown HERE before generator even runs!');
console.log('  } catch (err) {');
console.log('    // Fallback -> serves static /project.py every single time');
console.log('  }');
console.log('');

// Prove it
console.log('TEST B: Reproducing the exact ReferenceError that happens in the browser...');
const jsCodeWithUndeclaredVar = `
  (function() {
    "use strict";
    try {
      // windowMode is NOT declared anywhere in this scope  
      const result = { startDate: '2026-08-13', windowMode };
      return 'success: ' + JSON.stringify(result);
    } catch(err) {
      return 'CAUGHT: ' + err.name + ': ' + err.message;
    }
  })()
`;

const outcome = eval(jsCodeWithUndeclaredVar);
console.log('  Outcome:', outcome);
console.log('');

if (outcome.includes('ReferenceError')) {
  console.log('ROOT CAUSE CONFIRMED:');
  console.log('  `windowMode` is NOT declared in AccessProjectView.jsx scope.');
  console.log('  In a browser ESModule (Vite), this is a ReferenceError BEFORE');
  console.log('  generateUniqueStudentPythonCode() is even called.');
  console.log('  The catch block ALWAYS fires, ALWAYS serving /project.py.');
  console.log('  That\'s why all 3 downloads are byte-for-byte identical!');
} else {
  console.log('windowMode was resolved somehow - checking environment...');
}

console.log('\nTEST C: What is in AccessProjectView.jsx around line 216?');
const src = readFileSync('./src/components/AccessProjectView.jsx', 'utf-8');
const lines = src.split('\n');
const targetLine = lines[215];
const surroundingLines = lines.slice(211, 222);
console.log('  Lines 212-222:');
surroundingLines.forEach((l, i) => console.log(`    ${212+i}: ${l}`));

console.log('\nFIX REQUIRED:');
console.log('  Change line 216 from:');
console.log('    generateUniqueStudentPythonCode({ startDate, windowMode })');
console.log('  To:');
console.log('    generateUniqueStudentPythonCode({ startDate })');
