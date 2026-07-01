const API_BASE = 'http://localhost:4000';

async function testMembersAPI() {
  console.log('=== Testing Members API ===\n');

  // Test 1: Get all members
  console.log('1. GET /api/members (all members)');
  const response1 = await fetch(`${API_BASE}/api/members`);
  const data1 = await response1.json();
  console.log('   Status:', response1.status);
  console.log('   Count:', data1.length);
  console.log('   Data:', JSON.stringify(data1, null, 2));
  console.log('');

  // Test 2: Search by name
  console.log('2. GET /api/members?search=ahmad');
  const response2 = await fetch(`${API_BASE}/api/members?search=ahmad`);
  const data2 = await response2.json();
  console.log('   Status:', response2.status);
  console.log('   Count:', data2.length);
  console.log('   Data:', JSON.stringify(data2, null, 2));
  console.log('');

  // Test 3: Filter by IPNU
  console.log('3. GET /api/members?organisasi=IPNU');
  const response3 = await fetch(`${API_BASE}/api/members?organisasi=IPNU`);
  const data3 = await response3.json();
  console.log('   Status:', response3.status);
  console.log('   Count:', data3.length);
  console.log('   Data:', JSON.stringify(data3, null, 2));
  console.log('');

  // Test 4: Filter by IPPNU
  console.log('4. GET /api/members?organisasi=IPPNU');
  const response4 = await fetch(`${API_BASE}/api/members?organisasi=IPPNU`);
  const data4 = await response4.json();
  console.log('   Status:', response4.status);
  console.log('   Count:', data4.length);
  console.log('   Data:', JSON.stringify(data4, null, 2));
  console.log('');

  // Test 5: Combined search and filter
  console.log('5. GET /api/members?search=fina&organisasi=IPPNU');
  const response5 = await fetch(`${API_BASE}/api/members?search=fina&organisasi=IPPNU`);
  const data5 = await response5.json();
  console.log('   Status:', response5.status);
  console.log('   Count:', data5.length);
  console.log('   Data:', JSON.stringify(data5, null, 2));
}

testMembersAPI().catch(console.error);