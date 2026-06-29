/**
 * Test script untuk memverifikasi endpoint POST /api/activities
 * 
 * Cara menjalankan:
 * node test-activity-api.js
 */

const http = require('http');

const API_BASE = 'http://localhost:4000';

const testData = {
  title: 'Test Kegiatan dari Script',
  type: 'MAKESTA',
  description: 'Ini adalah kegiatan test untuk memverifikasi API berfungsi dengan benar.',
  date: '2025-12-31',
  location: 'Lokasi Test',
  quota: 50,
  image: null
};

function testCreateActivity() {
  const postData = JSON.stringify(testData);

  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/activities',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            success: res.statusCode === 201,
            data: response
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            success: false,
            error: 'Failed to parse response',
            rawResponse: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject({
        success: false,
        error: error.message,
        hint: 'Pastikan backend server berjalan di http://localhost:4000'
      });
    });

    req.write(postData);
    req.end();
  });
}

function testGetActivities() {
  const options = {
    hostname: 'localhost',
    port: 4000,
    path: '/api/activities',
    method: 'GET'
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve({
            statusCode: res.statusCode,
            success: res.statusCode === 200,
            data: response,
            count: Array.isArray(response) ? response.length : 0
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            success: false,
            error: 'Failed to parse response',
            rawResponse: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject({
        success: false,
        error: error.message,
        hint: 'Pastikan backend server berjalan di http://localhost:4000'
      });
    });

    req.end();
  });
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('Testing Activity API');
  console.log('='.repeat(60));
  console.log('');

  // Test 1: GET /api/activities
  console.log('Test 1: GET /api/activities (list all activities)');
  console.log('-'.repeat(60));
  try {
    const getResult = await testGetActivities();
    if (getResult.success) {
      console.log('✅ SUCCESS');
      console.log(`   Status: ${getResult.statusCode}`);
      console.log(`   Total activities: ${getResult.count}`);
      if (getResult.count > 0) {
        console.log(`   First activity: ${getResult.data[0].title}`);
      }
    } else {
      console.log('❌ FAILED');
      console.log(`   Status: ${getResult.statusCode}`);
      console.log(`   Error: ${getResult.error || getResult.rawResponse}`);
    }
  } catch (error) {
    console.log('❌ FAILED');
    console.log(`   Error: ${error.error}`);
    console.log(`   Hint: ${error.hint}`);
  }
  console.log('');

  // Test 2: POST /api/activities
  console.log('Test 2: POST /api/activities (create new activity)');
  console.log('-'.repeat(60));
  try {
    const postResult = await testCreateActivity();
    if (postResult.success) {
      console.log('✅ SUCCESS');
      console.log(`   Status: ${postResult.statusCode}`);
      console.log(`   Created activity:`);
      console.log(`   - ID: ${postResult.data.id}`);
      console.log(`   - Title: ${postResult.data.title}`);
      console.log(`   - Type: ${postResult.data.type}`);
      console.log(`   - Status: ${postResult.data.status}`);
      console.log(`   - Quota: ${postResult.data.quota}`);
    } else {
      console.log('❌ FAILED');
      console.log(`   Status: ${postResult.statusCode}`);
      console.log(`   Error: ${postResult.error || JSON.stringify(postResult.data)}`);
    }
  } catch (error) {
    console.log('❌ FAILED');
    console.log(`   Error: ${error.error}`);
    console.log(`   Hint: ${error.hint}`);
  }
  console.log('');

  // Test 3: GET /api/activities (verify data was saved)
  console.log('Test 3: GET /api/activities (verify data was saved)');
  console.log('-'.repeat(60));
  try {
    const getResult2 = await testGetActivities();
    if (getResult2.success) {
      console.log('✅ SUCCESS');
      console.log(`   Status: ${getResult2.statusCode}`);
      console.log(`   Total activities: ${getResult2.count}`);
      
      // Check if our test activity is in the list
      const testActivity = getResult2.data.find(a => a.title === testData.title);
      if (testActivity) {
        console.log('   ✅ Test activity found in database!');
        console.log(`   - ID: ${testActivity.id}`);
        console.log(`   - Title: ${testActivity.title}`);
      } else {
        console.log('   ⚠️  Test activity not found (might be filtered out)');
      }
    } else {
      console.log('❌ FAILED');
      console.log(`   Status: ${getResult2.statusCode}`);
      console.log(`   Error: ${getResult2.error || getResult2.rawResponse}`);
    }
  } catch (error) {
    console.log('❌ FAILED');
    console.log(`   Error: ${error.error}`);
    console.log(`   Hint: ${error.hint}`);
  }
  console.log('');

  console.log('='.repeat(60));
  console.log('Test Summary');
  console.log('='.repeat(60));
  console.log('');
  console.log('Jika semua test berhasil (✅), berarti:');
  console.log('1. Backend berjalan dengan benar');
  console.log('2. Database terhubung');
  console.log('3. Endpoint POST /api/activities bekerja');
  console.log('4. Data tersimpan di MySQL');
  console.log('');
  console.log('Langkah selanjutnya:');
  console.log('1. Buka frontend di http://localhost:5173');
  console.log('2. Login sebagai admin');
  console.log('3. Test fitur "Tambah Kegiatan" di halaman Admin');
  console.log('4. Verifikasi kegiatan muncul di halaman User');
  console.log('');
}

// Run tests
runTests().catch(error => {
  console.error('Test runner failed:', error);
  process.exit(1);
});