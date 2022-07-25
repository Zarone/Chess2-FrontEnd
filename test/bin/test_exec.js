// == Note to future contributors ==
// Before judging this approach, try to do this any other way.
// ... I dare you.

import { spawn } from 'child_process';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tempPackage =  path.join(__dirname, '../../dist/package.json');
fs.writeFileSync(tempPackage, `{ "type": "module" }\n`);

const s = spawn('node', [
    '--experimental-specifier-resolution=node',
    path.join(__dirname, 'test.js')]);

s.stdout.on('data', function (msg) {
    process.stdout.write(msg, (_err) => {});
})
s.stderr.on('data', function (msg) {
    process.stderr.write(msg, (_err) => {});
})

s.on('close', () => {
    // Oh yeah, need to wait a second or the hotloader
    // won't realize it's gone... EVEN AFTER subsequent
    // saves to other files.
    setTimeout(() => {
        fs.unlinkSync(tempPackage)
    }, 1000);
});


