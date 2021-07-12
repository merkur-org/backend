# PASSO A PASSO

## **Migrations**

Auxilia na criação da base de dados, com ela você evita de escrever scripts SQL e você faz por meio de frameworks (como por exemplo o typeORM).

```jsx
# Criando a Migration
docker exec -it api-server yarn typeorm migration:create -n NameMigration
- Serve para o typeORM criar a base da sua migration.
- Feito isso, edite a migration criada e depois execute o (# Rodar a Migration)

# Rodar a Migration
docker exec -it api-server yarn typeorm migration:run
- Vai "gravar" as configurações feitas no banco de dados

# Desfazer a ultima Migration
docker exec -it api-server yarn typeorm migration:revert
- Vai desfazer "deletar" a ultima migration que você rodou, isto é, vai deletar ela
do banco de dados.
```

Exemplo de uma Migration:

```jsx
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateUser1605228554307 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "unaccent";');

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'email',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'cpf',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'cnpj',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          {
            name: 'role',
            type: 'varchar',

            default: "'b'",
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.query(`INSERT INTO public.users
    (id, "name", email, phone, "password", cpf, cnpj, "role", created_at, updated_at)
    VALUES('836dbbb0-5af6-40bc-8b8f-c96b94609181', 'admin', 'admin@admin.com', '46999999999', '$2a$08$NQdYygarnEitwZG62.Kr7OSdy0nhgPlVE1qa.fC7xmTJ8uj4Q12ai', '111111', '', 'r'::character varying, now(), now());
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}

```

Para mais informações acesse a [docs](https://github.com/typeorm/typeorm/blob/master/docs/migrations.md) do TypeORM.

No projeto atual a pasta migrations fica em:

```jsx
$ src/shared/infra/typeorm/migrations
```

## Entities

Entity é uma classe que mapeia para uma tabela de banco de dados (ou coleção ao usar MongoDB). Isto é, nela você vai mapear as colunas que você utilizou no banco, as relações (1:1, 1:N, N:1 e N:N), e os tipos (se é string, date e etc.).

**OBS:** Todas as tabelas precisam ter sua entidade.

Exemplo de uma Entidade:

```jsx
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import Order from '@modules/orders/infra/typeorm/entities/Order';
import List from '@modules/lists/infra/typeorm/entities/List';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  cpf: string;

  @Column()
  cnpj: string;

  @Column()
  role: 'r' | 'b' | 'p' | 'd' | 'a' | 'f' | 'bp' | 'db' | 'bf' | 'himself';

  @OneToMany(() => Order, order => order.user_id)
  orders: Order[];

  @OneToMany(() => List, list => list.user_id)
  lists: List[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
```

Para mais informações acesse a [docs](https://github.com/typeorm/typeorm/blob/master/docs/entities.md#what-is-entity) do TypeORM.

**OBS:** Note que os campos e o tipo da entidade bate com oque foi feito no passo anterior (migrations).

No projeto atual as entidades ficam em:

```jsx
src/modules/**/infra/typeorm/entities
```

## Interface Repositories

Aqui você vai listar todas as funções que vai utilizar relacionadas com o banco de dados. Como é uma interface você só vai criar o nome da função, os parâmetros dela e o que ela retorna. Ex:

```jsx
findById(id: string): Promise<User | undefined>;
```

Essa função recebe como parâmetro um **ID** do tipo **string** e retorna um tipo **User** ou **null**.

Sabendo disso, posteriormente você vai construir essa função para percorrer seu banco de dados e buscar por um ID que foi passado, se achar retorna os dados desse ID, se não null.

Exemplo de uma interface de repositório

```jsx
import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IPaginatedUsersDTO from '../dtos/IPaginatedUsersDTO';
import IPaginationUsersDTO from '../dtos/IPaginationUsersDTO';

export default interface IUsersRepository {
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  checkUserExists(
    email: string,
    cpf?: string,
    cnpj?: string,
  ): Promise<User | undefined>;
  findByCPF(email: string): Promise<User | undefined>;
  findByCNPJ(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
  save(user: User): Promise<User>;
  findAllPaginated(data: IPaginationUsersDTO): Promise<IPaginatedUsersDTO>;
}

```

No projeto atual as interfaces de repositórios ficam em:

```jsx
src/modules/**/repositories
```

## Fake Repositorie

O Fake repositorie você vai implementar as interfaces que você fez no passo anterior mas de uma forma diferente. Você **não** vai usar o banco de dados.  Por isso o nome 'fake'. Esse repositório serve **exclusivamente** para rodar os testes unitários.

Então todas as funções que estiverem na Interface Repositorie você vai precisar implementar elas aqui no fake repositorie.

Exemplo de um fake repositorie:

```jsx
import { v4 as uuid } from 'uuid';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import IPaginationDTO from '@shared/dtos/IPaginationDTO';
import IPaginatedUsersDTO from '@modules/users/dtos/IPaginatedUsersDTO';
import User from '../../infra/typeorm/entities/User';

class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async checkUserExists(
    email: string,
    cpf: string,
    cnpj: string,
  ): Promise<User | undefined> {
    const findUser = this.users.find(
      user => user.email === email || user.cpf === cpf || user.cnpj === cnpj,
    );

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findByCPF(cpf: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.cpf === cpf);

    return findUser;
  }

  public async findByCNPJ(cnpj: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.cnpj === cnpj);

    return findUser;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, userData);

    this.users.push(user);

    return user;
  }

  public async delete(id: string): Promise<void> {
    this.users = this.users.filter(user => user.id !== id);
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }

  public async findAllPaginated({
    page,
    limit,
  }: IPaginationDTO): Promise<IPaginatedUsersDTO> {
    const skipped_items = (page - 1) * limit;

    const total_count = this.users.length;
    const users: User[] = [];

    let i = skipped_items;

    const limitLoop =
      skipped_items + limit < total_count
        ? skipped_items + limit
        : total_count - 1;

    if (i === 0 && limitLoop === 0 && this.users[0]) {
      users.push(this.users[0]);
    }
    // eslint-disable-next-line no-plusplus
    for (i; i < limitLoop; i++) {
      users.push(this.users[i]);
    }

    return {
      total_count,
      page,
      limit,
      data: users,
    };
  }
}

