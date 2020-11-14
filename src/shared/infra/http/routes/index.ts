import { Router } from 'express';

const routes = Router();

routes.get('/', (request, response) => {
  return response.json({ message: 'hellow world' });
});

export default routes;
