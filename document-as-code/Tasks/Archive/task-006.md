---
id: "006"
title: "Teacher Module: Class Management, Homework Creation, and Grading System"
status: "DONE"
urgency: "HIGH"
category: "Frontend"
created_at: "2026-09-20"
blocked_by: ["004", "005"]
blocks: ["010", "013"]
source_spec: "Specs/architecture.md"
---

## 🔍 Technical Analysis

Build the comprehensive Teacher workspace in English for Ottodot educators:
1. **Teacher Dashboard**: Real-time stats (Active classes, submissions needing review, enrolled students, upcoming live sessions) and quick action panels.
2. **Class Management**:
   - List teacher's classes with student counts and status badges
   - Create and edit class dialogs with validation
   - Class detail view with enrolled student roster and assigned homework
3. **Homework Management**:
   - Create and edit homework assignments (title, rich description, target class, due date, max score, draft/published status)
   - List homework grouped by status
4. **Grading & Feedback Workflow**:
   - Submission list per homework with submission timestamp and grading status
   - Split-view review modal/page: student's response & calculations on left, grading & feedback form on right
   - Server Actions to persist score and feedback with automated parent/student notification triggers

## 📝 Sub-Tasks Breakdown

- [x] Create validation schemas in `src/lib/validations/class.ts` and `src/lib/validations/homework.ts`
      *Verification:* Zod schemas validate class creation, homework details, and grading inputs
- [x] Create Server Actions in `src/lib/actions/teacher.ts`
      *Verification:* Actions handle class CRUD, homework CRUD, and submission grading with RLS enforcement
- [x] Upgrade Teacher Dashboard in `src/app/teacher/dashboard/page.tsx` to fetch live data from Supabase
      *Verification:* Displays real stats, pending submissions, and active classes from database
- [x] Build Classes Management page and Class Detail view in `src/app/teacher/classes/`
      *Verification:* Teachers can create classes, view student rosters, and inspect class homework
- [x] Build Homework Management and Grading workflow in `src/app/teacher/homework/`
      *Verification:* Teachers can create homework, view submissions, and grade Leo's pending submission
- [x] Verify build and type check
      *Verification:* `npm run build` succeeds without errors

## 📎 Referenced Files
- `src/lib/validations/class.ts`
- `src/lib/validations/homework.ts`
- `src/lib/actions/teacher.ts`
- `src/app/teacher/dashboard/page.tsx`
- `src/app/teacher/classes/page.tsx`
- `src/app/teacher/classes/[id]/page.tsx`
- `src/app/teacher/homework/page.tsx`
- `src/app/teacher/homework/[id]/submissions/page.tsx`
