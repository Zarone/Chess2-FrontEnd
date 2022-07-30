const { execSync } = require('child_process');
const path_ = require('path');

const args = process.argv.slice(2);

const flags = {
    foam: true,
    go: true 
};

for ( k in flags ) {
    if ( args.includes(`--${k}`) ) flags[k] = true;
    if ( args.includes(`--no-${k}`) ) flags[k] = false;
}

try {
    if ( flags.foam ) execSync('node ../node_modules/foam3/tools/genjs -pom=../tools/pom', {
        cwd: path_.join(__dirname, '../dist')
    });
    if ( flags.go ) execSync('go build -o ../../dist/assets/main.wasm', {
        cwd: path_.join(__dirname, '../src/ai'),
        env: {
            ...process.env,
            GOOS: 'js',
            GOARCH: 'wasm'
        }
    });
} catch (e) {
    console.error('Build failed: ' + e.message.split('\n')[0]);
    process.exit(1);
}
