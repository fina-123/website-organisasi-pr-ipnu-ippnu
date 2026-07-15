-- Update password untuk admin@ipnuipnu.com
-- Password: ipnuippnu123
-- Hash: $2a$10$p6iyah7MoZX9CBGiaD3SFOeVMh82JTPhd3289lXZyBVQ2lBbargDO

UPDATE created_accounts 
SET password_hash = '$2a$10$p6iyah7MoZX9CBGiaD3SFOeVMh82JTPhd3289lXZyBVQ2lBbargDO'
WHERE email = 'admin@ipnuipnu.com';

-- Verifikasi data admin
SELECT id, email, full_name, role, 
       LEFT(password_hash, 20) as password_hash_preview
FROM created_accounts 
WHERE email = 'admin@ipnuipnu.com';