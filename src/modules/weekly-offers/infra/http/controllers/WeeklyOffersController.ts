import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateWeeklyOffersService from 'modules/weekly-offers/services/CreateWeeklyOffersService';
import ShowWeeklyOfferSerice from 'modules/weekly-offers/services/ShowWeeklyOffersService';
import DeleteWeeklyOfferService from 'modules/weekly-offers/services/DeleteWeeklyOffersService';
import ListWeeklyOffersService from 'modules/weekly-offers/services/ListWeeklyOffersService';
import UpdateWeeklyOfferService from 'modules/weekly-offers/services/UpdateWeeklyOffersService';

class WeeklyOfferController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { id: user_id } = request.user;
    const { start_date, end_date, status, details } = request.body;

    const createWeeklyOffers = container.resolve(CreateWeeklyOffersService);

    const weeklyOffer = await createWeeklyOffers.execute({
      details,
      start_date,
      end_date,
      user_id,
      status,
    });

    return response.json(weeklyOffer);
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10 } = request.query;

    const ListWeeklyOffers = container.resolve(ListWeeklyOffersService);

    const data = await ListWeeklyOffers.execute({
      page: Number(page),
      limit: Number(limit),
    });

    return response.json(data);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { offer_id } = request.params;

    const showWeeklyOffers = container.resolve(ShowWeeklyOfferSerice);

    const weeklyOffer = await showWeeklyOffers.execute({ offer_id });

    return response.json(weeklyOffer);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { offer_id } = request.params;

    const deleteWeeklyOffers = container.resolve(DeleteWeeklyOfferService);

    const offer = await deleteWeeklyOffers.execute({ offer_id });

    return response.json({ offer });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { offer_id } = request.params;
    const { start_date, end_date, status, details } = request.body;

    const updateWeeklyOffers = container.resolve(UpdateWeeklyOfferService);

    const offer = await updateWeeklyOffers.execute({
      offer_id,
      start_date,
      end_date,
      status,
      details,
    });

    return response.json(offer);
  }
}

export default WeeklyOfferController;
