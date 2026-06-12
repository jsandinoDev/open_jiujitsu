import { writeFile, mkdir, readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')

async function loadEnv() {
  try {
    const raw = await readFile(path.join(ROOT, '.env'), 'utf8')
    for (const line of raw.split('\n')) {
      const eq = line.indexOf('=')
      if (eq > 0) process.env[line.slice(0, eq).trim()] ??= line.slice(eq + 1).trim()
    }
  } catch {}
}

const ACADEMIES = [
  // San José
  { name: 'Alliance Costa Rica BJJ Escalante San Jose', dbName: 'Alliance Costa Rica', slug: 'alliance-cr' },
  { name: 'Academia Galera BJJ Curridabat Costa Rica', dbName: 'Academia Galera BJJ', slug: 'galera-bjj' },
  { name: 'Athletic Advance San Pedro Montes de Oca Costa Rica', dbName: 'Athletic Advance', slug: 'athletic-advance' },
  { name: 'Renzo Gracie Costa Rica O2 Wellness Curridabat', dbName: 'Renzo Gracie Costa Rica', slug: 'renzo-gracie-cr' },
  { name: 'Arte Suave BJJ San Francisco Dos Rios San Jose Costa Rica', dbName: 'Arte Suave BJJ CR', slug: 'arte-suave-bjj-cr' },
  { name: 'Gallery Jiu Jitsu Academy Checkmat San Jose Costa Rica', dbName: 'Gallery Jiu Jitsu Academy (Checkmat)', slug: 'gallery-jiujitsu' },
  { name: 'Atos Jiu Jitsu Escazu Costa Rica', dbName: 'Atos Jiu Jitsu Costa Rica', slug: 'atos-cr' },
  { name: 'Nova Uniao Jiu Jitsu Escazu Costa Rica', dbName: 'Nova União Costa Rica', slug: 'nova-uniao-cr' },
  { name: 'DOJO Escuela Marcial Rohrmoser San Jose Costa Rica', dbName: 'DOJO Escuela Marcial', slug: 'dojo-rohrmoser' },
  { name: 'Mauro Sergio BJJ Moravia San Jose Costa Rica', dbName: 'Mauro Sergio BJJ', slug: 'mauro-sergio-bjj' },
  // Heredia
  { name: 'JiuJitsu Lab Sports Lab San Rafael Heredia Costa Rica', dbName: 'JiuJitsu Lab (Sports Lab CR)', slug: 'jiujitsu-lab-heredia' },
  { name: 'NorteSur Academy San Rafael Heredia Costa Rica', dbName: 'NorteSur Academy', slug: 'nortesur-academy' },
  { name: 'OSS Martial Arts San Francisco Heredia Costa Rica', dbName: 'OSS Martial Arts', slug: 'oss-martial-arts' },
  { name: 'Garaje Jiu Jitsu 506 San Francisco Heredia Costa Rica', dbName: 'Garaje Jiu Jitsu 506', slug: 'garaje-jiujitsu-506' },
  { name: 'Alejo BJJ San Isidro Heredia Costa Rica', dbName: 'ALEJO BJJ', slug: 'alejo-bjj' },
  { name: 'Heredia Jiu Jitsu San Rafael Alliance Costa Rica', dbName: 'Heredia Jiu Jitsu', slug: 'heredia-jiujitsu' },
  // Alajuela
  { name: 'AJR Jiu Jitsu Caio Terra Alajuela Costa Rica', dbName: 'AJR Jiu Jitsu', slug: 'ajr-jiujitsu' },
  { name: 'Mauro Sergio BJJ San Ramon Alajuela Costa Rica', dbName: 'Mauro Sergio BJJ San Ramón', slug: 'mauro-sergio-bjj-san-ramon' },
  // Cartago
  { name: 'Academia SKD Jiu Jitsu Cartago Costa Rica', dbName: 'Academia SKD Jiu Jitsu', slug: 'skd-jiujitsu-cartago' },
  { name: 'Academia Gaman Suru Jiu Jitsu Cartago Costa Rica', dbName: 'Academia Gaman Suru', slug: 'gaman-suru-cartago' },
  { name: 'Avenida 04 Jiu Jitsu Cartago Costa Rica', dbName: 'Avenida 04 Jiu Jitsu', slug: 'avenida04-jiujitsu' },
  // Guanacaste
  { name: 'Hero Academy BJJ Tamarindo Guanacaste Costa Rica', dbName: 'Hero Academy BJJ', slug: 'hero-academy-tamarindo' },
  { name: 'Nosara Jiu Jitsu Playa Guiones Guanacaste Costa Rica', dbName: 'Nosara Jiu Jitsu', slug: 'nosara-jiujitsu' },
  { name: 'Playa BJJ Playas del Coco Guanacaste Costa Rica', dbName: 'Playa BJJ', slug: 'playa-bjj-coco' },
  { name: 'Ascent Jiu Jitsu Club Playa Avellanas Guanacaste Costa Rica', dbName: 'Ascent Jiu Jitsu Club', slug: 'ascent-bjj-avellanas' },
  // Puntarenas
  { name: 'Puerto BJJ Puntarenas Costa Rica', dbName: 'Puerto BJJ', slug: 'puerto-bjj-puntarenas' },
  { name: 'Santa Teresa Jiu Jitsu Ares BJJ Cobano Puntarenas Costa Rica', dbName: 'Santa Teresa Jiu Jitsu', slug: 'santa-teresa-jiujitsu' },
  // Limón
  { name: 'Limon Jiu Jitsu Costa Rica limon centro', dbName: 'Limón Jiu Jitsu', slug: 'limon-jiujitsu' },
]

async function fetchPlaceImage(apiKey, query) {
  const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${apiKey}`
  const searchRes = await fetch(searchUrl)
  const searchData = await searchRes.json()

  if (searchData.status !== 'OK' || !searchData.results?.length) {
    return { error: `Places API: ${searchData.status}` }
  }

  const photo = searchData.results[0].photos?.[0]
  if (!photo) return { error: 'no photos on this place' }

  const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=${apiKey}`
  const imgRes = await fetch(photoUrl)
  if (!imgRes.ok) return { error: `photo fetch ${imgRes.status}` }

  const contentType = imgRes.headers.get('content-type') ?? ''
  if (!contentType.startsWith('image/')) return { error: `unexpected content-type: ${contentType}` }

  return { buffer: Buffer.from(await imgRes.arrayBuffer()) }
}

async function main() {
  await loadEnv()
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey || apiKey.startsWith('your-')) {
    console.error('Error: GOOGLE_PLACES_API_KEY not set in .env')
    console.error('Add it like: GOOGLE_PLACES_API_KEY=AIza...')
    process.exit(1)
  }

  const outDir = path.join(ROOT, 'public', 'images', 'academies')
  await mkdir(outDir, { recursive: true })

  const sqlUpdates = []
  let successCount = 0

  for (const academy of ACADEMIES) {
    process.stdout.write(`[${ACADEMIES.indexOf(academy) + 1}/${ACADEMIES.length}] ${academy.dbName}... `)

    try {
      const result = await fetchPlaceImage(apiKey, academy.name)
      if (result.error) {
        console.log(`✗ ${result.error}`)
      } else {
        const file = `${academy.slug}.jpg`
        await writeFile(path.join(outDir, file), result.buffer)
        const safeName = academy.dbName.replace(/'/g, "''")
        sqlUpdates.push(`UPDATE academies SET image_url = '/images/academies/${file}' WHERE name = '${safeName}';`)
        successCount++
        console.log('✓')
      }
    } catch (e) {
      console.log(`✗ ${e.message}`)
    }

    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\nDone: ${successCount}/${ACADEMIES.length} images downloaded to public/images/academies/`)

  if (sqlUpdates.length > 0) {
    console.log('\n-- Paste this into the Supabase SQL Editor --\n')
    console.log(sqlUpdates.join('\n'))
  }
}

main()
