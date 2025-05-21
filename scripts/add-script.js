
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.scripts) {
  packageJson.scripts = {};
}

// Add the generate-api script
packageJson.scripts['generate-api'] = 'node src/scripts/generateApiClient.js';

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('Added generate-api script to package.json');
