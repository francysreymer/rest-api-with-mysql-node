import Joi from 'joi';

export const userFilterSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  role: Joi.string()
    .optional()
    .custom((value) => {
      return value.split(',').map((role: string) => role.trim());
    }),
});
