import express from 'express';
import { StatusCodes } from 'http-status-codes';
import request from 'supertest';
import { DataSource } from 'typeorm';

import container from '@/config/container';
import TYPES from '@/config/types';
import { User } from '@/entities/User';
import userRoutes from '@/routes/userRoutes';

const URL_API = '/api/users';

const app = express();
app.use(express.json());
app.use('/api', userRoutes);

describe('UserController', () => {
  let db: DataSource;

  beforeAll(async () => {
    db = container.get<DataSource>(TYPES.DB);
    await db.initialize();
  });

  afterAll(async () => {
    if (db && db.isInitialized) {
      await db.destroy();
    }
  });

  beforeEach(async () => {
    const userRepository = db.getRepository(User);
    await userRepository.clear();
  });

  it('should create a new user', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'admin',
    };

    const response = await request(app).post(URL_API).send(newUser);

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.body).toMatchObject({
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'admin',
    });
  });

  it('should return a user by id', async () => {
    const newUser = {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      password: 'password123',
      role: 'cliente',
    };

    const createResponse = await request(app).post(URL_API).send(newUser);
    const userId = createResponse.body.id;

    const response = await request(app).get(`${URL_API}/${userId}`);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toMatchObject({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      role: 'cliente',
    });
  });

  it('should update a user', async () => {
    const newUser = {
      name: 'John Smith',
      email: 'john.smith@example.com',
      password: 'password123',
      role: 'admin',
    };

    const createResponse = await request(app).post(URL_API).send(newUser);
    const userId = createResponse.body.id;

    const updatedUser = {
      name: 'John Smith Updated',
      email: 'john.smith.updated@example.com',
      password: 'password123',
      role: 'admin',
    };

    const response = await request(app)
      .put(`${URL_API}/${userId}`)
      .send(updatedUser);

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toMatchObject({
      name: 'John Smith Updated',
      email: 'john.smith.updated@example.com',
      role: 'admin',
    });
  });

  it('should delete a user', async () => {
    const newUser = {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: 'password123',
      role: 'cliente',
    };

    const createResponse = await request(app).post(URL_API).send(newUser);
    const userId = createResponse.body.id;

    const response = await request(app).delete(`${URL_API}/${userId}`);

    expect(response.status).toBe(StatusCodes.NO_CONTENT);
  });

  it('should return a list of users filtered by name, email, and roles', async () => {
    const user1 = {
      name: 'Alice',
      email: 'alice@example.com',
      password: 'password123',
      role: 'admin',
    };

    const user2 = {
      name: 'Bob',
      email: 'bob@example.com',
      password: 'password123',
      role: 'cliente',
    };

    const user3 = {
      name: 'Charlie',
      email: 'charlie@example.com',
      password: 'password123',
      role: 'admin',
    };

    await request(app).post(URL_API).send(user1);
    await request(app).post(URL_API).send(user2);
    await request(app).post(URL_API).send(user3);

    const response = await request(app)
      .get(URL_API)
      .query({
        name: 'Alice',
        email: 'alice@example.com',
        role: ['admin'],
      });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toMatchObject({
      name: 'Alice',
      email: 'alice@example.com',
      role: 'admin',
    });
  });
});
