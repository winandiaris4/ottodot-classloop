-- =============================================================================
-- Migration: 20260920000002_rls_policies.sql
-- Description: Row Level Security (RLS) Policies for Multi-Role Data Isolation
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 0. Security Definer Helper Functions (Avoids RLS recursion)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- -----------------------------------------------------------------------------
-- 1. Table: user_profiles
-- -----------------------------------------------------------------------------
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- SELECT: Users can view own profile
CREATE POLICY "users_view_own_profile"
  ON public.user_profiles FOR SELECT
  USING (auth.uid() = id);

-- SELECT: Teacher can view student profiles in their classes
CREATE POLICY "teacher_view_class_students"
  ON public.user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.classes c ON c.id = e.class_id
      WHERE e.student_id = user_profiles.id
        AND c.teacher_id = auth.uid()
    )
  );

-- SELECT: Student & Parent can view teacher profile of enrolled class
CREATE POLICY "members_view_teachers"
  ON public.user_profiles FOR SELECT
  USING (
    user_profiles.role = 'teacher' AND (
      EXISTS (
        SELECT 1 FROM public.enrollments e
        JOIN public.classes c ON c.id = e.class_id
        WHERE c.teacher_id = user_profiles.id
          AND e.student_id = auth.uid()
      ) OR
      EXISTS (
        SELECT 1 FROM public.parent_student_links psl
        JOIN public.enrollments e ON e.student_id = psl.student_id
        JOIN public.classes c ON c.id = e.class_id
        WHERE psl.parent_id = auth.uid()
          AND c.teacher_id = user_profiles.id
      )
    )
  );

-- SELECT: Parent can view their linked children profiles
CREATE POLICY "parent_view_linked_children"
  ON public.user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.parent_student_links
      WHERE parent_id = auth.uid()
        AND student_id = user_profiles.id
    )
  );

-- SELECT: Admin can view all profiles
CREATE POLICY "admin_view_all_profiles"
  ON public.user_profiles FOR SELECT
  USING (public.is_admin());

-- UPDATE: Users can update their own non-sensitive profile info
CREATE POLICY "users_update_own_profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ALL: Admin can manage all profiles
CREATE POLICY "admin_manage_all_profiles"
  ON public.user_profiles FOR ALL
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 2. Table: parent_student_links
-- -----------------------------------------------------------------------------
ALTER TABLE public.parent_student_links ENABLE ROW LEVEL SECURITY;

-- SELECT: Parent or student can view their own relationship
CREATE POLICY "family_view_own_links"
  ON public.parent_student_links FOR SELECT
  USING (parent_id = auth.uid() OR student_id = auth.uid() OR public.is_admin());

-- ALL: Admin can manage family links
CREATE POLICY "admin_manage_family_links"
  ON public.parent_student_links FOR ALL
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 3. Table: classes
-- -----------------------------------------------------------------------------
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- SELECT: Anyone can view active classes (for catalog/enrollment)
CREATE POLICY "anyone_view_active_classes"
  ON public.classes FOR SELECT
  USING (status = 'active' OR teacher_id = auth.uid() OR public.is_admin());

-- ALL: Teacher can manage their own classes
CREATE POLICY "teacher_manage_own_classes"
  ON public.classes FOR ALL
  USING (teacher_id = auth.uid() OR public.is_admin())
  WITH CHECK (teacher_id = auth.uid() OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 4. Table: class_sessions
-- -----------------------------------------------------------------------------
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;

-- SELECT: Viewable if user has access to class
CREATE POLICY "view_class_sessions"
  ON public.class_sessions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_sessions.class_id
        AND (
          c.status = 'active' OR
          c.teacher_id = auth.uid() OR
          public.is_admin() OR
          EXISTS (SELECT 1 FROM public.enrollments e WHERE e.class_id = c.id AND e.student_id = auth.uid()) OR
          EXISTS (
            SELECT 1 FROM public.parent_student_links psl
            JOIN public.enrollments e ON e.student_id = psl.student_id
            WHERE psl.parent_id = auth.uid() AND e.class_id = c.id
          )
        )
    )
  );

-- ALL: Teacher who owns the class or admin can manage sessions
CREATE POLICY "teacher_manage_class_sessions"
  ON public.class_sessions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = class_sessions.class_id
        AND (c.teacher_id = auth.uid() OR public.is_admin())
    )
  );

-- -----------------------------------------------------------------------------
-- 5. Table: plans
-- -----------------------------------------------------------------------------
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- SELECT: Anyone can view active plans
CREATE POLICY "anyone_view_active_plans"
  ON public.plans FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

