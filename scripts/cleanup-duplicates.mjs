import 'dotenv/config';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN
});

async function findDuplicates() {
  const poles = await client.fetch(`*[_type == 'pole']{_id, title, "slug": slug.current}`);
  console.log('All poles:', poles);
  
  const slugs = {};
  for (const p of poles) {
    if (!slugs[p.slug]) slugs[p.slug] = [];
    slugs[p.slug].push(p._id);
  }
  
  for (const [slug, ids] of Object.entries(slugs)) {
    if (ids.length > 1) {
      console.log(`Duplicate found for slug: ${slug} -> IDs: ${ids.join(', ')}`);
      // Delete the ones that are NOT the seeded ones (the seeded ones start with 'pole-')
      const toDelete = ids.filter(id => !id.startsWith('pole-') && !id.startsWith('drafts.pole-'));
      for (const id of toDelete) {
        console.log(`Deleting duplicate document: ${id}`);
        await client.delete(id);
      }
    }
  }
}

findDuplicates().catch(console.error);
