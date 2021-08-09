/* eslint-disable no-new */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-plusplus */
/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import faker from 'faker';
import Randexp from 'randexp';
import { addDays } from 'date-fns';

import config from '../src/config';

const legumes = [
  'abóbora',
  'abobrinha',
  'alcachofra',
  'aspargos',
  'batata-doce',
  'berinjela',
  'beterraba',
  'cenoura',
  'cogumelo',
  'ervilha',
  'fava',
  'inhame',
  'pepino',
  'pimentão',
  'rabanete',
  'tomate',
  'tomate-caqui',
  'alho-poró',
  'almeirão',
  'brócolis',
  'catalonha',
  'cebolinha',
  'chicória',
  'coentro',
  'couve-flor',
  'erva-doce',
  'espinafre',
  'folha de uva',
  'hortelã',
  'mostarda',
  'orégano',
  'almeirão',
  'cebolinha',
  'endívias',
  'erva-doce',
  'folha de uva',
  'hortelã',
  'orégano',
  'rúcula',
  'salsa',
  'salsão',
];

class GenerateSeeders {
  private api = axios.create({ baseURL: 'http://localhost:3333/api' });

  private arrayProducts: any[] = [];

  private arrayPoints: any[] = [];

  private arrayList: any[] = [];

  private arrayOrders: any[] = [];

  private fakeNumberPhone = new Randexp(
    /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/,
  );

  constructor() {
    this.init();
  }

  public async init(): Promise<void> {
    const token = await this.getToken();

    this.api.defaults.headers.authorization = `Bearer ${token}`;

    await this.createUsers();
    await this.createProducts();
    await this.createDeliveryPoints();
    await this.createLists();
    await this.createOrders();
  }

  public async getToken(): Promise<string> {
    const { data } = await this.api.post('/sessions', {
      email: 'admin@admin.com',
      password: 'admin',
    });

    return data.token;
  }

  public async createUsers(): Promise<void> {
    const promises: Promise<any>[] = [];
    let i = 0;
    while (i < 100) {
      const data = {
        name: faker.name.firstName(),
        email: faker.internet.email(),
        phone: this.fakeNumberPhone.gen(),
        password: faker.internet.password(),
        cpf: faker.internet.ip(),
        cnpj: faker.internet.ip(),
        role: 'b',
      };

      promises.push(this.api.post('/users', data));
      i++;
    }
    await Promise.all(promises);
  }

  public async createProducts(): Promise<void> {
    const promises: Promise<any>[] = [];

    let i = 0;

    while (i < legumes.length) {
      const name = legumes[i];

      const data = {
        name,
        cost_price: faker.datatype.number(4),
        sale_price: faker.datatype.number(4),
        category: 'Legumes',
        unit_buy: 'kg',
        unit_sale: 'kg',
        fraction_buy: 1,
        fraction_sale: 1,
        wholesale_price: faker.datatype.number(4),
        observation: faker.lorem.word(4),
        organic: faker.datatype.boolean(),
        highlights: faker.datatype.boolean(),
        nutritional_information: faker.lorem.words(4),
      };

      promises.push(this.api.post('/products', data));
      i++;
    }
    this.arrayProducts = (await Promise.all(promises)).map(
      promise => promise.data,
    );
  }

  public async createDeliveryPoints(): Promise<void> {
    const promises: Promise<any>[] = [];

    let i = 0;

    while (i < 10) {
      const data = {
        city: faker.lorem.word(4),
        state: 'PR',
        suburb: faker.lorem.word(8),
        street: faker.lorem.word(9),
        cep: 85501030,
        number: 0,
        latitude: -26.227067,
        longitude: -52.672246,
      };

      promises.push(this.api.post('/delivery-points', data));
      i++;
    }
    this.arrayPoints = (await Promise.all(promises)).map(
      promise => promise.data,
    );
  }

  public async createLists(): Promise<void> {
    const promises: Promise<any>[] = [];

    let i = 0;

    const date = new Date();
    while (i < 10) {
      const data = {
        start_date: addDays(date, i * 15 - 1),
        end_date: addDays(date, i * 15 + 15 - 1),
        status: 'created',
        type: 'offer',
        details:
          // eslint-disable-next-line no-loop-func
          this.arrayProducts.map(p => {
            const quantity = faker.datatype.number(500);
            return {
              product_id: p.id,
              unit_price: 1,
              quantity_total: quantity,
              quantity_stock: quantity,
              sale_price: '2',
            };
          }),
      };

      promises.push(this.api.post('/lists', data));
      i++;
    }
    this.arrayList = (await Promise.all(promises)).map(
      promise => promise.data.list,
    );
  }

  public async createOrders(): Promise<void> {
    const promises: Promise<any>[] = [];

    let i = 0;
    let j = 0;

    while (i < this.arrayList.length) {
      while (j < 5) {
        const data = {
          list_id: this.arrayList[i].id,
          delivery_point_id: this.arrayPoints[0].id,
          final_value: 45,
          payment_status: 'processing',
          payment_type: 'credit_card',
          sales_type: 'wholesale',
          value: 456,
          details: this.arrayProducts.map(p => {
            return {
              product_id: p.id,
              quantity: 1,
              discount: 0,
            };
          }),
        };

        promises.push(this.api.post('/orders', data));
        j++;
      }
      i++;
    }
    this.arrayOrders = (await Promise.all(promises)).map(
      promise => promise.data,
    );
  }
}

new GenerateSeeders();
