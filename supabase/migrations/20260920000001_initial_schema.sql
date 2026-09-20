-- =============================================================================
-- Migration: 20260920000001_initial_schema.sql
-- Description: Core Schema for ClassLoop Platform (8 tables, triggers & indexes)
-- =============================================================================

-- 1. Helper function for auto updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 2. Table: user_profiles (Extends Supabase auth.users)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  role        TEXT NOT NULL CHECK (role IN ('student', 'parent', 'teacher', 'admin')),
  avatar_url  TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 3. Table: parent_student_links (Family relationship mapping)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.parent_student_links (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id   UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_parent_student UNIQUE(parent_id, student_id)
);

-- -----------------------------------------------------------------------------
-- 4. Table: classes (Classrooms managed by teachers)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.classes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT NOT NULL,
  description  TEXT,
  teacher_id   UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE RESTRICT,
  max_students INT NOT NULL DEFAULT 20,
  status       TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 5. Table: class_sessions (Scheduled live/virtual class sessions)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.class_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  starts_at   TIMESTAMPTZ NOT NULL,
  ends_at     TIMESTAMPTZ NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. Table: plans (Subscription & enrollment pricing tiers)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.plans (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  price_cents     INT NOT NULL,
  currency        TEXT NOT NULL DEFAULT 'usd',
  duration_days   INT NOT NULL,
  class_count     INT NOT NULL,
  stripe_price_id TEXT UNIQUE,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. Table: enrollments (Student enrollment in classes)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.enrollments (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id          UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  class_id            UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  plan_id             UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  status              TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  stripe_session_id   TEXT,
  stripe_payment_id   TEXT,
  enrolled_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at          TIMESTAMPTZ,
  CONSTRAINT unique_student_class_enrollment UNIQUE(student_id, class_id)
);

-- -----------------------------------------------------------------------------
-- 8. Table: homework (Homework tasks created by teachers)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.homework (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id    UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  teacher_id  UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE RESTRICT,
  title       TEXT NOT NULL,
  description TEXT,
  due_at      TIMESTAMPTZ NOT NULL,
  max_score   INT NOT NULL DEFAULT 100,
  status      TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER set_homework_updated_at
  BEFORE UPDATE ON public.homework
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 9. Table: homework_submissions (Student submission & grading)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.homework_submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_id     UUID NOT NULL REFERENCES public.homework(id) ON DELETE CASCADE,
  student_id      UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  content         TEXT,
  attachment_url  TEXT,
  score           INT,
  feedback        TEXT,
  graded_at       TIMESTAMPTZ,
  graded_by       UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_homework_student_submission UNIQUE(homework_id, student_id)
);

CREATE TRIGGER set_homework_submissions_updated_at
  BEFORE UPDATE ON public.homework_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- -----------------------------------------------------------------------------
-- 10. Table: notifications (In-app alerts for all user roles)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  body        TEXT,
  type        TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  metadata    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 11. Trigger: Auto-create user_profile on auth.users signup
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to prevent duplicates on rerun
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 12. Indexes for Performance & Relational Lookups
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_parent_student_parent ON public.parent_student_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_student_student ON public.parent_student_links(student_id);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_class_sessions_class ON public.class_sessions(class_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON public.enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_class ON public.enrollments(class_id);
CREATE INDEX IF NOT EXISTS idx_homework_class ON public.homework(class_id);
CREATE INDEX IF NOT EXISTS idx_homework_due ON public.homework(due_at);
CREATE INDEX IF NOT EXISTS idx_submissions_homework ON public.homework_submissions(homework_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.homework_submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);

