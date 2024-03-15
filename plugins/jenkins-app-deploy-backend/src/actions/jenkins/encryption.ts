import {createCipheriv} from 'crypto';

const ALGORITHM = 'aes-256-cbc'; // Using AES encryption
export interface EncryptionSecret {
  iv: string;
  encryptedData: string;
}

export function encryptSecret(key: Buffer, iv: Buffer, secret: string):EncryptionSecret{
  const cipher = createCipheriv(
      ALGORITHM,
      Buffer.from(key),
      iv,
  );
  let encrypted = cipher.update(secret);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted.toString('hex'),
  };
}
