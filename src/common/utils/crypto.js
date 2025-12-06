import CryptoJS from 'crypto-js';

const SECRET_KEY = import.meta.env.VITE_STORAGE_SECRET_KEY;

export const encryptData = (data) => {
    try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
    } catch (err) {
        console.error("Encrypt error", err);
        return null;
    }
};

export const decryptData = (encrypted) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encrypted, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
    } catch (err) {
        console.error("Decrypt error", err);
        return null;
    }
};

