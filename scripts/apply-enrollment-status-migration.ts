import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

async function run() {
  const token = process.env.OTTODOT_TOKEN
  const projectRef = 'lxzrdbapjvczwwyybxgw'

  console.log(`Executing SQL migration on project ${projectRef}...`)

  const sql = `
    ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS enrollments_status_check;
    ALTER TABLE public.enrollments ADD CONSTRAINT enrollments_status_check 
      CHECK (status IN ('active', 'completed', 'cancelled', 'expired'));
  `

  const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })

  if (!res.ok) {
    const errorText = await res.text()
    console.error('Migration failed:', res.status, errorText)
    process.exit(1)
  }

  const result = await res.json()
  console.log('✅ Migration successfully executed:', result)
}

run()
