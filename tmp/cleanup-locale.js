const fs = require('fs');
const path = require('path');

function processFile(fullPath) {
    let content = fs.readFileSync(fullPath, 'utf-8');
    const original = content;

    // Remove `{ locale }: { locale: string }` from component props
    content = content.replace(/\{(\s*)locale(\s*)\}\s*:\s*\{(\s*)locale\s*:\s*string(\s*)\}/g, '');
    
    // Cleanup empty props `({  })` or `({})`
    content = content.replace(/\(\{(\s*)\}\)/g, '()');

    // Also handles the `({ locale, ...otherProps }) : { locale: string, ...otherTypes }` case where we just remove locale
    content = content.replace(/\blocale\s*:\s*locale\b/g, '');
    content = content.replace(/,\s*locale\b/g, '');
    content = content.replace(/\blocale,\s*/g, '');
    content = content.replace(/\blocale\s*(?=\})/g, '');


    // If locale was the only param, remove trailing commas or fix types
    content = content.replace(/\{\s*locale(\s*\??\s*:\s*string)?\s*\}/g, '()');

    // api.ts calls
    content = content.replace(/await\s+getAllArticles\(locale\)/g, 'await getAllArticles()');
    content = content.replace(/await\s+getArticleBySlug\([^,]+,\s*locale\)/g, match => match.replace(/,\s*locale\)/, ')'));
    content = content.replace(/locale={locale}/g, '');
    content = content.replace(/locale\s*:\s*string/g, '');

    if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log('Updated', fullPath);
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
console.log('Done!');
