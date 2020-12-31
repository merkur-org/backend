import { Router } from 'express';

import DeliveryPointsController from '../controllers/DeliveryPointsController';

const deliveryPointsRoutes = Router();

const deliveryPointsController = new DeliveryPointsController();

deliveryPointsRoutes.post('/', deliveryPointsController.create);

export default deliveryPointsRoutes;
