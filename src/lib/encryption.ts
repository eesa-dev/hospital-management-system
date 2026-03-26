import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.AUTH_SECRET || "default_secret_key_hms_123";

export const encryptPassword = (password: string): string => {
  return CryptoJS.AES.encrypt(password, SECRET_KEY).toString();
};

export const decryptPassword = (ciphertext: string): string => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};
