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