export default FakeUsersRepository;

```

No projeto atual os fakes repositories ficam em:

```jsx
src/modules/**/repositories/fakes
```

## Repositorie do TypeORM

Mesma coisa do passo anterior mas agora você vai utilizar o banco de dados. isto é, todos os métodos (find, create, list, show, update, delete) vão persistir no seu banco, diferente do fake repositorie que persistia em variáveis.

Como a interface é a mesma, isto é, as funções, você pode copiar tudo que você fez no FAKE REPOSITORIE e usar de **base** no repositorie. Claro que você vai precisar ajustar algumas coisas pois agora você vai utilizar o banco de dados.

Exemplo de um repositorie:

```jsx
import { getRepository, Repository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';

import IPaginatedUsersDTO from '@modules/users/dtos/IPaginatedUsersDTO';
import IPaginationUsersDTO from '@modules/users/dtos/IPaginationUsersDTO';
import { mountQueryWhere } from '@shared/utils/helpers';
import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne(id);

    return user;
  }

  public async checkUserExists(
    email: string,
    cpf: string,
    cnpj: string,
  ): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: [{ email }, { cpf }, { cnpj }],
    });

    return user;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { email },
    });

    return user;
  }

  public async findByCPF(cpf: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { cpf },
    });

    return user;
  }

  public async findByCNPJ(cnpj: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({
      where: { cnpj },
    });

    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async delete(id: string): Promise<void> {
    this.ormRepository.delete({ id });
  }

  public async save(user: User): Promise<User> {
    return this.ormRepository.save(user);
  }

  public async findAllPaginated({
    limit,
    page,
    sort_by,
    order,
    ...filter
  }: IPaginationUsersDTO): Promise<IPaginatedUsersDTO> {
    const skipped_items = (page - 1) * limit;

    const queryWhere = mountQueryWhere(filter, 'user');

    const [users, total_count] = await this.ormRepository
      .createQueryBuilder('user')
      .where(queryWhere)
      .orderBy(`user.${sort_by || 'created_at'}`, order)
      .offset(skipped_items)
      .limit(limit)
      .getManyAndCount();

    return {
      total_count,
      page,
      limit,
      data: users,
    };
  }
}

