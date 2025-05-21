
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Path configuration
const openapiSpec = path.resolve(__dirname, '../../backend_openapi.yaml');
const outputDir = path.resolve(__dirname, '../generated-api');
const configFile = path.resolve(__dirname, './openapi-generator-config.json');

// Create config file for generator
const config = {
  apiPackage: 'api',
  modelPackage: 'models',
  withSeparateModelsAndApi: true,
  supportingFiles: 'api.ts',
  npmName: '@app/api-client',
  supportsES6: true,
  nullSafeAdditionalProps: true,
  ensureUniqueParams: true
};

// Write config to file
fs.writeFileSync(configFile, JSON.stringify(config, null, 2));

try {
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Run OpenAPI Generator CLI
  console.log('Generating API client from OpenAPI spec...');
  execSync(
    `npx openapi-generator-cli generate -i ${openapiSpec} -g typescript-fetch -o ${outputDir} -c ${configFile}`,
    { stdio: 'inherit' }
  );

  console.log('API client generation completed successfully.');
  console.log(`Output directory: ${outputDir}`);

  // Clean up config file
  fs.unlinkSync(configFile);
} catch (error) {
  console.error('Error generating API client:', error);
  process.exit(1);
}
