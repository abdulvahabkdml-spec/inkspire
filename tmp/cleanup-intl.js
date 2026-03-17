const fs = require('fs');
const path = require('path');

const translations = {
  // nav
  "t('home')": "'Home'",
  "t('archives')": "'Articles'",
  "t('fiction')": "'Fiction'",
  "t('voices')": "'Voices'",
  "t('mythos')": "'Mythos'",
  "t('legends_voice')": "'Legends Voice'",
  "t('admin')": "'Admin Access'",
  // home
  "t('featured')": "'Featured Cover'",
  "t('title')": "'Articles'",
  "t('viewMore')": "'View More'",
  "t('contributor')": "'Contributor'",
  "t('readEditorial')": "'Read the Editorial'",
  "t('exploreAll')": "'Explore All Perspectives'",
  "t('rights')": "'ALL RIGHTS RESERVED.'",
  "t('tagline')": "'Curating the archives of humanity with precision and passion.'",
  // article
  "t('by')": "'By'",
  "t('published')": "'Published'",
  "t('readTime')": "'Reading Time'",
  "t('noEntries', { tag })": "`The scrolls are silent for ${tag}.`",
  // reader
  "t('light')": "'Light Mode'",
  "t('sepia')": "'Sepia Mode'",
  "t('dark')": "'Dark Mode'",
  "t('zen')": "'Zen Mode'",
  "t('fontSize')": "'Font Size'",
  // comments
  "t('title')": "'The Literature Circle'",
  "t('subtitle', { count: comments.length })": "`${comments.length} reflections shared. Join the intellectual exchange.`",
  "t('placeholder')": "'Share your insight or reflection...'",
  "t('name')": "'Your name'",
  "t('post')": "'Post'",
  "t('reply')": "'Reply'",
  "t('justNow')": "'Just now'",
  // notifications
  "t('title')": "'Stay Enlightened'",
  "t('description')": "'Allow notifications to receive immediate alerts when new essays and poetry are published to the archives.'",
  "t('allow')": "'Allow'",
  "t('later')": "'Maybe Later'",
  "{t('title')}": "Stay Enlightened",
  "{t('description')}": "Allow notifications to receive immediate alerts when new essays and poetry are published to the archives.",
  "{t('home')}": "Home",
  "{t('archives')}": "Articles",
  "{t('fiction')}": "Fiction",
  "{t('voices')}": "Voices",
  "{t('mythos')}": "Mythos",
  "{t('admin')}": "Admin Access",
  "{t('featured')}": "Featured Cover",
  "{t('viewMore')}": "View More Articles",
};

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf-8');
      const original = content;

      // Imports removal
      content = content.replace(/import\s+{\s*useTranslations\s*}\s+from\s+'next-intl';?\n?/g, '');
      content = content.replace(/import\s+{\s*getTranslations[^{}]*}\s+from\s+'next-intl\/server';?\n?/g, '');
      content = content.replace(/import\s+{\s*setRequestLocale[^{}]*}\s+from\s+'next-intl\/server';?\n?/g, '');
      content = content.replace(/import\s+{\s*getTranslations,\s*setRequestLocale\s*}\s+from\s+'next-intl\/server';?\n?/g, '');
      content = content.replace(/import\s+LanguageSwitcher\s+from\s+'\.\/LanguageSwitcher';?\n?/g, '');

      // Link mapping
      content = content.replace(/import\s+{\s*Link\s*(?:,\s*useRouter\s*)?}\s+from\s+'@\/navigation';?\n?/g, "import Link from 'next/link';\n");
      content = content.replace(/import\s+{\s*useRouter\s*(?:,\s*Link\s*)?}\s+from\s+'@\/navigation';?\n?/g, "import { useRouter } from 'next/navigation';\nimport Link from 'next/link';\n");
      // Other link imports if split
      content = content.replace(/import\s+{\s*Link\s*}\s+from\s+'@\/navigation';?\n?/g, "import Link from 'next/link';\n");
      content = content.replace(/import\s+{\s*useRouter\s*}\s+from\s+'@\/navigation';?\n?/g, "import { useRouter } from 'next/navigation';\n");

      // Hook calls removal
      content = content.replace(/const\s+t\s*=\s*useTranslations\([^)]*\);?\n?/g, '');
      content = content.replace(/const\s+t\s*=\s*await\s+getTranslations\([^)]*\);?\n?/g, '');

      // setRequestLocale removal
      content = content.replace(/setRequestLocale\(locale\);?\n?/g, '');

      // translation strings replacements
      for (const [key, value] of Object.entries(translations)) {
        if (key.startsWith('{t')) {
           // replacing JSX texts
           const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
           content = content.replace(regex, value);
        } else {
           const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
           content = content.replace(regex, value);
        }
      }

      // Cleanup remaining {t(...)} patterns
      content = content.replace(/{t\('([^']+)'\)}/g, '$1');

      // Params fixes
      // Change `params: Promise<{ locale: string, slug?: string }>` to exclude locale. Actually just removing locale mapping
      content = content.replace(/const\s+{\s*locale(?:,\s*([^}]+))?\s*}\s*=\s*await\s+params;?/g, "const { $1 } = await params;");
      content = content.replace(/const\s+{\s*([^,]+)(?:,\s*locale)\s*}\s*=\s*await\s+params;?/g, "const { $1 } = await params;");
      content = content.replace(/const\s+{\s*}\s*=\s*await\s+params;?\n?/g, "");
      content = content.replace(/const\s+{\s*locale\s*}\s*=\s*await\s+params;?\n?/g, "");

      // `<LanguageSwitcher />` removal
      content = content.replace(/<LanguageSwitcher\s*\/>/g, '');

      // remove locale prop passed to components
      content = content.replace(/\s+locale={locale}/g, '');

      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf-8');
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, '..', 'src'));
console.log('Done!');
