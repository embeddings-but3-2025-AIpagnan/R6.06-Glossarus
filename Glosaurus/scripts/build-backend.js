#!/usr/bin/env node

import { execSync } from 'child_process';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const isWindows = process.platform === 'win32';
const backendName = isWindows ? 'backend.exe' : 'backend';

console.log('🔨 Building backend with PyInstaller...');

try {
  // Run PyInstaller
  execSync('pyinstaller back-end/run_backend.spec', {
    cwd: projectRoot,
    stdio: 'inherit'
  });

  // Source and destination paths
  const sourcePath = join(projectRoot, 'dist', backendName);
  const destDir = join(projectRoot, 'src-tauri', 'bin');
  const destPath = join(destDir, backendName);

  // Ensure destination directory exists
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  // Check if the compiled backend exists
  if (!existsSync(sourcePath)) {
    console.error(`❌ Error: Compiled backend not found at ${sourcePath}`);
    process.exit(1);
  }

  // Copy the compiled backend
  console.log(`📦 Copying ${backendName} to src-tauri/bin/...`);
  copyFileSync(sourcePath, destPath);

  console.log('✅ Backend build completed successfully!');
} catch (error) {
  console.error('❌ Backend build failed:', error.message);
  process.exit(1);
}
