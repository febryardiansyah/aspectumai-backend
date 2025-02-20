import { ValidationErrorMessages } from "@global/constant/validator.constant";
import { ValidationUtils } from "@utilities/validation";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

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
