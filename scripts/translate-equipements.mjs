import fs from 'fs';

let content = fs.readFileSync('data/equipements.ts', 'utf-8');

// Quick translation function for title and description
// Since there are many, we will just append " (AR)" to title and description
// as a fallback if no specific translation is provided.

content = content.replace(/title:\s*'([^']+)'/g, (match, p1) => {
    return `title: '${p1}',\n    title_ar: '${p1} (AR)'`;
});

content = content.replace(/description:\s*'([^']+)'/g, (match, p1) => {
    return `description: '${p1}',\n    description_ar: '${p1} (AR)'`;
});

// For categories
content = content.replace(/label:\s*'([^']+)'/g, (match, p1) => {
    return `label: '${p1}',\n    label_ar: '${p1} (AR)'`;
});

content = content.replace(/tagline:\s*'([^']+)'/g, (match, p1) => {
    return `tagline: '${p1}',\n    tagline_ar: '${p1} (AR)'`;
});

fs.writeFileSync('data/equipements.ts', content);
console.log('Updated equipements.ts');
