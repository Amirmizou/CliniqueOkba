import fs from 'fs';

let content = fs.readFileSync('data/doctors.ts', 'utf-8');

content = content.replace(/name:\s*'([^']+)'/g, (match, p1) => {
    return `name: '${p1}',\n    name_ar: '${p1} (AR)'`;
});
content = content.replace(/specialty:\s*'([^']+)'/g, (match, p1) => {
    return `specialty: '${p1}',\n    specialty_ar: '${p1} (AR)'`;
});
content = content.replace(/subtitle:\s*'([^']+)'/g, (match, p1) => {
    return `subtitle: '${p1}',\n    subtitle_ar: '${p1} (AR)'`;
});
content = content.replace(/experience:\s*'([^']+)'/g, (match, p1) => {
    return `experience: '${p1}',\n    experience_ar: '${p1} (AR)'`;
});
content = content.replace(/consultationDays:\s*'([^']+)'/g, (match, p1) => {
    return `consultationDays: '${p1}',\n    consultationDays_ar: '${p1} (AR)'`;
});
content = content.replace(/consultationHours:\s*'([^']+)'/g, (match, p1) => {
    return `consultationHours: '${p1}',\n    consultationHours_ar: '${p1} (AR)'`;
});

fs.writeFileSync('data/doctors.ts', content);
console.log('Updated doctors.ts');
