import CryptoJS from 'crypto-js';

const SECRET_KEY = "123456";

export const encryptData = (data) => {
    try {
        const stringData = JSON.stringify(data);
        return CryptoJS.AES.encrypt(stringData, SECRET_KEY).toString();
    } catch (error) {
        console.error("Encryption error:", error);
        return null;
    }
};

export const decryptData = (encryptedData) => {
    try {
        if (!encryptedData) return null;
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
    } catch (error) {
        console.error("Decryption error:", error);
        return null;
    }
};