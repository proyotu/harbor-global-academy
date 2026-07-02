alter table public.partners
  add column if not exists accepted_terms boolean not null default false,
  add column if not exists accepted_terms_at timestamptz,
  add column if not exists accepted_privacy boolean not null default false,
  add column if not exists accepted_privacy_at timestamptz,
  add column if not exists training_content_consent boolean not null default false,
  add column if not exists training_content_consent_at timestamptz;

comment on column public.partners.accepted_terms is 'Partner accepted the Harbor Global Partner Academy terms of use.';
comment on column public.partners.accepted_terms_at is 'Timestamp when the partner accepted the terms of use.';
comment on column public.partners.accepted_privacy is 'Partner accepted the privacy policy.';
comment on column public.partners.accepted_privacy_at is 'Timestamp when the partner accepted the privacy policy.';
comment on column public.partners.training_content_consent is 'Partner consented to internal training content usage inside the closed Academy.';
comment on column public.partners.training_content_consent_at is 'Timestamp when the partner consented to internal training content usage.';
