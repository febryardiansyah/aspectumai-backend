import { DataSource } from "typeorm";
import moment from "moment";

import { GLOBAL_OTP_CONFIG } from "@global/config/otp";
import { GeneratorUtils } from "@utilities/generate";
import { ErrorHandler } from "@config/http";
import UserEmailVerificationRepository from "@app/repositories/user-email-verification.repo";
import AppDataSource from "@config/datasource";
import UserEmailVerificationEntity from "@entities/UserEmailVerification.entity";

export default class AuthSignupService {
  constructor(
    private readonly dataSource: DataSource = AppDataSource,
    private readonly userEmailVerificationRepo: UserEmailVerificationRepository = new UserEmailVerificationRepository()
  ) {}

  async verifyEmail(email: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.dataSource.manager.transaction(async manager => {
        const verificationExist =
          await this.userEmailVerificationRepo.findByEmailAndType(
            manager,
            email,
            "SIGNUP"
          );

        const otp = GeneratorUtils.generateOTP();
        const now = moment();

        this.validateOtpAttemps(verificationExist, now);

        if (verificationExist)
          await this.userEmailVerificationRepo.updateOtp(
            manager,
            email,
            verificationExist.type,
            otp
          );
        else
          await this.userEmailVerificationRepo.createOtp(
            manager,
            email,
            "SIGNUP",
            otp
          );
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private calculateDelay(attemptCount: number): number {
    if (attemptCount <= 2)
      return attemptCount * GLOBAL_OTP_CONFIG.RATE_LIMIT.DELAY_STRATEGY.INITIAL;

    return (
      (attemptCount - 2) *
      GLOBAL_OTP_CONFIG.RATE_LIMIT.DELAY_STRATEGY.MULTIPLIER
    );
  }
  private validateOtpAttemps(
    verificationExist: UserEmailVerificationEntity | null,
    currentTime: moment.Moment
  ): void {
    if (!verificationExist) return;

    const lastAttempt = moment(verificationExist.updated_at);
    const attemptCount = verificationExist.count + 1;

    if (attemptCount > GLOBAL_OTP_CONFIG.RATE_LIMIT.MAX_ATTEMPTS)
      throw new ErrorHandler(
        GLOBAL_OTP_CONFIG.MESSAGES.TOO_MANY_ATTEMPTS,
        null,
        429
      );

    const delayMinutes = this.calculateDelay(attemptCount);
    const nextAllowedTime = lastAttempt.add(delayMinutes, "minutes");

    if (currentTime.isBefore(nextAllowedTime)) {
      const remainingSeconds = nextAllowedTime.diff(currentTime, "second");

      throw new ErrorHandler(
        GLOBAL_OTP_CONFIG.MESSAGES.COOLDOWN,
        { retry_after: remainingSeconds },
        429
      );
    }
  }
}
