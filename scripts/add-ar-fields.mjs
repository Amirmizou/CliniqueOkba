import fs from 'fs'
import path from 'path'

const schemasDir = path.join(process.cwd(), 'sanity', 'schemas')
const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.ts'))

const fieldsToAddAr = ['title', 'description', 'content', 'excerpt', 'name', 'question', 'answer', 'caption', 'location', 'fullDescription', 'metaTitle', 'metaDescription', 'keywords', 'canonicalUrl', 'comment', 'service', 'text']

files.forEach(file => {
    const filePath = path.join(schemasDir, file)
    let content = fs.readFileSync(filePath, 'utf-8')
    let modified = false

    fieldsToAddAr.forEach(field => {
        // Find defineField for this specific field
        // Note: we need to handle multi-line objects but simplified regex might work
        // It looks for name: 'field' and its closing })
        
        // This is a complex regex to match the defineField block for a specific name
        // We use a non-greedy match to find the end of the defineField block
        const regex = new RegExp(`(defineField\\({\\s*name:\\s*'${field}'.*?\\}\\))`, 'gs')
        
        content = content.replace(regex, (match) => {
            // Check if the _ar version already exists in the file (to avoid duplicates)
            const arName = `${field}_ar`
            if (content.includes(`name: '${arName}'`)) {
                return match
            }

            modified = true
            
            // Generate the _ar block based on the matched block
            // Replace name: 'field' with name: 'field_ar'
            let arBlock = match.replace(`name: '${field}'`, `name: '${arName}'`)
            // If it has title: 'Something', append ' (AR)'
            arBlock = arBlock.replace(/title:\s*['"](.*?)['"]/, (tMatch, tGroup) => {
                // remove (FR) if it exists, add (AR)
                let newTitle = tGroup.replace(/\s*\(FR\)/i, '')
                return `title: '${newTitle} (AR)'`
            })
            // Remove validation: (Rule) => Rule.required() to avoid making Arabic mandatory if not needed
            arBlock = arBlock.replace(/validation:\s*.*?,\s*/g, '')
            
            return `${match},\n        ${arBlock}`
        })
    })

    if (modified) {
        fs.writeFileSync(filePath, content)
        console.log(`Updated ${file}`)
    }
})
