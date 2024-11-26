import { Router } from 'express';

import container from '@/config/container';
import TYPES from '@/config/types';
import UserController from '@/controllers/UserController';

const userRoutes = Router();
const userController = container.get<UserController>(TYPES.UserController);

userRoutes.get('/users', async (req, res) => {
  await userController.findAll(req, res);
});

userRoutes.get('/users/:id', async (req, res) => {
  await userController.findById(req, res);
});

userRoutes.post('/users', async (req, res) => {
  await userController.create(req, res);
});

userRoutes.put('/users/:id', async (req, res) => {
  await userController.update(req, res);
});

userRoutes.delete('/users/:id', async (req, res) => {
  await userController.delete(req, res);
});

export default userRoutes;