export default UsersRepository;
```

No projeto atual os repositories ficam em:

```jsx
src/modules/**/infra/typeorm/repositories
```

## Services

Os services são as regras de negocio da sua aplicação. Ex: Usuário, um usuário na minha aplicação precisa se Cadastrar e fazer o reset da senha. Então vou criar dois services (um para  cadastrar e outro para o reset). Dentro de cada um vou tratar oque pode ou não ser feito, fazer as validações, funcionalidade e etc.

**Os CRUD você faz em services separados!**

Exemplo de um service:

```jsx
import AppError from '@shared/errors/AppError';
import logger from '@shared/utils/logger';
import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<{ message: string }> {
    const checkUserExists = await this.usersRepository.findById(user_id);

    if (!checkUserExists) {
      throw new AppError('User not found', 404);
    }
    await this.usersRepository.delete(user_id);

    logger.info(`user deleted `);

    return { message: 'user deleted' };
  }
}

export default DeleteUserService;
```

Para cada funcionalidade você cria um service separado, (ideia de unidade isolada).

Isso porque para cada service gerado você vai criar um teste unitário. (por isso a ideia de service separado).

Os testes unitários vão testar cada unidade (service) do sistema e são testados individualmente, isto é, um teste não depende do outro.

Você pode optar por escrever os testes e somente depois desenvolver o service, ou também o contrario.

Exemplo de um teste unitário:

```jsx
import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import DeleteUserService from './DeleteUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let deleteUser: DeleteUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);
    deleteUser = new DeleteUserService(fakeUsersRepository);
  });

  it('should be able to delete a user', async () => {
    const { user } = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '46 99999999',
      password: '123456',
      cpf: '123456789',
    });

    const message = await deleteUser.execute({
      user_id: user.id,
    });

    expect(message).toHaveProperty('message');
  });

  it('should not be able to delete the user if the given id does not exist', async () => {
    await expect(
      deleteUser.execute({
        user_id: 'non-existing-user-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
```

**Ex de teste: Vou testar a criação de um usuario:**

Para o usuário se cadastrar na minha aplicação é requisito ele informar o (nome, cpf, email) e os demais campos (phone, data de nascimento) são opcionais.

Regras de negocio: O cpf precisa ser único e valido e o e-mail precisa ser único, isto é, não pode ter e-mail e cpf repetido.

Meu service de criação deve ser capaz de validar todas essas regras de negocio:

1. Verificar se o E-mail e o CPF são únicos, isto é, verificar no meu BD se existe um E-mail e CPF. Se já existir não permitir o cadastro.
2. Verificar se o CPF é valido.
3. Verificar se os campos de 'Nome, CPF, e-mail' foram informados pelo usuário.

Já os testes unitários devem testar (garantir) que essas regras de negocio estão sendo feitas.

No projeto atual os services e os testes unitários ficam em:

```jsx
src/modules/**/services
```

**OBS:** De acordo com o exemplo de criação de um usuário poderia dar o nome do meu service de CreateUserService.ts e meu teste unitário de CreateUserService.spec.ts (mesmo nome do service mas com .spec).

```jsx
# Para rodar os testes unitários
docker exec -it api-server yarn test
```

**NOTE:** No exemplo de service foi usado injeção de dependências:

```jsx
@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}
```

Quando você utiliza injeção de dependências você precisa configura-las no arquivo que fara o controle da injeção.

No projeto atual estamos usando o [tsyringe](https://github.com/microsoft/tsyringe) para injeção de dependências.

O arquivo de configuração das injeções nesse projeto fica em:

```jsx
src/shared/container/index.ts
```

Exemplo de uma configuração de injeção de dependência:

```jsx
import { container } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
```

**OBS:** Note que as flags em destaque nos exemplos devem ter nomes iguais pois é o link entre as injeções. Se estiver diferente não vai funcionar.

## Controllers

Serve para obter os dados solicitados e encaminhar para o respectivo service e depois retorna a resposta para o cliente.

Trabalha diretamente com as rotas, isto é, para cada rota você vai chamar um método de controller.

Ex:

```jsx
usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email(),
      phone: Joi.string()
        .required()
        .regex(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/),
      password: Joi.string().required(),
      cpf: Joi.string().required(),
      cnpj: Joi.string(),
      role: Joi.string().valid('r', 'b', 'p', 'd', 'a', 'f', 'bp', 'db', 'bf'),
    },
  }),
  usersController.create,
);
```
**OBS:** Para validação dos dados que estão vindo na requisição, é usado o [celebrate](https://github.com/arb/celebrate)


Exemplo de um controller (CRUD User):

```jsx
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { IRole } from '@modules/users/dtos/ICreateUserDTO';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import ListUsersService from '@modules/users/services/ListUsersService';
import ShowUserService from '@modules/users/services/ShowUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import { classToClass } from 'class-transformer';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, phone, password, cpf, cnpj, role } = request.body;
    const token = request.headers.authorization;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      phone,
      password,
      cpf,
      cnpj,
      role,
      token,
    });

    return response.json(classToClass(user));
  }

  public async list(request: Request, response: Response): Promise<Response> {
    const { page = 1, limit = 10, sort_by, order, ...filter } = request.query;

    const parsedOrder =
      typeof order === 'string' && order.match(/asc/gi) ? 'ASC' : 'DESC';

    const listUsers = container.resolve(ListUsersService);

    const data = await listUsers.execute({
      page: Number(page),
      limit: Number(limit),
      sort_by: sort_by ? String(sort_by) : undefined,
      order: parsedOrder,
      ...filter,
    });

    return response.json(classToClass(data));
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;

    const showUser = container.resolve(ShowUserService);

    const user = await showUser.execute({ user_id });

    return response.json(classToClass(user));
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;
    const { role: roleRequest } = request.user;

    const {
      name,
      email,
      phone,
      password,
      old_password,
      cpf,
      cnpj,
      role,
    } = request.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      user_id,
      name,
      email,
      phone,
      cpf,
      cnpj,
      old_password,
      password,
      role,
      roleRequest: roleRequest as IRole,
    });

    return response.json(classToClass(user));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;

    const deleteUser = container.resolve(DeleteUserService);

    const message = await deleteUser.execute({
      user_id,
    });

    return response.json(message);
  }
}
```

No projeto atual os controllers ficam em:

```jsx
src/modules/**/infra/http/controllers
```

**NOTE:** UM CONTROLLER NUNCA TERÁ MAIS DO QUE 5 MÉTODOS!!!

Se tiver a necessidade de ter mais métodos cria-se outro controller.

## Routes

Refere-se à determinação de como um app responde a uma solicitação do cliente por um endpoint especifico, que é uma URI (ou caminho) e um método de solicitação HTTP especifico (GET, POST, PUT e etc).

No projeto atual o roteamento está acontecendo em partes, isto é, cada rota está separada por partes, com isso mantemos a aplicação limpa e organizada, movendo cada definição de roteamento para seu respectivo arquivo.

Exemplo de routes:

```jsx
import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import checkRole from '../middlewares/checkRole';

