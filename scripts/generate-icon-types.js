import chokidar from 'chokidar';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.resolve(__dirname, '../src/assets/icons');
const TYPES_FILE = path.resolve(
  __dirname,
  '../src/shared/types/icons.types.ts'
);

/**
 * Converts a filename to an icon name (removes .svg extension)
 * @param {string} filename
 * @returns {string}
 */
function filenameToIconName(filename) {
  return path.basename(filename, '.svg');
}

/**
 * Generates the IconName type content
 * @param {string[]} iconNames
 * @returns {string}
 */
function generateTypeContent(iconNames) {
  if (iconNames.length === 0) {
    return `export type IconName = never;\n`;
  }

  const sortedNames = [...iconNames].sort();
  const unionTypes = sortedNames.map((name) => `  | '${name}'`).join('\n');

  return `export type IconName =\n${unionTypes};\n`;
}

/**
 * Reads all SVG files from the icons directory and generates the types file
 */
function generateIconTypes() {
  try {
    const files = fs.readdirSync(ICONS_DIR);
    const svgFiles = files.filter((file) => file.endsWith('.svg'));
    const iconNames = svgFiles.map(filenameToIconName);

    const content = generateTypeContent(iconNames);
    fs.writeFileSync(TYPES_FILE, content, 'utf-8');

    console.log(`✅ Generated IconName type with ${iconNames.length} icons`);
    console.log(`   Icons: ${iconNames.join(', ')}`);
  } catch (error) {
    console.error('❌ Error generating icon types:', error.message);
  }
}

/**
 * Watches the icons directory for changes
 */
function watchIcons() {
  console.log(`👀 Watching for icon changes in: ${ICONS_DIR}`);
  console.log(`📝 Types file: ${TYPES_FILE}\n`);

  // Generate initial types
  generateIconTypes();

  // Watch for changes
  const watcher = chokidar.watch(ICONS_DIR, {
    ignored: /(^|[\/\\])\../,
    persistent: true,
    ignoreInitial: true,
  });

  watcher
    .on('add', (filePath) => {
      if (filePath.endsWith('.svg')) {
        console.log(`\n➕ Icon added: ${path.basename(filePath)}`);
        generateIconTypes();
      }
    })
    .on('unlink', (filePath) => {
      if (filePath.endsWith('.svg')) {
        console.log(`\n➖ Icon removed: ${path.basename(filePath)}`);
        generateIconTypes();
      }
    })
    .on('error', (error) => {
      console.error('❌ Watcher error:', error);
    });

  console.log('Press Ctrl+C to stop watching.\n');
}

// Check command line arguments
const args = process.argv.slice(2);

if (args.includes('--watch') || args.includes('-w')) {
  watchIcons();
} else {
  // Just generate once and exit
  generateIconTypes();
}
