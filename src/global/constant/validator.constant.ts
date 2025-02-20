export class ValidationErrorMessages {
  static readonly EMPTY = "$property cannot be empty";
  static readonly INVALID_FORMAT = "The format of $property is invalid";
  static readonly INVALID_EMAIL =
    "Please enter a valid email address with '@' and '.'";
  static readonly INVALID_OTP = "The OTP code you entered is invalid";
  static readonly EXPIRED_OTP = "The OTP code you entered has expired";
  static readonly REQUIRED = "$property is required";
  static readonly NUMBER = "$property must be a number";
  static readonly PHONE_NUMBER = "$property must be a valid phone number";
  static readonly UNIQUE = "$property is already in use";
  static FILE_TOO_LARGE(limitSize: number): string {
    return `The file is too large. Please upload a file smaller than ${limitSize}MB.`;
  }
}