import UsersController from '../controllers/UsersController';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email(),
      phone: Joi.string()
        .required()
        .regex(/^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/),
      password: Joi.string().required(),
      cpf: Joi.string().required(),
      cnpj: Joi.string(),
      role: Joi.string().valid('r', 'b', 'p', 'd', 'a', 'f', 'bp', 'db', 'bf'),
    },
  }),
  usersController.create,
);

usersRouter.use(ensureAuthenticated);

usersRouter.get(
  '/:user_id',
  [checkRole(['r', 'himself'])],
  celebrate({
    [Segments.PARAMS]: {
      user_id: Joi.string().uuid().required(),
    },
  }),
  usersController.show,
);

usersRouter.get(
  '/',
  [checkRole(['r'])],
  celebrate({
    [Segments.QUERY]: {
      limit: Joi.number().min(1),
      page: Joi.number().min(1),
      sort_by: Joi.string(),
      name: Joi.string(),
      email: Joi.string(),
      order: Joi.string(),
      role: Joi.string().valid('r', 'b', 'p', 'd', 'a', 'f', 'bp', 'db', 'bf'),
    },
  }),
  usersController.list,
);

usersRouter.put(
  '/:user_id',
  [checkRole(['r', 'himself'])],
  celebrate({
    [Segments.PARAMS]: {
      user_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      name: Joi.string(),
      email: Joi.string().email(),
      phone: Joi.string().regex(
        /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}-[0-9]{4}$/,
      ),
      cpf: Joi.string(),
      cnpj: Joi.string(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password')),
      role: Joi.string().valid('r', 'b', 'p', 'd', 'a', 'f', 'bp', 'db', 'bf'),
    },
  }),
  usersController.update,
);

