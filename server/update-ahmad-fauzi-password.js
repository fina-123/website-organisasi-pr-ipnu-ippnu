import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

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
    // Generate hash for password 'ipnuippnu123'
    const newPassword = 'ipnuippnu123';
    const newHash = bcrypt.hashSync(newPassword, 10);
    
    console.log('Generated hash:', newHash);
    console.log('');

    const email = 'ahmad.fauzi@example.com';

    // Check if user exists
    const [users] = await connection.execute(
      'SELECT id, email, full_name, role FROM created_accounts WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log('❌ User not found with email:', email);
      console.log('Available users in database:');
      const [allUsers] = await connection.execute(
        'SELECT id, email, full_name, role FROM created_accounts'
      );
      allUsers.forEach(user => {
        console.log(`  - ${user.email} (${user.full_name}) - ${user.role}`);
      });
      return;
    }

    console.log('✅ User found:', users[0]);
    console.log('');

    // Update password
    const [result] = await connection.execute(
      'UPDATE created_accounts SET password_hash = ? WHERE email = ?',
      [newHash, email]
    );

    console.log('✅ Password updated successfully!');
    console.log('Affected rows:', result.affectedRows);
    console.log('');

    // Verify the update
    const [updatedUsers] = await connection.execute(
      'SELECT id, email, full_name, role FROM created_accounts WHERE email = ?',
      [email]
    );

    console.log('✅ Updated user:', updatedUsers[0]);
    console.log('');
    console.log('📋 Summary:');
    console.log('  Email:', email);
    console.log('  Password:', newPassword);
    console.log('  Status: Password has been reset successfully');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

updatePassword();