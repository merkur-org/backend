import { container } from 'tsyringe';

import { Request, Response } from 'express';
import UpdateImageProductService from '@modules/products/services/UpdateImageProductService';
import { classToClass } from 'class-transformer';

class ProductsController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { product_id } = request.params;

    const image_name = request.file.filename;

    const updateImageProduct = container.resolve(UpdateImageProductService);

    const product = await updateImageProduct.execute({
      product_id,
      image_name,
    });

    return response.json(classToClass(product));
  }
}

export default ProductsController;
