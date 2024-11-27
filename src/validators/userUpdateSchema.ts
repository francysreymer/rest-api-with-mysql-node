import Joi from 'joi';

export const userUpdateSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().optional(),
  role: Joi.string().valid('admin', 'cliente').optional(),
});
