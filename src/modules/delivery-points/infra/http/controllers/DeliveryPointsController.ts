import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateDeliveryPointService from '@modules/delivery-points/services/CreateDeliveryPointService';

class DeliveryPointsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      cep,
      city,
      latitude,
      longitude,
      number,
      state,
      street,
      suburb,
    } = request.body;

    // const { role } = request.user;

    const createDeliveryPoint = container.resolve(CreateDeliveryPointService);

    const point = await createDeliveryPoint.execute({
      cep,
      city,
      latitude,
      longitude,
      number,
      state,
      street,
      suburb,
      userRole: 'r',
    });

    return response.json({ deliveryPoint: point });
  }
}

export default DeliveryPointsController;
