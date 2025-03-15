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
    message: ValidationUtils.error(
      "First name",
      ValidationErrorMessages.REQUIRED
    ),
  })
  first_name: string;

  @IsNotEmpty({
    message: ValidationUtils.error(
      "Last name",
      ValidationErrorMessages.REQUIRED
    ),
  })
  last_name: string;

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