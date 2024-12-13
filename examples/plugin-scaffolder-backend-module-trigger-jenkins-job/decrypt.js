// Usage: node decrypt.js <key> <iv>-<encryptedData>
// Set this to false when running from a script
const DEBUG = false;

function log(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

log('Decrypting...');
if (process.argv.length < 4) {
  log('Usage: node decrypt.js <key> <iv>-<encryptedData>');
  process.exit(1);
}
const keyString = process.argv[2];
log('Key:', keyString);
const dataString = process.argv[3];
log('Data:', dataString);
const ivString = dataString.split('-')[0];
const encryptedDataString = dataString.split('-')[1];
if (!ivString || !encryptedDataString) {
  log('Wrong format for data (use <iv>-<encryptedData>)');
  process.exit(1);
}

//Checking the crypto module
const crypto = require('crypto');
const ALGORITHM = 'aes-256-cbc'; //Using AES encryption

const key = Buffer.from(keyString, 'hex');
const iv = crypto.randomBytes(16);

//Encrypting text
function encrypt(text) {
  let cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

// Decrypting text
function decrypt(text) {
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Text send to encrypt function
console.log(decrypt({ iv: ivString, encryptedData: encryptedDataString }));
