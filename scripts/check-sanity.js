const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env' });
const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
    apiVersion: '2024-03-20',
});
async function main() {
    const poles = await client.fetch('count(*[_type == "pole"])');
    const about = await client.fetch('count(*[_type == "aboutSection"])');
    const homeCare = await client.fetch('count(*[_type == "homeCare"])');
    console.log('Poles:', poles);
    console.log('About:', about);
    console.log('HomeCare:', homeCare);
}
main();
