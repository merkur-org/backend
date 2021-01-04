import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IRole } from '@modules/users/dtos/ICreateUserDTO';

import CreateDeliveryPointService from '@modules/delivery-points/services/CreateDeliveryPointService';
import ListDeliveryPointsService from '@modules/delivery-points/services/ListDeliveryPointsService';
import ShowDeliveryPointService from '@modules/delivery-points/services/ShowDeliveryPointService';
import UpdateDeliveryPointService from '@modules/delivery-points/services/UpdateDeliveryPointService';
import DeleteDeliveryPointService from '@modules/delivery-points/services/DeleteDeliveryPointService';
import IndexDeliveryPointsService from '@modules/delivery-points/services/ListDeliveryPointsService';
import { number } from '@hapi/joi';

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

  public async list(request: Request, response: Response): Promise<Response> {
    const { state, page = 1, limit = 10 } = request.query;

    const listDeliveryPoints = container.resolve(ListDeliveryPointsService);

    const data = await listDeliveryPoints.execute(
      {
        point_state: String(state),
      },
      {
        page: Number(page),
        limit: Number(limit),
      },
    );

    return response.json(data);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { point_id } = request.params;

    const showDeliveryPoint = container.resolve(ShowDeliveryPointService);

    const point = await showDeliveryPoint.execute({ point_id });

    return response.json(point);
  }

  public async update(request: Request, response: Response) {
    const { point_id } = request.params;

    const {
      city,
      state,
      suburb,
      street,
      cep,
      number,
      latitude,
      longitude,
    } = request.body;

    const updateDeliveryPoint = container.resolve(UpdateDeliveryPointService);

    const point = await updateDeliveryPoint.execute({
      point_id,
      city,
      state,
      suburb,
      street,
      cep,
      number,
      latitude,
      longitude,
    });

    return response.json(point);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { point_id } = request.params;

    const deleteDeliveryPoint = container.resolve(DeleteDeliveryPointService);

    const point = await deleteDeliveryPoint.execute({ point_id });

    return response.json({ point });
  }
}

export default DeliveryPointsController;
