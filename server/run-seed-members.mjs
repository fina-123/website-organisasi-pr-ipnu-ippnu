import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedMembers() {
  let connection;
  try {
    // Read SQL file
    const sql = readFileSync(path.join(__dirname, 'seed-members-sample.sql'), 'utf-8');
    
    // Connect to database
    connection = await mysql.createConnection({
      host: '127.0.0.1',
      port: 3307,
      user: 'root',
      password: '',
      database: 'ipnu_ippnu'
    });

    console.log('Connected to database. Executing seed script...\n');

    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed) {
        try {
          await connection.query(trimmed);
          console.log('✓ Executed:', trimmed.substring(0, 50) + '...');
        } catch (error) {
          // Ignore duplicate key errors
          if (error.code === 'ER_DUP_ENTRY') {
            console.log('⚠ Skipped (duplicate):', trimmed.substring(0, 50) + '...');
          } else {
            console.error('✗ Error executing:', trimmed.substring(0, 50) + '...');
            console.error('  Error:', error.message);
          }
        }
      }
    }

    console.log('\n=== Seed completed successfully! ===');
    
    // Verify data
    const [rows] = await connection.query(`
      SELECT 
        ca.id, 
        ca.full_name, 
        ca.email, 
        ca.phone, 
        ca.organization, 
        ca.role,
        mr.address
      FROM created_accounts ca
      LEFT JOIN member_registrations mr ON ca.registration_id = mr.id
      ORDER BY ca.organization, ca.full_name
    `);
    
    console.log('\n=== Members in database ===');
    console.log(`Total: ${rows.length} members\n`);
    rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.full_name} (${row.organization})`);
      console.log(`   Email: ${row.email}`);
      console.log(`   Phone: ${row.phone}`);
      console.log(`   Address: ${row.address || '-'}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedMembers();