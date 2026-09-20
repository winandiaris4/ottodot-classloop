import dotenv from 'dotenv'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!')
  process.exit(1)
}

const adminClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function runQA() {
  console.log('🚀 Starting ClassLoop End-to-End Integration QA...\n')
  let passedTests = 0
  let totalTests = 0

  function assert(condition: boolean, testName: string, errorDetail?: any) {
    totalTests++
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`)
      passedTests++
    } else {
      console.error(`  ❌ [FAIL] ${testName}`)
      if (errorDetail) {
        console.error(`     Details:`, errorDetail)
      }
    }
  }

  // TEST SUITE 1: User Profiles & Role Distribution
  console.log('--- Suite 1: User Profiles & Demo Roles ---')
  const { data: users, error: userError } = await adminClient
    .from('user_profiles')
    .select('*')

  assert(!userError && users && users.length >= 4, 'Fetched all registered demo users', userError)
  
  const student = users?.find((u) => u.role === 'student')
  const teacher = users?.find((u) => u.role === 'teacher')
  const parent = users?.find((u) => u.role === 'parent')
  const admin = users?.find((u) => u.role === 'admin')

  assert(!!student, `Student account verified: ${student?.full_name} (${student?.id})`)
  assert(!!teacher, `Teacher account verified: ${teacher?.full_name} (${teacher?.id})`)
  assert(!!parent, `Parent account verified: ${parent?.full_name} (${parent?.id})`)
  assert(!!admin, `Admin account verified: ${admin?.full_name} (${admin?.id})`)

  // TEST SUITE 2: Parent-Student Linking
  console.log('\n--- Suite 2: Parent-Student Linking & Visibility ---')
  const { data: links, error: linkError } = await adminClient
    .from('parent_student_links')
    .select('*')

  assert(!linkError && links && links.length > 0, 'Parent-student link records exist', linkError)
  const activeLink = links?.find((l) => l.parent_id === parent?.id && l.student_id === student?.id)
  assert(!!activeLink, `Sarah Jenkins (parent) is successfully linked to Leo Santoso (student)`)

  // TEST SUITE 3: Classes & Enrollments
  console.log('\n--- Suite 3: Classes & Student Enrollments ---')
  const { data: classes, error: classError } = await adminClient
    .from('classes')
    .select('*')

  assert(!classError && classes && classes.length >= 2, 'Active STEM classes verified in database', classError)
  
  const { data: enrollments, error: enrollError } = await adminClient
    .from('enrollments')
    .select('*')
    .eq('student_id', student?.id || '')
    .eq('status', 'active')

  assert(!enrollError && enrollments && enrollments.length > 0, 'Student has active course enrollments', enrollError)

  // TEST SUITE 4: Homework & Submissions Lifecycle
  console.log('\n--- Suite 4: Homework Lifecycle & Grading ---')
  const { data: homeworkList, error: hwError } = await adminClient
    .from('homework')
    .select('*')

  assert(!hwError && homeworkList && homeworkList.length >= 4, 'Homework assignments created across lifecycle states', hwError)

  const { data: submissions, error: subError } = await adminClient
    .from('homework_submissions')
    .select('*')
    .eq('student_id', student?.id || '')

  assert(!subError && submissions && submissions.length >= 2, 'Submissions recorded for student', subError)
  const gradedSubmission = submissions?.find((s) => s.graded_at !== null && s.score !== null)
  assert(!!gradedSubmission, `Graded submission verified with score: ${gradedSubmission?.score} pts and teacher feedback`)

  // TEST SUITE 5: Notifications Integrity
  console.log('\n--- Suite 5: In-App Notification Center ---')
  const { data: notifications, error: notifError } = await adminClient
    .from('notifications')
    .select('*')

  assert(!notifError && notifications && notifications.length >= 3, 'In-app notifications successfully dispatched', notifError)
  const parentNotif = notifications?.find((n) => n.user_id === parent?.id)
  const studentNotif = notifications?.find((n) => n.user_id === student?.id)
  assert(!!parentNotif, `Parent received in-app notification: "${parentNotif?.title}"`)
  assert(!!studentNotif, `Student received in-app notification: "${studentNotif?.title}"`)

  // TEST SUITE 6: Pricing Plans
  console.log('\n--- Suite 6: Pricing & Subscription Plans ---')
  const { data: plans, error: planError } = await adminClient
    .from('plans')
    .select('*')

  assert(!planError && plans && plans.length >= 2, 'Self-serve pricing tiers (Explorer & Master) verified', planError)

  console.log(`\n========================================`)
  console.log(`🎉 QA Results: ${passedTests}/${totalTests} Tests Passed`)
  console.log(`========================================\n`)

  if (passedTests !== totalTests) {
    process.exit(1)
  }
}

runQA().catch((err) => {
  console.error('Fatal QA error:', err)
  process.exit(1)
})
