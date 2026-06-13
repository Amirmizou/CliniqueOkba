import fs from 'fs';
import path from 'path';
import { poles } from '../data/poles';

const seedDataPath = path.join(__dirname, 'seed-data.json');
const data = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));

// Update the poles array with the full objects from poles.ts
data.poles = poles;

const outputPath = path.join(__dirname, 'seed-data-updated.json');
fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
console.log('Successfully generated seed-data-updated.json with Arabic fields!');
