import bcrypt from "bcryptjs";
import CryptoJS from "crypto-js";

export async function hashPassword(value: string, saltRounds: number = 12) {
  return bcrypt.hash(value, saltRounds);
}

export async function comparePassword(value: string, hash: string) {
  return bcrypt.compare(value, hash);
}

export function sha256Hash(value: any) {
  return CryptoJS.SHA256(JSON.stringify(value)).toString(CryptoJS.enc.Hex);
}

export function generateRandomString(length: number = 6) {
  return CryptoJS.lib.WordArray.random(Math.ceil(length / 2))
    .toString(CryptoJS.enc.Hex)
    .slice(0, length);
}