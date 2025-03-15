import { DataSource } from "typeorm";
import moment from "moment";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

import { GLOBAL_OTP_CONFIG } from "@global/config/otp";
import { GeneratorUtils } from "@utilities/generate";
import { ErrorHandler } from "@config/http";
import UserEmailVerificationRepository from "@app/repositories/user-email-verification.repo";
import AppDataSource from "@config/datasource";
import UserEmailVerificationEntity from "@entities/UserEmailVerification.entity";
import UserEntity from "@entities/User.entity";
import AuthRepository from "@app/repositories/auth.repo";
import { JWT_SECRET } from "@global/constant/database.constant";

export default class AuthService {
  constructor(
    private readonly dataSource: DataSource = AppDataSource,
    private readonly userEmailVerificationRepo: UserEmailVerificationRepository = new UserEmailVerificationRepository(),
    private readonly authRepository: AuthRepository = new AuthRepository()
  ) {}

  // verifyEmail is a method that sends an OTP to the user's email.
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

  // signup is a method that creates a new user.
  async signup(
    name: string,
    username: string,
    email: string,
    password: string
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.dataSource.manager.transaction(async manager => {
        const userByEmail = await this.authRepository.findByEmail(
          manager,
          email
        );
        if (userByEmail) throw "User already exist!";

        const userByUsername = await this.authRepository.findByUsername(
          manager,
          username
        );
        if (userByUsername) throw "Username already exist!";

        const user = new UserEntity();
        const hashedPassword = await bcrypt.hash(password, 10);

        user.name = name;
        user.username = username;
        user.email = email;
        user.password = hashedPassword;

        await this.authRepository.createUser(manager, user);

        await this.verifyEmail(email);
      });

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async signin(email: string, password: string): Promise<UserEntity> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.dataSource.manager.transaction(async manager => {
        const user = await this.authRepository.findByEmail(manager, email);

        if (!user) throw "User not found!";

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) throw "Invalid password!";

        if (!user.isEmailVerified) throw "Email is not verified!";

        return user;
      });

      await queryRunner.commitTransaction();

      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  generateToken(email: string) {
    const token = jwt.sign({ email: email }, JWT_SECRET);

    return token;
  }

  async verifyOTP(email: string, otp: string): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.dataSource.manager.transaction(async manager => {
        const user = await this.authRepository.findByEmail(manager, email);
        if (user.isEmailVerified) throw "Email is already verified!";

        const verificationExist =
          await this.userEmailVerificationRepo.findByEmailAndType(
            manager,
            email,
            "SIGNUP"
          );

        if (!verificationExist) throw "OTP not found!";

        if (verificationExist.otp !== otp) throw "Invalid OTP!";

        await this.authRepository.updateUserVerification(manager, email);
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
