export const userSchema = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      example: 1,
    },
    name: {
      type: 'string',
      example: 'John Doe',
    },
    email: {
      type: 'string',
      example: 'john.doe@example.com',
    },
    password: {
      type: 'string',
      example: 'password123',
    },
    role: {
      type: 'string',
      enum: ['admin', 'cliente'],
      example: 'admin',
    },
    createdAt: {
      type: 'string',
      format: 'date-time',
      example: '2021-09-01T12:00:00Z',
    },
    updatedAt: {
      type: 'string',
      format: 'date-time',
      example: '2021-09-01T12:00:00Z',
    },
  },
};
