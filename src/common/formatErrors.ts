import { ValidationError } from 'joi';

export type ErrorDetails = {
  message: string;
  details: string[];
};

/**
 * Format the error message and details from a Joi validation error.
 * @param error - The Joi validation error.
 * @returns The error message and details.
 */
export const formatErrors = (error: ValidationError): ErrorDetails => {
  return {
    message: 'Validation error',
    details: error.details.map(({ message }) => message),
  };
};
