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