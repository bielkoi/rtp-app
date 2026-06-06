USE rtp_app;

ALTER TABLE provider
  ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) NOT NULL DEFAULT 4.0;

ALTER TABLE provider
  ADD CONSTRAINT chk_provider_rating CHECK (rating >= 0 AND rating <= 5);
