import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const DEFAULT_PASSWORD = 'DemoPassword123!'

interface DemoUser {
  email: string
  fullName: string
  role: 'student' | 'parent' | 'teacher' | 'admin'
  avatarUrl: string
}

const DEMO_USERS: DemoUser[] = [
  {
    email: 'student@demo.com',
    fullName: 'Leo "RoboExplorer" Santoso',
    role: 'student',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    email: 'teacher@demo.com',
    fullName: 'Dr. Maya Lin',
    role: 'teacher',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  },
  {
    email: 'parent@demo.com',
    fullName: 'Sarah Jenkins',
    role: 'parent',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  },
  {
    email: 'admin@demo.com',
    fullName: 'Aris Administrator',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
]

async function seed() {
  console.log('🌱 Starting ClassLoop database seed (English Ottodot Theme)...\n')

  const userMap: Record<string, string> = {}

  // 1. Create or verify Demo Users
  console.log('👤 Provisioning 4 Core Demo Accounts in Supabase Auth...')
  for (const u of DEMO_USERS) {
    // Check if user already exists
    const { data: existingUserList } = await supabase.auth.admin.listUsers()
    const existing = existingUserList?.users.find((user) => user.email === u.email)

    let userId: string

    if (existing) {
      userId = existing.id
      console.log(`  ✓ User ${u.email} already exists (${userId})`)
      // Update password & metadata to ensure valid state
      await supabase.auth.admin.updateUserById(userId, {
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: u.fullName, role: u.role, avatar_url: u.avatarUrl },
      })
    } else {
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: u.email,
        password: DEFAULT_PASSWORD,
        email_confirm: true,
        user_metadata: { full_name: u.fullName, role: u.role, avatar_url: u.avatarUrl },
      })

      if (createError || !newUser.user) {
        console.error(`  ❌ Failed to create user ${u.email}:`, createError?.message)
        continue
      }

      userId = newUser.user.id
      console.log(`  ✓ Created user ${u.email} (${userId})`)
    }

    userMap[u.role] = userId

    // Ensure user_profiles table is synced
    await supabase.from('user_profiles').upsert({
      id: userId,
      full_name: u.fullName,
      role: u.role,
      avatar_url: u.avatarUrl,
      is_active: true,
    })
  }

  const studentId = userMap.student
  const teacherId = userMap.teacher
  const parentId = userMap.parent
  const adminId = userMap.admin

  if (!studentId || !teacherId || !parentId || !adminId) {
    throw new Error('❌ Missing required user IDs for relations')
  }

  // 2. Family Link: Parent -> Student
  console.log('\n👨‍👩‍👧 Creating Parent-Student family link...')
  await supabase.from('parent_student_links').upsert(
    { parent_id: parentId, student_id: studentId },
    { onConflict: 'parent_id,student_id' }
  )
  console.log('  ✓ Linked Sarah Jenkins (parent) to Leo Santoso (student)')

  // 3. Subscription Plans
  console.log('\n💳 Setting up subscription plans...')
  const { data: plansData } = await supabase.from('plans').upsert(
    [
      {
        name: 'Monthly Explorer',
        description: 'Ideal for weekly science & physics live exploratory missions.',
        price_cents: 2900,
        currency: 'usd',
        duration_days: 30,
        class_count: 8,
        stripe_price_id: 'price_demo_monthly_29',
        is_active: true,
      },
      {
        name: 'Quarterly Master',
        description: 'Full curriculum access with priority homework feedback and live coding labs.',
        price_cents: 7900,
        currency: 'usd',
        duration_days: 90,
        class_count: 24,
        stripe_price_id: 'price_demo_quarterly_79',
        is_active: true,
      },
    ],
    { onConflict: 'stripe_price_id' }
  ).select()

  const monthlyPlanId = plansData?.[0]?.id
  console.log('  ✓ Created Monthly Explorer ($29) and Quarterly Master ($79) plans')

  // 4. Classes
  console.log('\n🏫 Creating Ottodot interactive live classes...')
  // Clean existing classes for deterministic seed
  const { data: class1Data, error: class1Error } = await supabase.from('classes').insert({
    name: 'Roblox Physics & Velocity Explorers',
    description: "Learn velocity, friction, gravity, and Newton's laws through hands-on Roblox space simulation games.",
    teacher_id: teacherId,
    max_students: 15,
    status: 'active',
  }).select().single()

  const { data: class2Data, error: class2Error } = await supabase.from('classes').insert({
    name: '3D Geometry & Spatial World Building',
    description: 'Explore volume, 3D coordinate grids, and polygon geometry while constructing floating islands in sandbox environments.',
    teacher_id: teacherId,
    max_students: 12,
    status: 'active',
  }).select().single()

  const class1Id = class1Data?.id
  const class2Id = class2Data?.id

  if (!class1Id || !class2Id) {
    throw new Error('❌ Failed to insert classes')
  }
  console.log('  ✓ Created Class 1: Roblox Physics & Velocity Explorers')
  console.log('  ✓ Created Class 2: 3D Geometry & Spatial World Building')

  // 5. Class Sessions
  console.log('\n📅 Creating upcoming class sessions...')
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(16, 0, 0, 0)
  const tomorrowEnd = new Date(tomorrow)
  tomorrowEnd.setHours(17, 30, 0, 0)

  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 5)
  nextWeek.setHours(10, 0, 0, 0)
  const nextWeekEnd = new Date(nextWeek)
  nextWeekEnd.setHours(11, 30, 0, 0)

  await supabase.from('class_sessions').insert([
    {
      class_id: class1Id,
      starts_at: tomorrow.toISOString(),
      ends_at: tomorrowEnd.toISOString(),
      notes: 'Space Station Rover Friction Tests & Speed Run Live Demo.',
    },
    {
      class_id: class2Id,
      starts_at: nextWeek.toISOString(),
      ends_at: nextWeekEnd.toISOString(),
      notes: 'Coordinate Grid Prototyping & Terrain Elevation.',
    },
  ])
  console.log('  ✓ Created live session schedule for both classes')

  // 6. Student Enrollment
  console.log('\n🎓 Enrolling student into classes...')
  await supabase.from('enrollments').upsert(
    {
      student_id: studentId,
      class_id: class1Id,
      plan_id: monthlyPlanId || null,
      status: 'active',
      stripe_session_id: 'cs_test_demo_session_123',
      stripe_payment_id: 'pi_test_demo_payment_123',
      enrolled_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    { onConflict: 'student_id,class_id' }
  )
  console.log('  ✓ Enrolled Leo Santoso into Roblox Physics & Velocity Explorers')

  // 7. Homework Scenarios
  console.log('\n📝 Creating realistic homework tasks across all states...')
  const pastDate = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  const futureDate2d = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  const futureDate20h = new Date(Date.now() + 20 * 60 * 60 * 1000)
  const futureDate10d = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)

  // HW 1: Graded
  const { data: hw1 } = await supabase.from('homework').insert({
    class_id: class1Id,
    teacher_id: teacherId,
    title: 'Gravity & Friction Experiment in Lunar Station',
    description: 'Test how rover velocity changes across 3 different surface materials (lunar dust, ice, and metal grid). Record your time and friction observations.',
    due_at: pastDate.toISOString(),
    max_score: 100,
    status: 'published',
  }).select().single()

  // HW 2: Submitted (Pending Grade)
  const { data: hw2 } = await supabase.from('homework').insert({
    class_id: class1Id,
    teacher_id: teacherId,
    title: 'Calculating Acceleration on Roller Coaster Loops',
    description: 'Apply the conservation of energy equation v = sqrt(2gh) to calculate the minimum drop height required for the roller coaster cart to complete a 10m loop without falling.',
    due_at: futureDate2d.toISOString(),
    max_score: 100,
    status: 'published',
  }).select().single()

  // HW 3: Pending (Due soon)
  await supabase.from('homework').insert({
    class_id: class1Id,
    teacher_id: teacherId,
    title: '3D Coordinate Mapping: Building a Floating Island',
    description: 'Place 4 waypoint beacons on your custom island at specified (X, Y, Z) coordinates. Calculate the perimeter bounding box of your base.',
    due_at: futureDate20h.toISOString(),
    max_score: 100,
    status: 'published',
  })

  // HW 4: Draft
  await supabase.from('homework').insert({
    class_id: class1Id,
    teacher_id: teacherId,
    title: 'Ecosystem Food Web Simulation & Energy Transfer Quiz',
    description: "Teacher draft for next week's biology & energy flow module.",
    due_at: futureDate10d.toISOString(),
    max_score: 50,
    status: 'draft',
  })
  console.log('  ✓ Created 4 homework tasks (Graded, Submitted, Pending, and Draft)')

  // 8. Homework Submissions
  console.log('\n✍️ Creating homework submissions & grades...')
  if (hw1?.id) {
    await supabase.from('homework_submissions').insert({
      homework_id: hw1.id,
      student_id: studentId,
      content: 'I tested the planetary rover across all 3 test tracks. On the ice track, friction was 0.05 so the rover maintained speed for 14.2 seconds. On lunar regolith dust, friction was 0.45 and stopped after 3.8 seconds. Less gravity made braking distance 3x longer!',
      score: 95,
      feedback: 'Outstanding observation, Leo! Your analysis on how microgravity significantly increases stopping distance is spot on. Excellent work!',
      graded_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      graded_by: teacherId,
      submitted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    })
    console.log('  ✓ Submitted & Graded HW 1 (Score: 95/100, Feedback provided)')
  }

  if (hw2?.id) {
    await supabase.from('homework_submissions').insert({
      homework_id: hw2.id,
      student_id: studentId,
      content: 'For a 10m diameter loop (radius r = 5m), at the top of the loop mg = mv^2/r, so v_top = sqrt(g*r) = sqrt(9.8 * 5) = 7.0 m/s. Using energy conservation from height h, mgh = mg(2r) + 0.5m(v_top)^2, so h = 2.5 * r = 12.5 meters. The drop tower needs to be at least 12.5 meters tall.',
      score: null,
      feedback: null,
      submitted_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    })
    console.log('  ✓ Submitted HW 2 (Awaiting teacher grading)')
  }

  // 9. Notifications
  console.log('\n🔔 Creating in-app notifications...')
  await supabase.from('notifications').insert([
    {
      user_id: parentId,
      title: 'Grade Published: Gravity & Friction Experiment',
      body: "Dr. Maya Lin scored Leo's homework with 95/100 and provided detailed feedback.",
      type: 'grade_released',
      is_read: false,
    },
    {
      user_id: studentId,
      title: 'Upcoming Live Class Tomorrow at 16:00',
      body: 'Roblox Physics & Velocity Explorers live session begins tomorrow.',
      type: 'class_reminder',
      is_read: false,
    },
    {
      user_id: teacherId,
      title: 'New Homework Submission',
      body: "Leo Santoso submitted 'Calculating Acceleration on Roller Coaster Loops' for review.",
      type: 'homework_new',
      is_read: false,
    },
  ])
  console.log('  ✓ Created notifications for Parent, Student, and Teacher')

  console.log('\n=============================================================')
  console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!')
  console.log('=============================================================')
  console.log('Demo Credentials (Password for all: DemoPassword123!):')
  console.log('  🎓 Student: student@demo.com')
  console.log('  👨‍🏫 Teacher: teacher@demo.com')
  console.log('  👨‍👩‍👧 Parent:  parent@demo.com')
  console.log('  🛡️ Admin:   admin@demo.com')
  console.log('=============================================================\n')
}

seed().catch((err) => {
  console.error('❌ Seeding failed with error:', err)
  process.exit(1)
})
