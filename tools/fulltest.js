#!/usr/bin/env node
/* Run every repository-level data and renderer validation against the current
   source files. Browser interaction smoke tests are kept separate because they
   require a DOM implementation. */
'use strict';

const { execFileSync } = require('child_process');
const path = require('path');

const root = path.resolve(__dirname, '..');
const suites = [
    'tools/ui_test.js',
    'tools/learn_test.js',
    'tools/learn_test2.js',
    'tools/v2_test.js'
];

try {
    require.resolve('jsdom'); // dev-only dependency
    suites.push('tools/dom_test.js');
} catch (e) {
    console.log('NOTE: jsdom उपलब्ध नहीं — tools/dom_test.js छोड़ा जा रहा है (npm i -D jsdom करके चला सकते हैं)');
}

for (const suite of suites) {
    console.log(`\n========== ${suite} ==========`);
    execFileSync(process.execPath, [suite], { cwd: root, stdio: 'inherit' });
}

console.log('\nRESULT: ALL SUITES PASSED');
