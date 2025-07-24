const fs = require('fs');
const path = require('path');

const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
const distPackageJsonPath = path.resolve(__dirname, '..', 'dist', 'package.json');
const distDir = path.resolve(__dirname, '..', 'dist');

// Read the root package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// Create the new package.json for distribution
const distPackageJson = {
	...packageJson,
	main: 'index.js',
	types: 'index.d.ts',
};

// Remove unnecessary fields
delete distPackageJson.scripts;
delete distPackageJson.devDependencies;

// Ensure the dist directory exists
if (!fs.existsSync(distDir)) {
	fs.mkdirSync(distDir);
}

// Write the new package.json to the dist directory
fs.writeFileSync(distPackageJsonPath, JSON.stringify(distPackageJson, null, 2));

console.log('Successfully created package.json in dist/');