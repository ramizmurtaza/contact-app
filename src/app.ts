import express from 'express';
import userRouter from './modules/users/user.routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger.js';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'API is running...' });
});

app.use('/users', userRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

export default app;