import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function testLogin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE,
  });

  try {
    const email = 'ahmad.fauzi@example.com';
    const password = 'ipnuippnu123';

    console.log('🔍 Testing login for:', email);
    console.log('');

    // Get user from database
    const [users] = await connection.execute(
      'SELECT id, email, full_name, password_hash, role FROM created_accounts WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      console.log('❌ User not found!');
      return;
    }

    const user = users[0];
    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role
    });
    console.log('');

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    
    console.log('🔑 Password comparison:');
    console.log('  Input password:', password);
    console.log('  Stored hash:', user.password_hash);
    console.log('  Match result:', passwordMatch);
    console.log('');

    if (passwordMatch) {
      console.log('✅ LOGIN SUCCESSFUL!');
      console.log('');
      console.log('📋 Login Details:');
      console.log('  User ID:', user.id);
      console.log('  Email:', user.email);
      console.log('  Full Name:', user.full_name);
      console.log('  Role:', user.role);
      console.log('  Status: Active');
    } else {
      console.log('❌ LOGIN FAILED - Password does not match');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

testLogin();