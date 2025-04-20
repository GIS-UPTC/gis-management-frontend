import CryptoJS from 'crypto-js';

// Verificar que la clave secreta existe
const SECRET_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || '';

// Lanzar un error si la clave no está definida
if (!SECRET_KEY) {
  throw new Error('La clave de encriptación no está definida en las variables de entorno');
}

export const encryptPassword = (password: string) => {
  const iv = CryptoJS.lib.WordArray.random(16); // IV de 16 bytes
  const key = CryptoJS.enc.Base64.parse(SECRET_KEY);
  
  const encrypted = CryptoJS.AES.encrypt(password, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  
  return CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext));
};