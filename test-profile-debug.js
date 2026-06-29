// Test script untuk debug profile page
// Jalankan dengan: node test-profile-debug.js

const API_BASE = 'http://localhost:4000';

async function testProfileAPI() {
  console.log('=== Testing Profile API ===\n');

  // 1. Test get user by email
  console.log('1. Testing GET /api/users/by-email');
  try {
    const emailRes = await fetch(`${API_BASE}/api/users/by-email?email=ahmad.fauzi@example.com`);
    console.log('Status:', emailRes.status);
    if (emailRes.ok) {
      const userData = await emailRes.json();
      console.log('User data:', userData);
      console.log('User ID:', userData.id);
      
      // 2. Test get profile by userId
      console.log('\n2. Testing GET /api/user/profile');
      const profileRes = await fetch(`${API_BASE}/api/user/profile?userId=${userData.id}`);
      console.log('Status:', profileRes.status);
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        console.log('Profile data:', profileData);
      } else {
        const errorData = await profileRes.json();
        console.log('Error:', errorData);
      }
    } else {
      const errorData = await emailRes.json();
      console.log('Error:', errorData);
    }
  } catch (error) {
    console.error('Error:', error.message);
  }

  // 3. List all users in database
  console.log('\n3. Listing all users in created_accounts:');
  try {
    const res = await fetch(`${API_BASE}/api/created-accounts`);
    if (res.ok) {
      const users = await res.json();
      console.log('Total users:', users.length);
      users.forEach((user, index) => {
        console.log(`\n[${index + 1}] ID: ${user.id}`);
        console.log(`    Name: ${user.full_name}`);
        console.log(`    Email: ${user.email}`);
        console.log(`    Phone: ${user.phone}`);
        console.log(`    Organization: ${user.organization}`);
        console.log(`    Role: ${user.role}`);
        console.log(`    Created: ${user.created_at}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testProfileAPI().catch(console.error);