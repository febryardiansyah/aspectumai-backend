import { DataSource } from "typeorm";
import moment from "moment";
import * as bcrypt from "bcryptjs";

import { GLOBAL_OTP_CONFIG } from "@global/config/otp";
import { GeneratorUtils } from "@utilities/generate";
import { ErrorHandler } from "@config/http";
import UserEmailVerificationRepository from "@app/repositories/user-email-verification.repo";
import AppDataSource from "@config/datasource";
import UserEmailVerificationEntity from "@entities/UserEmailVerification.entity";
import UserEntity from "@entities/User.entity";
import SignUpRepository from "@app/repositories/signup.repo";

export default class AuthSignupService {
  constructor(
    private readonly dataSource: DataSource = AppDataSource,
    private readonly userEmailVerificationRepo: UserEmailVerificationRepository = new UserEmailVerificationRepository(),
    private readonly signUpRepository: SignUpRepository = new SignUpRepository()
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

  async signup(
    first_name: string,
    last_name: string,
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.dataSource.manager.transaction(async manager => {
        const userByEmail = await this.signUpRepository.findByEmail(
          manager,
          email
        );
        if (userByEmail) throw "User already exist!";

        const userByUsername = await this.signUpRepository.findByUsername(
          manager,
          username
        );
        if (userByUsername) throw "Username already exist!";

        const user = new UserEntity();
        const hashedPassword = await bcrypt.hash(password, 10);

        user.first_name = first_name;
        user.last_name = last_name;
        user.username = username;
        user.email = email;
        user.password = hashedPassword;

        await this.signUpRepository.createUser(manager, user);
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
