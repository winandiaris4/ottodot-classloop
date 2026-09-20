---
id: "010"
title: "Notifications: Real-Time In-App Notification Center and Resend Email Dispatcher"
status: "DONE"
urgency: "MEDIUM"
category: "Backend"
created_at: "2026-09-20"
blocked_by: ["006", "007"]
blocks: ["013"]
source_spec: "Specs/architecture.md"
---

## 🔍 Technical Analysis

Build the comprehensive Notification System in English across In-App Notification Center and Transactional Email via Resend:
1. **Server Actions & Utilities** (`src/lib/actions/notification.ts`, `src/lib/email/resend.ts`, `src/lib/email/templates.ts`):
   - `fetchNotificationsAction`: Retrieves user notifications with unread count
   - `markNotificationAsReadAction`: Marks single notification as read
   - `markAllNotificationsAsReadAction`: Marks all unread notifications for the user as read
   - `dispatchNotification`: Utility function that writes in-app notifications and sends Resend emails to recipients (students, parents, teachers)
2. **In-App Notification Center** (`src/components/layouts/NotificationBell.tsx`, `AppHeader.tsx`):
   - Real-time unread badge indicator on header bell icon
   - Interactive popover list of notifications with relative timestamps ("2 hours ago", "Yesterday")
   - Filter / Mark-as-read buttons with instant UI feedback
3. **Event Integrations**:
   - Homework Published -> triggers notifications for enrolled students and linked parents
   - Homework Submitted -> triggers notification for class teacher
   - Homework Graded -> triggers notification for student and linked parents with score & feedback snippet
4. **Email Dispatcher** (`src/lib/email/resend.ts`):
   - Resend SDK client integration with graceful fallback logging when `RESEND_API_KEY` is not provided
   - Responsive HTML templates with Ottodot edtech branding

## 📝 Sub-Tasks Breakdown

- [x] Create Resend client and email templates in `src/lib/email/`
- [x] Implement notification server actions and dispatch helpers in `src/lib/actions/notification.ts`
- [x] Connect automated notification triggers into teacher & student actions (`createHomeworkAction`, `submitHomeworkAction`, `gradeSubmissionAction`)
- [x] Build interactive `NotificationBell.tsx` component and integrate into `AppHeader.tsx`
- [x] Verify build and type check

## 📎 Referenced Files
- `src/lib/email/resend.ts`
- `src/lib/email/templates.ts`
- `src/lib/actions/notification.ts`
- `src/components/layouts/NotificationBell.tsx`
- `src/components/layouts/AppHeader.tsx`
- `src/lib/actions/teacher.ts`
- `src/lib/actions/student.ts`
