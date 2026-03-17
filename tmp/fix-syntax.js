const fs = require('fs');
const path = require('path');

function processFile(fullPath) {
    let content = fs.readFileSync(fullPath, 'utf-8');
    const original = content;

    // Fix empty generic Promise<()>, which is invalid syntax due to the cleanup replacement
    content = content.replace(/Promise<\(\)>/g, 'Promise<{}>');

    if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log('Fixed syntax in', fullPath);
    }
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

processDir(path.join(__dirname, '..', 'src'));
console.log('Syntax fixes done!');
