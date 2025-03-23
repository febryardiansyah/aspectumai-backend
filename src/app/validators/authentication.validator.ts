import { ValidationErrorMessages } from "@global/constant/validator.constant";
import { ValidationUtils } from "@utilities/validation";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthSignupEmailVerification {
  @IsNotEmpty({
    message: ValidationUtils.error("Email", ValidationErrorMessages.REQUIRED),
  })
  @IsString({
    message: ValidationUtils.error(
      "Email",
      ValidationErrorMessages.INVALID_FORMAT
    ),
  })
  @IsEmail(
    {},
    {
      message: ValidationUtils.error(
        "Email",
        ValidationErrorMessages.INVALID_EMAIL
      ),
    }
  )
  email: string;
}

export class AuthSignupVerification {
  @IsNotEmpty({
    message: ValidationUtils.error("Name", ValidationErrorMessages.REQUIRED),
  })
  name: string;

  @IsNotEmpty({
    message: ValidationUtils.error(
      "Username",
      ValidationErrorMessages.REQUIRED
    ),
  })
  username: string;

  @IsNotEmpty({
    message: ValidationUtils.error("Email", ValidationErrorMessages.REQUIRED),
  })
  @IsEmail(
    {},
    {
      message: ValidationUtils.error(
        "Email",
        ValidationErrorMessages.INVALID_EMAIL
      ),
    }
  )
  email: string;

  @IsNotEmpty({
    message: ValidationUtils.error(
      "Password",
      ValidationErrorMessages.REQUIRED
    ),
  })
  @MinLength(6, {
    message: ValidationUtils.error(
      "Password",
      ValidationErrorMessages.MIN_LENGTH(6)
    ),
  })
  password: string;
}

export class AuthSigninVerification {
  @IsNotEmpty({
    message: ValidationUtils.error("Email", ValidationErrorMessages.REQUIRED),
  })
  @IsEmail(
    {},
    {
      message: ValidationUtils.error(
        "Email",
        ValidationErrorMessages.INVALID_EMAIL
      ),
    }
  )
  email: string;

  @IsNotEmpty({
    message: ValidationUtils.error(
      "Password",
      ValidationErrorMessages.REQUIRED
    ),
  })
  @MinLength(6, {
    message: ValidationUtils.error(
      "Password",
      ValidationErrorMessages.MIN_LENGTH(6)
    ),
  })
  password: string;
}

export class AuthVerifyOTPVerification {
  @IsNotEmpty({
    message: ValidationUtils.error("Email", ValidationErrorMessages.REQUIRED),
  })
  @IsEmail(
    {},
    {
      message: ValidationUtils.error(
        "Email",
        ValidationErrorMessages.INVALID_EMAIL
      ),
    }
  )
  email: string;

  @IsNotEmpty({
    message: ValidationUtils.error("OTP", ValidationErrorMessages.REQUIRED),
  })
  otp: string;
}

export class AuthResetPasswordVerification {
  @IsNotEmpty({
    message: ValidationUtils.error("Email", ValidationErrorMessages.REQUIRED),
  })
  @IsEmail(
    {},
    {
      message: ValidationUtils.error(
        "Email",
        ValidationErrorMessages.INVALID_EMAIL
      ),
    }
  )
  email: string;

  @IsNotEmpty({
    message: ValidationUtils.error("OTP", ValidationErrorMessages.REQUIRED),
  })
  otp: string;

  @IsNotEmpty({
    message: ValidationUtils.error(
      "Password",
      ValidationErrorMessages.REQUIRED
    ),
  })
  @MinLength(6, {
    message: ValidationUtils.error(
      "Password",
      ValidationErrorMessages.MIN_LENGTH(6)
    ),
  })
  password: string;
}