-- ALL: Admin can manage plans
CREATE POLICY "admin_manage_plans"
  ON public.plans FOR ALL
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 6. Table: enrollments
-- -----------------------------------------------------------------------------
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- SELECT: Student can view own enrollment
CREATE POLICY "student_view_own_enrollments"
  ON public.enrollments FOR SELECT
  USING (student_id = auth.uid());

-- SELECT: Parent can view linked children enrollments
CREATE POLICY "parent_view_children_enrollments"
  ON public.enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.parent_student_links psl
      WHERE psl.parent_id = auth.uid()
        AND psl.student_id = enrollments.student_id
    )
  );

-- SELECT: Teacher can view enrollments in their classes
CREATE POLICY "teacher_view_class_enrollments"
  ON public.enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = enrollments.class_id
        AND c.teacher_id = auth.uid()
    )
  );

-- ALL: Admin can manage all enrollments
CREATE POLICY "admin_manage_all_enrollments"
  ON public.enrollments FOR ALL
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 7. Table: homework
-- -----------------------------------------------------------------------------
ALTER TABLE public.homework ENABLE ROW LEVEL SECURITY;

-- SELECT: Teacher can view own homework
CREATE POLICY "teacher_view_own_homework"
  ON public.homework FOR SELECT
  USING (teacher_id = auth.uid());

-- SELECT: Student can view published homework in enrolled classes
CREATE POLICY "student_view_enrolled_homework"
  ON public.homework FOR SELECT
  USING (
    status = 'published' AND
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.class_id = homework.class_id
        AND e.student_id = auth.uid()
    )
  );

-- SELECT: Parent can view published homework for their children
CREATE POLICY "parent_view_children_homework"
  ON public.homework FOR SELECT
  USING (
    status = 'published' AND
    EXISTS (
      SELECT 1 FROM public.parent_student_links psl
      JOIN public.enrollments e ON e.student_id = psl.student_id
      WHERE psl.parent_id = auth.uid()
        AND e.class_id = homework.class_id
    )
  );

-- ALL: Teacher can manage homework in their classes
CREATE POLICY "teacher_manage_own_homework"
  ON public.homework FOR ALL
  USING (teacher_id = auth.uid() OR public.is_admin())
  WITH CHECK (teacher_id = auth.uid() OR public.is_admin());

-- -----------------------------------------------------------------------------
-- 8. Table: homework_submissions
-- -----------------------------------------------------------------------------
ALTER TABLE public.homework_submissions ENABLE ROW LEVEL SECURITY;

-- SELECT: Student can view own submission
CREATE POLICY "student_view_own_submission"
  ON public.homework_submissions FOR SELECT
  USING (student_id = auth.uid());

-- INSERT: Student can submit homework for enrolled class
CREATE POLICY "student_insert_own_submission"
  ON public.homework_submissions FOR INSERT
  WITH CHECK (
    student_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.homework hw
      JOIN public.enrollments e ON e.class_id = hw.class_id
      WHERE hw.id = homework_submissions.homework_id
        AND e.student_id = auth.uid()
    )
  );

-- UPDATE: Student can update un-graded submission
CREATE POLICY "student_update_own_submission"
  ON public.homework_submissions FOR UPDATE
  USING (student_id = auth.uid() AND score IS NULL)
  WITH CHECK (student_id = auth.uid() AND score IS NULL);

-- SELECT: Teacher can view all submissions for their homework
CREATE POLICY "teacher_view_class_submissions"
  ON public.homework_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.homework hw
      WHERE hw.id = homework_submissions.homework_id
        AND hw.teacher_id = auth.uid()
    )
  );

-- UPDATE: Teacher can grade and provide feedback for their homework
CREATE POLICY "teacher_grade_submissions"
  ON public.homework_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.homework hw
      WHERE hw.id = homework_submissions.homework_id
        AND hw.teacher_id = auth.uid()
    )
  );

-- SELECT: Parent can view their children submissions
CREATE POLICY "parent_view_children_submissions"
  ON public.homework_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.parent_student_links psl
      WHERE psl.parent_id = auth.uid()
        AND psl.student_id = homework_submissions.student_id
    )
  );

-- ALL: Admin can manage all submissions
CREATE POLICY "admin_manage_submissions"
  ON public.homework_submissions FOR ALL
  USING (public.is_admin());

-- -----------------------------------------------------------------------------
-- 9. Table: notifications
-- -----------------------------------------------------------------------------
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- SELECT: User can view own notifications
CREATE POLICY "users_view_own_notifications"
  ON public.notifications FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

-- UPDATE: User can mark own notifications as read
CREATE POLICY "users_update_own_notifications"
  ON public.notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ALL: Admin can manage all notifications
CREATE POLICY "admin_manage_notifications"
  ON public.notifications FOR ALL
  USING (public.is_admin());
