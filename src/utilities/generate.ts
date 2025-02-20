import { randomBytes } from "crypto";

export class GeneratorUtils {
  static generateOTP(length: number = 6): string {
    const digits = "0123456789";
    const randomBytesArray = randomBytes(length);

    let otp = "";

    for (let i = 0; i < length; i++) otp += digits[randomBytesArray[i] % 10];

    return otp;
  }
}
