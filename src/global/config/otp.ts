import { TUserEmailVerificationType } from "@app/types/user-email-verification";

export type TGlobalOtpConfig = {
  EXPIRATION: {
    VERIFICATION: number;
    RESET_PASSWORD: number;
  };
  RATE_LIMIT: {
    MAX_ATTEMPTS: number;
    DELAY_STRATEGY: {
      INITIAL: number;
      MULTIPLIER: number;
    };
  };
  OTP_LENGTH: number;
  MESSAGES: {
    TOO_MANY_ATTEMPTS: string;
    INVALID_TYPE: string;
    COOLDOWN: string;
  };
};

export const GLOBAL_OTP_CONFIG = {
  EXPIRATION: {
    VERIFICATION: 5 * 60,
    RESET_PASSWORD: 15 * 60,
  },

  RATE_LIMIT: {
    MAX_ATTEMPTS: 5,
    DELAY_STRATEGY: {
      INITIAL: 1,
      MULTIPLIER: 5,
    },
  },

  OTP_LENGTH: 6,

  MESSAGES: {
    TOO_MANY_ATTEMPTS:
      "OTP attempt limit reached for today. Please try again tomorrow",
    INVALID_TYPE: "Invalid OTP type",
    COOLDOWN: "Too many attempts. Please wait before resending OTP",
  },
};
