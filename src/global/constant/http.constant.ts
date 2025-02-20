import Joi from "joi";

export enum HTTPCode {
  Success = 200,
  Created = 201,
  ClientError = 400,
  NotFound = 404,
  ValidationError = 422,
  ServerError = 500,
}

export enum HTTPMessage {
  ValidationError = "Validation Error",
  ServerError = "Internal Server Error",
}

export type TPaginationQuery = Partial<{
  page: number;
  limit: number;
  all: string;
}>;

export const paginationQuerySchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).default(10),
  all: Joi.string().optional(),
});
