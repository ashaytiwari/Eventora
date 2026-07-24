import jwt from "jsonwebtoken";

export function generateToken(tokenData: object, expiresAt: number | string) {

  const secret = process.env.AUTH_SECRET;
  const token = jwt.sign(tokenData, secret!, { expiresIn: expiresAt as any });

  return token;

}
