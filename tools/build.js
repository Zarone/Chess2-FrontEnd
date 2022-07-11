const { execSync } = require('child_process');
const path_ = require('path');

try {
    execSync('node ../node_modules/foam3/tools/genjs -pom=../tools/pom', {
        cwd: path_.join(__dirname, '../dist')
    });
} catch (e) {
    console.error('Build failed: ' + e.message.split('\n')[0]);
    process.exit(1);
}