const { createClient } = require('next-sanity');
require('dotenv').config();
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
client.fetch('*[_type=="doctor"][0]{_id}').then(res => {
  if (!res) return console.log('No doctor found');
  console.log('Patching doctor:', res._id);
  client.patch(res._id).set({ order: 1 }).commit().then(console.log).catch(console.error);
});
