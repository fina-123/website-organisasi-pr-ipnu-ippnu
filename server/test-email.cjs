const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const email = require('./email.cjs');

async function testEmail() {
  console.log('Testing email...');
  console.log('EMAIL_USER:', process.env.EMAIL_USER);
  
  const result = await email.sendEmail({
    to: process.env.EMAIL_USER,
    subject: '🧪 Test Email IPNU IPPNU',
    html: '<h1>Test Berhasil!</h1><p>Email notification sudah siap digunakan.</p>'
  });

  console.log('Hasil:', result);
}

testEmail();