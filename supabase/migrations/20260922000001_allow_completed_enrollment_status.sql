-- Migration: Allow 'completed' status in enrollments table
-- Description: Update enrollments_status_check constraint to permit 'completed'

ALTER TABLE public.enrollments DROP CONSTRAINT IF EXISTS enrollments_status_check;
ALTER TABLE public.enrollments ADD CONSTRAINT enrollments_status_check 
  CHECK (status IN ('active', 'completed', 'cancelled', 'expired'));

