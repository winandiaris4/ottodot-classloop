---
id: "008"
title: "Parent Module: Dashboard Progress, Children Grade Reports, and Class Schedule"
status: "DONE"
urgency: "MEDIUM"
category: "Frontend"
created_at: "2026-09-20"
blocked_by: ["004", "005"]
blocks: ["013"]
source_spec: "Specs/architecture.md"
---

## 🔍 Technical Analysis

Build the Parent Visibility Hub in English to provide parents with full academic oversight of their enrolled children:
1. **Parent Dashboard**:
   - Fetches linked children through `parent_student_links`
   - Real-time aggregate statistics: Total Linked Children, Overall Homework Completion Rate (%), Average Assignment Score, and Upcoming Live Sessions
   - Recent Teacher Feedback feed with teacher notes and scores
2. **Children Progress & Detailed Grade Reports** (`/parent/children`):
   - Detailed progress breakdown per child
   - Course enrollment cards (e.g. Roblox Physics)
   - Complete homework score history with max score baselines and teacher feedback notes
   - Pending homework task indicators
3. **Family Class Schedule** (`/parent/schedule`):
   - Live session calendar showing class dates, times, and instructor details for all children

## 📝 Sub-Tasks Breakdown

- [x] Upgrade Parent Dashboard in `src/app/parent/dashboard/page.tsx` to query live linked children data
      *Verification:* Displays Sarah Jenkins's linked child (Leo Santoso), completion rate, average score, and teacher feedback
- [x] Build Children Progress page in `src/app/parent/children/page.tsx`
      *Verification:* Displays detailed course progress, graded assignments, and feedback from Dr. Maya Lin
- [x] Build Parent Schedule page in `src/app/parent/schedule/page.tsx`
      *Verification:* Shows upcoming live class sessions for linked children
- [x] Verify build and type check
      *Verification:* `npm run build` succeeds without errors

## 📎 Referenced Files
- `src/app/parent/dashboard/page.tsx`
- `src/app/parent/children/page.tsx`
- `src/app/parent/schedule/page.tsx`
- `src/app/parent/layout.tsx`
