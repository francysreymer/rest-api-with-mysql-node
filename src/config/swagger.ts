import swaggerJsdoc from 'swagger-jsdoc';

import { userSchema } from '@/config/swagger-schemas/userSchema';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation for the application',
    },
    components: {
      schemas: {
        User: userSchema,
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

const swaggerDocs = swaggerJsdoc(options);

export default swaggerDocs;
