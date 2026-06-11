import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-03-20',
})

async function fix() {
  await client.patch('pole-dentaire')
    .set({
      title_ar: 'طب الأسنان',
      description_ar: 'رعاية شاملة للأسنان وجراحة الفم',
      badge_ar: 'تخصص'
    })
    .commit()
    
  await client.patch('pole-imagerie')
    .set({
      title_ar: 'التصوير الطبي المتقدم',
      description_ar: 'تشخيص دقيق باستخدام أحدث أجهزة الأشعة المقطعية والرنين المغناطيسي',
      badge_ar: 'تخصص'
    })
    .commit()

  console.log('Fixed translation for pole dentaire and pole imagerie!')
}

fix()