usersRouter.delete(
  '/:user_id',
  [checkRole(['r', 'himself'])],
  celebrate({
    [Segments.PARAMS]: {
      user_id: Joi.string().uuid().required(),
    },
  }),
  usersController.delete,
);

export default usersRouter;
```

No projeto atual os routes ficam em:

```jsx
src/modules/**/infra/http/routes/
```

**OBS:** Pode acontecer de uma aplicação ter vários CRUD's e com isso você terá muitas rotas "iguais" como por exemplo a de criar, geralmente utiliza-se '/', ou '/create/'.

Para não acontecer isso podemos separar isso em rotas e subrotas.

Ex: Para eu criar um restaurante eu acesso a rota: '/restaurants/', onde '/restaurants' é uma rota e '/' outra rota responsável pela criação.

No projeto atual o arquivo de configuração das rotas fica em:

```jsx
src/shared/infra/http/routes/index.ts
```

Exemplo de um arquivo de configuração:

```jsx
import { Router } from 'express';

import usersRoutes from '@modules/users/infra/http/routes/users.routes';
import sessionsRoutes from '@modules/users/infra/http/routes/sessions.routes';
import productsRoutes from '@modules/products/infra/http/routes/products.routes';
import productsInList from '@modules/products/infra/http/routes/productsInList.routes';
import imageProducts from '@modules/products/infra/http/routes/imageProducts.routes';
import deliveryPointsRoutes from '@modules/delivery-points/infra/http/routes/deliveryPoints.routes';
import ordersRoutes from '@modules/orders/infra/http/routes/orders.routes';
import listsRoutes from '@modules/lists/infra/http/routes/lists.routes';
import activeListsRoutes from '@modules/lists/infra/http/routes/activeLists.routes';
import historyOrders from '@modules/orders/infra/http/routes/historyOrders.routes';
import passwordRoutes from '@modules/users/infra/http/routes/password.routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/sessions', sessionsRoutes);
routes.use('/password', passwordRoutes);

routes.use('/delivery-points', deliveryPointsRoutes);

routes.use('/products/in-list', productsInList);
routes.use('/products', productsRoutes);
routes.use('/products/image', imageProducts);

routes.use('/lists', activeListsRoutes);
routes.use('/lists', listsRoutes);

routes.use('/orders', ordersRoutes);
routes.use('/orders', historyOrders);

export default routes;
```

Utiliza-se o método 'use()' para encaminhar as sub rotas para o controller respectivo.
