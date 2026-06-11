const fs = require('fs')

const queriesPath = 'd:/SiteWebOkba/sanity/lib/queries.ts'
let content = fs.readFileSync(queriesPath, 'utf8')

const fieldsToLocalize = [
  'title', 'subtitle', 'description', 'mission', 'vision', 'values', 'stats',
  'certifications', 'name', 'specialty', 'experience', 'services', 'bio',
  'qualifications', 'languages', 'consultationDays', 'comment', 'service',
  'benefits', 'callToAction', 'availability', 'badge', 'ctaText', 'quickLinks',
  'servicesLinks', 'legalLinks', 'copyright', 'newsletterTitle', 'newsletterDescription',
  'clinicName', 'appointmentMessage', 'address', 'hours', 'heroStats', 'items'
]

// For each field, replace occurrences like `field,` with `field, field_ar,`
fieldsToLocalize.forEach(field => {
  const regex1 = new RegExp(`\\b${field},`, 'g')
  content = content.replace(regex1, `${field},\n    ${field}_ar,`)
  
  // also handle array objects like `values[] {` -> `values_ar[] {`
  const regex2 = new RegExp(`\\b${field}\\[\\] \\{`, 'g')
  content = content.replace(regex2, `${field}[] {\n      ...,\n    },\n    ${field}_ar[] {`)
})

fs.writeFileSync(queriesPath, content)
console.log('Done modifying queries')
