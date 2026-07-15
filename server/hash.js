import bcrypt from 'bcryptjs';

const password = 'ipnuippnu123';
const hash = bcrypt.hashSync(password, 10);
console.log('Hash untuk password ipnuippnu123:');
console.log(hash);
