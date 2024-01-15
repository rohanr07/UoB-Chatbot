import CryptoJS from 'crypto-js';

if (!process.env.CHAT_SECURE_KEY) {
  throw new Error('The CHAT_SECURE_KEY environment variable is not defined');
}

const CHAT_SECURE_KEY = process.env.CHAT_SECURE_KEY;


export const encryptMessage = (message: string): string => {
  const ciphertext = CryptoJS.AES.encrypt(message, CHAT_SECURE_KEY).toString();
  return ciphertext;
};


export const decryptMessage = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, CHAT_SECURE_KEY);
  const decryptedMessage = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedMessage;
};