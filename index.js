#!/usr/bin/env node

// Native
const path = require('path');

// Packages
const nodeVersion = require('node-version');

// Throw an error if node version is too low
if (nodeVersion.major < 6) {
  console.error('Error! HTML Pages requires at least version 6 of Node. Please upgrade!');
  process.exit(1);
}

console.log('HTML Pages will be available soon...')
