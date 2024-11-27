import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { formatErrors } from '@/common/formatErrors';
import { handleError } from '@/common/handleError';
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

  constructor(@inject(TYPES.IService) userService: IService<User>) {
    this.userService = userService;
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const { error, value: filters } = userFilterSchema.validate(req.query, {
      stripUnknown: true,
      abortEarly: false,
    });

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(formatErrors(error));
    }

    try {
      const users = await this.userService.findAll(filters);
      return res.json(users);
    } catch (error: unknown) {
      console.error('francys: ', error);

      return handleError(res, error);
    }
  }

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
      return res.status(StatusCodes.CREATED).json(newUser);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  }

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
      return res.json(updatedUser);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { error, value } = idSchema.validate(req.params);

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(formatErrors(error));
    }
    try {
      await this.userService.delete(Number(value.id));
      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: unknown) {
      return handleError(res, error);
    }
  }
}
