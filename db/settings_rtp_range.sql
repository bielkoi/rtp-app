USE rtp_app;

-- Add RTP min/max range columns. Defaults 0-100 = behavior sebelumnya.
ALTER TABLE app_setting
  ADD COLUMN IF NOT EXISTS rtp_min INT UNSIGNED NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rtp_max INT UNSIGNED NOT NULL DEFAULT 100;

-- Constraint: 0 ≤ min < max ≤ 100
ALTER TABLE app_setting
  ADD CONSTRAINT chk_app_setting_rtp_range
  CHECK (rtp_min >= 0 AND rtp_max <= 100 AND rtp_min < rtp_max);
