
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, '../../package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (!packageJson.scripts) {
  packageJson.scripts = {};
}

// Add the generate-api script
packageJson.scripts['generate-api'] = 'node src/scripts/generateApiClient.js';

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('Added generate-api script to package.json');
