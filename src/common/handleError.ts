import { Response } from 'express';
import createError from 'http-errors';
import { StatusCodes } from 'http-status-codes';

/**
 * Handle errors and return a response with the appropriate status code.
 * @param res - Express response object.
 * @param error - Error object.
 * @returns Express response object.
 */
export const handleError = (res: Response, error: unknown): Response => {
  if (error instanceof createError.HttpError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    message:
      error instanceof Error ? error.message : 'An unexpected error occurred',
  });
};
