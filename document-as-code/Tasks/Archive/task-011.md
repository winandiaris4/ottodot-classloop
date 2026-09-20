---
id: "011"
title: "Self-Serve Enrollment: Public Landing Page, Pricing Tiers, Stripe Checkout, and Webhook Fulfillment"
status: "DONE"
urgency: "MEDIUM"
category: "Backend"
created_at: "2026-09-20"
blocked_by: ["002", "004", "009"]
blocks: ["013"]
source_spec: "Specs/architecture.md"
---

## 🔍 Technical Analysis

Build the public conversion funnel and automated payment infrastructure in English:
1. **Marketing Landing Page & Pricing** (`src/app/page.tsx`, `src/app/pricing/page.tsx`):
   - High-converting hero section with Ottodot gamified STEM branding
   - Course showcase (Roblox Physics, Scratch Game Dev, AI & Robotics)
   - Multi-role feature highlights (Students, Parents, Teachers)
   - Pricing tiers card grid with dynamic checkout triggers
   - 1-Click Demo Sandbox banner for interviewers/reviewers
2. **Stripe Checkout API** (`src/app/api/checkout/route.ts`, `src/lib/stripe/client.ts`):
   - Creates Stripe Checkout Session for subscription/one-time plan
   - Attaches `plan_id`, `class_id`, and `user_id` to session metadata
   - Handles test-mode graceful fallback if live keys are pending
3. **Stripe Webhook Handler** (`src/app/api/webhooks/stripe/route.ts`):
   - Verifies Stripe webhook signature
   - Processes `checkout.session.completed`
   - Automatically inserts or activates row in `enrollments` table
   - Dispatches welcome notification to student and parent
4. **Checkout Status Views** (`src/app/enrollment/success/page.tsx`, `src/app/enrollment/cancel/page.tsx`):
   - Clean confirmation view with instant dashboard routing

## 📝 Sub-Tasks Breakdown

- [x] Create Stripe client and checkout utility in `src/lib/stripe/`
- [x] Implement `/api/checkout` session creation route
- [x] Implement `/api/webhooks/stripe` event fulfillment route
- [x] Build Enrollment Success & Cancel pages
- [x] Build complete Public Landing Page & Pricing showcase in `src/app/page.tsx`
- [x] Verify build and type check

## 📎 Referenced Files
- `src/lib/stripe/client.ts`
- `src/app/api/checkout/route.ts`
- `src/app/api/webhooks/stripe/route.ts`
- `src/app/enrollment/success/page.tsx`
- `src/app/enrollment/cancel/page.tsx`
- `src/app/page.tsx`
