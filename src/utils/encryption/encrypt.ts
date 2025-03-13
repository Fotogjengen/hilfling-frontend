//Encrypts and decrypts data
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_KEY||""; 

// '
// Encrypt function
export const encryptData = (data: string): string => {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

// Decrypt function
export const decryptData = (cipherText: string): string => {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);    
    return bytes.toString(CryptoJS.enc.Utf8);
};
