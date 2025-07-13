import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsOptional,
} from "class-validator";

export class SendChatValidation {
  @IsNotEmpty({
    message: "sessionId must not be empty",
  })
  sessionId: string;

  @IsArray({
    message: "Messages must be an array",
  })
  @ArrayNotEmpty({
    message: "Messages cannot be empty",
  })
  messages: Array<{
    role: string;
    content: string;
  }>;

  @IsOptional()
  model?: string;
}
