import { z } from 'zod';

/**
 * Base response schema for all API responses
 * @template T - The type of data returned in the response
 */
export const createBaseResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    message: z.string(),
    code: z.string(),
    data: dataSchema,
    success: z.boolean(),
    status: z.number(),
  });

/**
 * Base response schema with nullable data
 */
export const createBaseResponseNullableSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    message: z.string(),
    code: z.string(),
    data: dataSchema.nullable(),
    success: z.boolean(),
    status: z.number(),
  });

/**
 * Base response type
 */
export type BaseResponse<T> = {
  message: string;
  code: string;
  data: T;
  success: boolean;
  status: number;
};

/**
 * Base response with null data (for endpoints that don't return data)
 */
export type BaseResponseNull = BaseResponse<null>;
