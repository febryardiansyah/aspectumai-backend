import { ErrorHandler, HttpResponse } from "@config/http";
import { HTTPCode } from "@global/constant/http.constant";
import { plainToClass, plainToInstance } from "class-transformer";
import { ValidationError, ValidatorOptions, validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import {
  Schema,
  ValidationResult,
  ValidationError as JoiValidationError,
} from "joi";

type TClassConstructor<T> = {
  new (): T;
};

type TErrorResponse = {
  field: string;
  message: string;
};

export type TQueryValidatorOptions = {
  throwError?: boolean;
};

export class ValidationMiddleware {
  private static formatQueryErrors(
    errors: JoiValidationError
  ): TErrorResponse[] {
    return errors.details.map(error => {
      const { context, message } = error;

      return {
        field: context.key,
        message: message.replace(
          /"(\w+)"/,
          (match, p1) => p1.charAt(0).toUpperCase() + p1.slice(1)
        ),
      };
    });
  }

  static validateParamsId<T extends object>(
    type: TClassConstructor<T>,
    validatorOptions?: ValidatorOptions
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const validationObj = plainToInstance(type, {
        id: parseInt(req.params.id, 10),
      });
      const errors: ValidationError[] = await validate(
        validationObj,
        validatorOptions
      );
      console.log("Validation Errors:", validationObj);

      if (errors.length > 0) {
        HttpResponse.error(
          res,
          "Validation Error",
          ValidationMiddleware.formatBodyErrors(errors),
          HTTPCode.ValidationError
        );
      } else {
        req.params = validationObj as any;
        next();
      }
    };
  }

  static validateQuery<T>(
    query: unknown,
    schema: Schema,
    options: TQueryValidatorOptions = { throwError: true }
  ): T {
    const validationResult: ValidationResult<T> = schema.validate(query, {
      abortEarly: false,
    });

    const { error, value: result }: { error: JoiValidationError; value: T } =
      validationResult;

    if (options.throwError && error) {
      throw new ErrorHandler(
        "Validation Error",
        ValidationMiddleware.formatQueryErrors(error),
        HTTPCode.ValidationError
      );
    }

    return result;
  }

  static validateBody<T extends object>(
    type: TClassConstructor<T>,
    validatorOptions?: ValidatorOptions
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const validationObj = plainToClass(type, req.body);
      const errors: ValidationError[] = await validate(
        validationObj,
        validatorOptions
      );

      if (errors.length > 0) {
        HttpResponse.error(
          res,
          "Validation Error",
          ValidationMiddleware.formatBodyErrors(errors),
          HTTPCode.ValidationError
        );
      } else {
        req.body = validationObj;
        next();
      }
    };
  }

  private static formatBodyErrors(errors: ValidationError[]): TErrorResponse[] {
    return errors.map(error => {
      const { property: field, constraints } = error;

      const message: string = constraints[Object.keys(constraints).pop()];

      return { field, message };
    });
  }
}
