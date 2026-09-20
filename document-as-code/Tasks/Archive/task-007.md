---
id: "007"
title: "Student Module: Homework List, Submit Homework, and View Grades & Feedback"
status: "DONE"
urgency: "HIGH"
category: "Frontend"
created_at: "2026-09-20"
blocked_by: ["004", "005"]
blocks: ["010", "013"]
source_spec: "Specs/architecture.md"
---

## 🔍 Technical Analysis

Build the student workspace in English tailored for kids/learners (ages 8–15):
1. **Student Dashboard**: Live summary of active homework tasks, graded scores with feedback, enrolled classes, and scheduled live class sessions.
2. **Homework Hub**:
   - Filterable tabs: *All Assignments*, *To Do (Pending Submission)*, *Under Review*, and *Graded*
   - Clear visual status badges and due date countdown indicators
3. **Interactive Homework Submission**:
   - Detail view with assignment prompt and instructions
   - Submission form with validation for text response/calculations
   - Post-submission status display (view teacher grade, score percentage, and detailed feedback note)
4. **Class Schedule View**:
   - Upcoming live class sessions with timestamps and topic notes

## 📝 Sub-Tasks Breakdown

- [x] Create validation schema in `src/lib/validations/submission.ts`
      *Verification:* Zod schema validates student homework submission content
- [x] Create Server Actions in `src/lib/actions/student.ts`
      *Verification:* Action handles homework submission and notifies teacher
- [x] Upgrade Student Dashboard in `src/app/student/dashboard/page.tsx` to fetch live data from Supabase
      *Verification:* Displays real homework tasks, grades, and schedule for Leo Santoso
- [x] Build Homework List page in `src/app/student/homework/page.tsx`
      *Verification:* Filterable view of assigned homework grouped by status
- [x] Build Homework Submission & Detail page in `src/app/student/homework/[id]/page.tsx`
      *Verification:* Students can submit homework and view teacher feedback & score
- [x] Build Student Schedule page in `src/app/student/schedule/page.tsx`
      *Verification:* Shows upcoming live class sessions
- [x] Verify build and type check
      *Verification:* `npm run build` succeeds without errors

## 📎 Referenced Files
- `src/lib/validations/submission.ts`
- `src/lib/actions/student.ts`
- `src/app/student/dashboard/page.tsx`
- `src/app/student/homework/page.tsx`
- `src/app/student/homework/[id]/page.tsx`
- `src/app/student/schedule/page.tsx`
