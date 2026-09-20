---
id: "012"
title: "Seed Data & Demo Accounts (4 roles, classes, homework, submissions in English)"
status: "DONE"
urgency: "HIGH"
category: "DevOps"
created_at: "2026-09-20"
blocked_by: ["002", "003"]
blocks: ["013"]
source_spec: "Specs/architecture.md"
---

## 🔍 Technical Analysis

Populate the Supabase database with realistic, high-fidelity Ottodot edtech demo data in English:
1. **4 Core Demo Accounts** (with password `DemoPassword123!` and auto-confirmed email):
   - **Student**: `student@demo.com` (Leo Santoso, 10-year-old game explorer)
   - **Teacher**: `teacher@demo.com` (Dr. Maya Lin, Lead Science Instructor)
   - **Parent**: `parent@demo.com` (Sarah Jenkins, Leo's parent)
   - **Admin**: `admin@demo.com` (Aris Admin, Platform Operations Manager)
2. **Edtech Classes**:
   - *"Roblox Physics & Velocity Explorers"*
   - *"3D Geometry & Spatial World Building"*
3. **Homework Scenarios across all states**:
   - `GRADED` (Gravity & Friction Experiment with score 95/100 and teacher feedback)
   - `SUBMITTED` (Roller Coaster Loop Acceleration calculation awaiting grading)
   - `PENDING` (3D Coordinate Mapping with deadline in 20 hours)
   - `DRAFT` (Ecosystem Simulation Quiz draft for teacher)
4. **Subscription Plans & Active Enrollment**
5. **Parent-Student Family Relationship Mapping**
6. **Multi-Role In-App Notifications**

## 📝 Sub-Tasks Breakdown

- [x] Create executable seed script `supabase/seed/seed.ts` in TypeScript using Supabase Admin Auth & Service Client
      *Verification:* Script connects with `SUPABASE_SERVICE_ROLE_KEY` and sets up users with confirmed emails
- [x] Implement database seeding logic for plans, classes, sessions, enrollments, homework, submissions, and notifications in English
      *Verification:* Complete relational integrity across all 8+ tables
- [x] Add `npm run db:seed` script in `package.json` and execute seeding to Supabase Cloud
      *Verification:* Seed execution succeeds and returns confirmation summary
- [x] Verify test login for all 4 demo accounts
      *Verification:* Supabase Auth verifies credentials for student, teacher, parent, and admin

## 📎 Referenced Files
- `supabase/seed/seed.ts`
- `package.json`
- `.env.local`
- `src/lib/supabase/server.ts`
- `src/types/database.types.ts`
