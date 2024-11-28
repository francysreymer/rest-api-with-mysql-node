import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { formatErrors } from '@/common/formatErrors';
import { handleError } from '@/common/handleError';
import redisClient from '@/config/redisClient';
import TYPES from '@/config/types';
import IService from '@/contracts/IService';
import { User } from '@/entities/User';
import { idSchema } from '@/validators/idSchema';
import { userFilterSchema } from '@/validators/userFilterSchema';
import { userSchema } from '@/validators/userSchema';
import { userUpdateSchema } from '@/validators/userUpdateSchema';

@injectable()
export default class UserController {
  private userService: IService<User>;
  private EXPIRES_IN_1_HOUR = 3600;

  constructor(@inject(TYPES.IService) userService: IService<User>) {
    this.userService = userService;
  }

  /**
   * Find all users with optional filters.
   * @param req - Express request object.
   * @param res - Express response object.
   * @returns Express response object.
   * @throws Error if an unexpected error occurs.
   * @throws Error if an invalid query parameter is provided.
   **/
  async findAll(req: Request, res: Response): Promise<Response> {
    const { error, value: filters } = userFilterSchema.validate(req.query, {
      stripUnknown: true,
      abortEarly: false,
    });

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(formatErrors(error));
    }

    const cacheKey = JSON.stringify(filters);
    try {
      // Check if the data is in the cache
      const cachedUsers = await redisClient.get(cacheKey);
      if (cachedUsers) {
        return res.json(JSON.parse(cachedUsers));
      }

      // If not in cache, fetch from the database
      const users = await this.userService.findAll(filters);

      // Store the result in the cache
      await redisClient.set(cacheKey, JSON.stringify(users), {
        EX: this.EXPIRES_IN_1_HOUR,
      });

      return res.json(users);
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      return handleError(res, error);
    }
  }

  /**
   * Find a user by id.
   * @param req - Express request object.
   * @param res - Express response object.
   * @returns Express response object.
   * @throws Error if an invalid id is provided.
   * @throws Error if user not found.
   * @throws Error if an unexpected error occurs.
   */
  async findById(req: Request, res: Response): Promise<Response> {
    const { error, value } = idSchema.validate(req.params);

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(formatErrors(error));
    }

    try {
      const user = await this.userService.findById(Number(value.id));
      return res.json(user);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  }

  /**
   * Create a new user.
   * @param req - Express request object.
   * @param res - Express response object.
   * @returns Express response object.
   * @throws Error if an invalid user object is provided.
   * @throws Error if an unexpected error occurs.
   */
  async create(req: Request, res: Response): Promise<Response> {
    const { error, value } = userSchema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(formatErrors(error));
    }

    try {
      const newUser = await this.userService.create(value);

      // Invalidate the cache
      await redisClient.flushAll();

      return res.status(StatusCodes.CREATED).json(newUser);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  }

  /**
   * Update a user by id.
   * @param req - Express request object.
   * @param res - Express response object.
   * @returns Express response object.
   * @throws Error if an invalid id is provided.
   * @throws Error if an invalid user object is provided.
   * @throws Error if user not found.
   * @throws Error if an unexpected error occurs.
   */
  async update(req: Request, res: Response): Promise<Response> {
    const { error: idError, value: idValue } = idSchema.validate(req.params, {
      stripUnknown: true,
      abortEarly: false,
    });

    if (idError) {
      return res.status(StatusCodes.BAD_REQUEST).json(formatErrors(idError));
    }

    const { error: bodyError, value: bodyValue } = userUpdateSchema.validate(
      req.body,
    );

    if (bodyError) {
      return res.status(StatusCodes.BAD_REQUEST).json(formatErrors(bodyError));
    }

    try {
      const updatedUser = await this.userService.update(
        bodyValue,
        Number(idValue.id),
      );

      // Invalidate the cache
      await redisClient.flushAll();

      return res.json(updatedUser);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  }

  /**
   * Delete a user by id.
   * @param req - Express request object.
   * @param res - Express response object.
   * @returns Express response object.
   * @throws Error if user not found.
   * @throws Error if an unexpected error occurs.
   */
  async delete(req: Request, res: Response): Promise<Response> {
    const { error, value } = idSchema.validate(req.params);

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(formatErrors(error));
    }
    try {
      await this.userService.delete(Number(value.id));

      // Invalidate the cache
      await redisClient.flushAll();

      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: unknown) {
      return handleError(res, error);
    }
  }
}
