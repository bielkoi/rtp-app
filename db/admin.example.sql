-- Copy to db/admin.sql, replace <BCRYPT_HASH> with the output of:
--   node -e "console.log(require('bcryptjs').hashSync('CHANGE_ME', 10))"
-- then apply with: mysql -uroot < db/admin.sql

USE rtp_app;

CREATE TABLE IF NOT EXISTS admin_user (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  username VARCHAR(64) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_admin_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO admin_user (username, password_hash)
VALUES ('admin', '<BCRYPT_HASH>')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
