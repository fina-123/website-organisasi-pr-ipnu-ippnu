# 📝 CARA UPDATE PASSWORD ADMIN

**Email:** admin@ipnuipnu.com  
**Password Baru:** ipnuippnu123  
**Hash:** `$2a$10$p6iyah7MoZX9CBGiaD3SFOeVMh82JTPhd3289lXZyBVQ2lBbargDO`

---

## METODE 1: Menggunakan MySQL Command Line (Recommended)

```bash
# 1. Buka terminal/command prompt
# 2. Login ke MySQL
mysql -u root -p

# 3. Pilih database
USE ipnu_ippnu;

# 4. Jalankan query update
UPDATE created_accounts 
SET password_hash = '$2a$10$p6iyah7MoZX9CBGiaD3SFOeVMh82JTPhd3289lXZyBVQ2lBbargDO'
WHERE email = 'admin@ipnuipnu.com';

# 5. Verifikasi
SELECT id, email, full_name, role, 
       LEFT(password_hash, 20) as hash_preview
FROM created_accounts 
WHERE email = 'admin@ipnuipnu.com';

# 6. Keluar
EXIT;
```

---

## METODE 2: Menggunakan MySQL Workbench

1. Buka MySQL Workbench
2. Connect ke server MySQL
3. Pilih database `ipnu_ippnu`
4. Buka tab "Query"
5. Copy-paste query berikut:

```sql
UPDATE created_accounts 
SET password_hash = '$2a$10$p6iyah7MoZX9CBGiaD3SFOeVMh82JTPhd3289lXZyBVQ2lBbargDO'
WHERE email = 'admin@ipnuipnu.com';
```

6. Klik tombol "Execute" (⚡)
7. Verifikasi dengan query:

```sql
SELECT id, email, full_name, role 
FROM created_accounts 
WHERE email = 'admin@ipnuipnu.com';
```

---

## METODE 3: Menggunakan Script Node.js

<write_to_file>
<path>Organisasi IPNU IPPNU (1)/server/update-password.js</path>
<content>
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function updatePassword() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE,
  });

  try {
    const newHash = '$2a$10$p6iyah7MoZX9CBGiaD3SFOeVMh82JTPhd3289lXZyBVQ2lBbargDO';
    const email = 'admin@ipnuipnu.com';

    // Update password
    const [result] = await connection.execute(
      'UPDATE created_accounts SET password_hash = ? WHERE email = ?',
      [newHash, email]
    );

    console.log('✅ Password updated successfully!');
    console.log('Affected rows:', result.affectedRows);

    // Verify
    const [users] = await connection.execute(
      'SELECT id, email, full_name, role FROM created_accounts WHERE email = ?',
      [email]
    );

    if (users.length > 0) {
      console.log('✅ Admin user found:', users[0]);
    } else {
      console.log('❌ Admin user not found!');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

updatePassword();