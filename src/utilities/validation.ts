import { readFileSync } from "fs";

export class ValidationUtils {
  static replace(path: string, replace: { key: string; value: string }) {
    const template = readFileSync(path, "utf8");
    const { key, value } = replace;

    return template.replace(key, value);
  }

  static error(field: string, message: string) {
    return message.replace("$property", field);
  }
}
