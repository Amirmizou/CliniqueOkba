
const { createClient } = require('next-sanity');
require('dotenv').config();
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
client.create({ _type: 'doctor', name: 'Test', specialty: 'Test' }).then(console.log).catch(console.error);

