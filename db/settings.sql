USE rtp_app;

CREATE TABLE IF NOT EXISTS app_setting (
  id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
  refresh_interval_minutes INT UNSIGNED NOT NULL DEFAULT 10,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT chk_app_setting_singleton CHECK (id = 1),
  CONSTRAINT chk_app_setting_interval_range CHECK (refresh_interval_minutes BETWEEN 1 AND 60)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO app_setting (id, refresh_interval_minutes)
VALUES (1, 10)
ON DUPLICATE KEY UPDATE id = id;
