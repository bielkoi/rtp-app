USE rtp_app;

CREATE TABLE IF NOT EXISTS slide (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  filename VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_slide_sort (sort_order, id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed existing 4 slide image files
INSERT INTO slide (filename, sort_order)
SELECT 'koitoto1.jpeg', 1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM slide WHERE filename = 'koitoto1.jpeg');
INSERT INTO slide (filename, sort_order)
SELECT 'koitoto2.jpeg', 2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM slide WHERE filename = 'koitoto2.jpeg');
INSERT INTO slide (filename, sort_order)
SELECT 'koitoto28.jpeg', 3 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM slide WHERE filename = 'koitoto28.jpeg');
INSERT INTO slide (filename, sort_order)
SELECT 'koitoto3.jpeg', 4 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM slide WHERE filename = 'koitoto3.jpeg');
