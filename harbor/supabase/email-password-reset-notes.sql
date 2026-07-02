-- Optional production notes for Harbor Global Partner Academy email/password reset status.
-- The current application stores these fields safely in partners.avatar_url JSON metadata
-- so it works without changing the existing partners table.
--
-- Recommended server-only Vercel Production variables:
-- RESEND_API_KEY
-- EMAIL_FROM
-- ACADEMY_BASE_URL
--
-- Optional typed columns if you later want reporting outside the app:
alter table public.partners
  add column if not exists registration_email_sent boolean default false,
  add column if not exists registration_email_sent_at timestamptz,
  add column if not exists approval_email_sent boolean default false,
  add column if not exists approval_email_sent_at timestamptz,
  add column if not exists password_reset_requested boolean default false,
  add column if not exists password_reset_requested_at timestamptz;
