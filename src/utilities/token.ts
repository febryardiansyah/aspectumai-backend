import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "@global/constant/database.constant";

export default class TokenUtils {
  static generateToken(email: string) {
    const token = jwt.sign({ email }, JWT_SECRET);

    return token;
  }

  static verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
