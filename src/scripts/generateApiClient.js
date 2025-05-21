
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path configuration
const openapiSpec = path.resolve(__dirname, '../../backend_openapi.yaml');
const outputDir = path.resolve(__dirname, '../generated-api');
const configFile = path.resolve(__dirname, './openapi-generator-config.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

try {
  console.log('Generating API client from OpenAPI spec...');
  execSync(
    `npx @openapitools/openapi-generator-cli generate -i ${openapiSpec} -g typescript-fetch -o ${outputDir} -c ${configFile}`,
    { stdio: 'inherit' }
  );

  console.log('API client generation completed successfully.');
  console.log(`Output directory: ${outputDir}`);
} catch (error) {
  console.error('Error generating API client:', error);
  process.exit(1);
}
