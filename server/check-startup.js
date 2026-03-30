#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔍 Checking Deployment Startup Requirements...\n');

// Check 1: Environment Variables
console.log('1️⃣  Environment Variables:');
const envVars = ['DATABASE_URL', 'JWT_SECRET', 'PORT'];
envVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`   ✅ ${varName}: Configured`);
  } else {
    console.log(`   ❌ ${varName}: NOT SET`);
  }
});

// Check 2: Required Files
console.log('\n2️⃣  Required Files:');
const requiredFiles = [
  '../dist/index.html',
  '../dist/assets',
  './config/db.js',
  './routes/authRoutes.js'
];

requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  const exists = fs.existsSync(fullPath);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
});

// Check 3: Node version
console.log('\n3️⃣  Node.js Version:');
console.log(`   ✅ Node ${process.version}`);

// Check 4: Critical Dependencies
console.log('\n4️⃣  Critical Dependencies:');
const dependencies = ['express', 'sequelize', 'dotenv', 'cors'];
dependencies.forEach(dep => {
  try {
    require.resolve(dep);
    console.log(`   ✅ ${dep}`);
  } catch {
    console.log(`   ❌ ${dep} - RUN: npm install`);
  }
});

console.log('\n📋 Startup Checklist:');
console.log('   [ ] DATABASE_URL is set in Hostinger environment');
console.log('   [ ] JWT_SECRET is set in Hostinger environment');
console.log('   [ ] PORT is set (default 5000)');
console.log('   [ ] dist/ folder exists with React build');
console.log('   [ ] node_modules installed (npm install)');

console.log('\n✅ If all checks pass above, the server should start successfully!');
