const token = 'skw5fDhQsnalHmACI6XzbSwogoKCENMwAXqrjCR3nLhABYRMF9lLPzwg7LYs7HZaZepq2sA1lm1nRhNyGQjkqMs00CTnBFM9vSoLdQFhYm77yAPBbIUgMPfGIOvDzjTURFS60Lxi9SIzQWZahTLVqolCNyTNhlE4uExbDrB4kxpPh2vzWs1N';
const projectId = 'ox121huo';
const dataset = 'production';

// Step 1: Get the siteSettings document
const queryUrl = `https://${projectId}.api.sanity.io/v2021-06-07/data/query/${dataset}?query=*[_type=="siteSettings"][0]{_id,hours}`;

console.log('Fetching siteSettings...');
const res = await fetch(queryUrl, {
  headers: { Authorization: `Bearer ${token}` }
});
const data = await res.json();
console.log('Current data:', JSON.stringify(data.result, null, 2));

const docId = data.result?._id;
if (!docId) {
  console.error('No siteSettings document found!');
  process.exit(1);
}

// Step 2: Patch hours.weekdays and hours.saturday
const mutationUrl = `https://${projectId}.api.sanity.io/v2021-06-07/data/mutate/${dataset}`;
const mutations = {
  mutations: [
    {
      patch: {
        id: docId,
        set: {
          'hours.weekdays': '7j/7 · 24h/24',
          'hours.saturday': '7j/7 · 24h/24',
          'hours.consultation': '7j/7 · 24h/24',
        }
      }
    }
  ]
};

console.log(`\nPatching document ${docId}...`);
const patchRes = await fetch(mutationUrl, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify(mutations)
});

const patchData = await patchRes.json();
console.log('Result:', JSON.stringify(patchData, null, 2));
