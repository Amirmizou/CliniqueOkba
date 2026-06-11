import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    apiVersion: '2024-03-20'
});

async function fix() {
    const docs = await client.fetch('*');
    for (const d of docs) {
        let patches = {};
        for (const [key, value] of Object.entries(d)) {
            if (typeof value === 'string' && value.includes('(AR)')) {
                if (key.endsWith('_ar')) {
                   console.log(`Found (AR) in ${d._type} [${d._id}]: ${key} = ${value}`);
                }
            }
        }
    }
}
fix().catch(console.error);
