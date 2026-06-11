import fs from 'fs';

let content = fs.readFileSync('data/faq.ts', 'utf-8');

content = content.replace(/question:\s*'([^']+)'/g, (match, p1) => {
    return `question: '${p1}',\n    question_ar: '${p1} (AR)'`;
});
content = content.replace(/answer:\s*'([^']+)'/g, (match, p1) => {
    return `answer: '${p1}',\n    answer_ar: '${p1} (AR)'`;
});

fs.writeFileSync('data/faq.ts', content);
console.log('Updated faq.ts');
