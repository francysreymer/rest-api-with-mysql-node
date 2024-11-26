import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { handleError } from '@/common/handleError';
import TYPES from '@/config/types';
import IUserService from '@/contracts/IUserService';
import { idSchema } from '@/validators/idSchema';
import { userFilterSchema } from '@/validators/userFilterSchema';
import { userSchema } from '@/validators/userSchema';

@injectable()
export default class UserController {
  private userService: IUserService;

  constructor(@inject(TYPES.IUserService) userService: IUserService) {
    this.userService = userService;
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const { error, value: filters } = userFilterSchema.validate(req.query, {
      stripUnknown: true,
    });

    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.details[0].message });
    }

    try {
      const users = await this.userService.findAll(filters);
      return res.json(users);
    } catch (error: unknown) {
      return handleError(res, error);
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const { error, value } = idSchema.validate(req.params);

    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.details[0].message });
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
    });

    if (error) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.details[0].message });
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
    });

    if (idError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: idError.details[0].message });
    }

    const { error: bodyError, value: bodyValue } = userSchema.validate(
      req.body,
    );

    if (bodyError) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: bodyError.details[0].message });
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
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: error.details[0].message });
    }
    try {
      await this.userService.delete(Number(value.id));
      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (error: unknown) {
      return handleError(res, error);
    }
  }
}
