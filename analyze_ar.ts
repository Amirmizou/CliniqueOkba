import fs from 'fs'

const data = JSON.parse(fs.readFileSync('sanity_dump.json', 'utf8'))
const missing: any[] = []

function checkObj(obj: any, path: string, docId: string, docType: string) {
  if (!obj || typeof obj !== 'object') return
  if (Array.isArray(obj)) {
    obj.forEach((val, i) => checkObj(val, `${path}[${i}]`, docId, docType))
    return
  }
  
  // Check for string fields that don't end with _ar but have a matching _ar field in schema
  // Actually, let's just find any string field that is in French, and see if _ar exists.
  // A better heuristic: if there's a field like `title`, check if `title_ar` exists.
  // Wait, I can just look at my schema to know which fields have _ar.
  // Let's just find any field X where X is a string, and X_ar is empty or missing.
  
  const keys = Object.keys(obj)
  for (const k of keys) {
    if (k.startsWith('_')) continue
    if (k.endsWith('_ar')) continue
    if (typeof obj[k] === 'string') {
      const arKey = k + '_ar'
      // If arKey exists in schema but is empty, or if we know it should exist
      // Since we don't have schema, let's just flag EVERY string field that lacks an _ar, EXCEPT ids, refs, etc.
      if (k === 'id' || k === 'type' || k === 'category' || k === 'icon' || k.toLowerCase().includes('url') || k.toLowerCase().includes('link') || k === 'slug' || k === 'date' || k === 'style' || k === 'email' || k === 'phone' || k === 'contact') continue
      
      if (!obj[arKey] || (typeof obj[arKey] === 'string' && obj[arKey].trim() === '')) {
        missing.push({ docId, docType, field: k, value: obj[k], path: `${path}.${k}` })
      }
    } else if (typeof obj[k] === 'object') {
      checkObj(obj[k], `${path}.${k}`, docId, docType)
    }
  }
}

for (const [key, value] of Object.entries(data)) {
  if (Array.isArray(value)) {
    value.forEach(v => checkObj(v, '', v._id, v._type))
  } else if (value) {
    checkObj(value, '', (value as any)._id, (value as any)._type)
  }
}

fs.writeFileSync('missing_ar.json', JSON.stringify(missing, null, 2))
console.log(`Found ${missing.length} missing translations.`)
