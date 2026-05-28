-- =============================================
-- CONSUMERS (must be inserted before user_accounts)
-- =============================================
INSERT INTO consumers (consumer_number, name, address, meter_number, tariff_type, created_at)
VALUES
  ('1234567890001', 'Rajesh Kumar',    '12 MG Road, Ujjain, MP',         'MTR-001', 'DOMESTIC',    CURRENT_TIMESTAMP),
  ('1234567890002', 'Sunita Sharma',   '45 Civil Lines, Indore, MP',      'MTR-002', 'DOMESTIC',    CURRENT_TIMESTAMP),
  ('1234567890003', 'Patel Industries','Plot 7, Industrial Area, Dewas',  'MTR-003', 'INDUSTRIAL',  CURRENT_TIMESTAMP),
  ('1234567890004', 'Green Cafe',      '88 Freeganj, Ujjain, MP',         'MTR-004', 'COMMERCIAL',  CURRENT_TIMESTAMP),
  ('1234567890005', 'Amit Verma',      '3 Nankakhedi, Ujjain, MP',        'MTR-005', 'DOMESTIC',    CURRENT_TIMESTAMP);

-- =============================================
-- USER ACCOUNTS (passwords are BCrypt of shown value)
-- admin    -> Admin@123
-- sme1     -> Sme@1234
-- sme2     -> Sme@1234
-- customer1 -> Cust@123 (linked to consumer 1)
-- customer2 -> Cust@123 (linked to consumer 2)
-- =============================================
INSERT INTO user_accounts (username, password_hash, email, phone, role, consumer_id, is_active, created_at)
VALUES
  ('admin',
   '$2b$10$B0QUXaR80oDkJzuPDvlOdOXiqzKZ7P50VhbsVmySqwdbhGESLwlSO', -- Password@123
   'admin1@vidyutseva.com', '9999999999', 'ADMIN', NULL, TRUE, CURRENT_TIMESTAMP),

  ('sme1',
   '$2b$10$B0QUXaR80oDkJzuPDvlOdOXiqzKZ7P50VhbsVmySqwdbhGESLwlSO', -- Password@123
   'sme1@vidyutseva.com', '9888888881', 'SME', NULL, TRUE, CURRENT_TIMESTAMP),

  ('sme2',
   '$2b$10$B0QUXaR80oDkJzuPDvlOdOXiqzKZ7P50VhbsVmySqwdbhGESLwlSO', -- Password@123
   'sme2@vidyutseva.com', '9888888882', 'SME', NULL, TRUE, CURRENT_TIMESTAMP),

  ('rajesh_k',
   '$2b$10$B0QUXaR80oDkJzuPDvlOdOXiqzKZ7P50VhbsVmySqwdbhGESLwlSO', -- Password@123
   'customer1@vidyutseva.com', '9777777771', 'CUSTOMER', 1, TRUE, CURRENT_TIMESTAMP),

  ('sunita_s',
   '$2a$10$ixnCT04n45yWtBXUHgxHau5kzAJ5.Dq4gN0lnH7NvXSZSCdZ9Hpby',
   'sunita@gmail.com', '9777777772', 'CUSTOMER', 2, TRUE, CURRENT_TIMESTAMP);

-- Link consumers back to their users
UPDATE consumers SET linked_user_id = 4 WHERE id = 1;
UPDATE consumers SET linked_user_id = 5 WHERE id = 2;

-- =============================================
-- BILLS
-- =============================================
INSERT INTO bills (consumer_id, billing_period, units_consumed, amount_due, due_date, status, generated_at)
VALUES
  (1, '2025-03', 180.0, 900.00,  '2025-04-15', 'PAID',   CURRENT_TIMESTAMP),
  (1, '2025-04', 210.0, 1050.00, '2025-05-15', 'PAID',   CURRENT_TIMESTAMP),
  (1, '2025-05', 195.0, 975.00,  '2025-06-15', 'UNPAID', CURRENT_TIMESTAMP),
  (2, '2025-04', 160.0, 800.00,  '2025-05-15', 'PAID',   CURRENT_TIMESTAMP),
  (2, '2025-05', 175.0, 875.00,  '2025-06-15', 'UNPAID', CURRENT_TIMESTAMP),
  (3, '2025-05', 500.0, 5000.00, '2025-06-10', 'OVERDUE',CURRENT_TIMESTAMP);

-- =============================================
-- PAYMENTS (for PAID bills)
-- =============================================
INSERT INTO payments (bill_id, consumer_id, amount_paid, payment_mode, payment_status, transaction_ref, paid_at)
VALUES
  (1, 1, 900.00,  'ONLINE', 'SUCCESS', 'TXN-001-SEED-0001', CURRENT_TIMESTAMP),
  (2, 1, 1050.00, 'ONLINE', 'SUCCESS', 'TXN-002-SEED-0002', CURRENT_TIMESTAMP),
  (4, 2, 800.00,  'CARD',   'SUCCESS', 'TXN-003-SEED-0003', CURRENT_TIMESTAMP);

-- =============================================
-- INVOICES (for each successful payment)
-- =============================================
INSERT INTO invoices (payment_id, invoice_number, generated_at)
VALUES
  (1, 'INV-20250315-1', CURRENT_TIMESTAMP),
  (2, 'INV-20250415-2', CURRENT_TIMESTAMP),
  (3, 'INV-20250416-3', CURRENT_TIMESTAMP);

-- =============================================
-- COMPLAINTS
-- =============================================
INSERT INTO complaints (consumer_id, raised_by_user_id, description, category, status, logged_by_admin, created_at)
VALUES
  (1, 4, 'My electricity bill seems too high compared to last month. Please check the meter reading.', 'BILLING',    'OPEN',     FALSE, CURRENT_TIMESTAMP),
  (2, 5, 'Power outage in my area since yesterday evening. No electricity for 18 hours.', 'OUTAGE',     'ASSIGNED',  FALSE, CURRENT_TIMESTAMP),
  (3, 1, 'Walk-in customer reported sparks from meter box. Needs urgent inspection.', 'METER_FAULT', 'OPEN',     TRUE,  CURRENT_TIMESTAMP);

-- Assign the second complaint to sme1
UPDATE complaints SET assigned_sme_id = 2 WHERE id = 2;

-- =============================================
-- CARDS (for testing online payments)
-- =============================================
INSERT INTO cards (card_number, card_holder_name, cvv, expiry_date) VALUES
('1234567812345678', 'John Doe', '123', '12/25'),
('8765432187654321', 'Jane Doe', '456', '11/26'),
('1111222233334444', 'Test User', '789', '10/27');

