# Pasta referente a entidade

Estrutura base que será seguido para todas as outras entidades.

**Pasta *dtos***:  Dentro desta pasta teremos interfaces (que serão utilizadas nos repositories e services para criar algum tipo de dado).

Representam algum tipo de dado que iremos estar fazendo a transferência, por exemplo dados que iremos receber em uma requisição para criar um novo usuário no banco.

"***Data Transfer Object\*** (DTO) ou simplesmente ***Transfer Object\*** é um padrão de projetos bastante usado em Java para o transporte de  dados entre diferentes componentes de um sistema, diferentes instâncias  ou processos de um sistema distribuído ou diferentes sistemas via  serialização.

A ideia consiste basicamente em agrupar um conjunto de atributos numa classe simples de forma a otimizar a comunicação. "

referência: https://pt.stackoverflow.com/questions/31362/o-que-%C3%A9-um-dto



**Pasta *infra***: Nesta é onde se encontra a maior parte de implementação real da nossa aplicação, fora da pasta infra temos bastante definição de interfaces para modelar o sistema, e dentro da pasta de infra temos a implementação dessas interfaces.

Teremos outras 2 subpastas, sendo elas:

- ***http***: onde será definido todas as nosssas rotas e também os controllers

  - controller:  dentro de cada um iremos chamar um service, fazendo a injeção de dependência das classe que o service espera como parâmetro

  - rotas: iremos definir qual rota irá chamar qual controller, ex: a rota "/" irá chamar o controler de criar usuário

    ```ts
    usersRouter.post('/', usersController.create);
    ```

- ***typeorm***: onde será definido todas os models que serão mapeados no banco e também a classes que irão se comunicar com o mesmo

  - entities: são os objetos que serão mapeados no banco
  - repositories: classe onde temos os métodos que irão fazer alguma ação no banco, como buscar um usuário por email ("findByEmail")



**Pasta *providers***: Dentro desa pasta teremos a implementação do container que fará o controle da injeção de nossas dependências, estaremos utilizando o [tsyringe](https://github.com/microsoft/tsyringe) uma lib desenvolvida pela microsoft para injeção de dependência para js/ts. Também estaremos utilizando o padrão ***Singleton*** que garante a existência de somente uma instância de uma classe em todo o ciclo de vida de nossa aplicação.

"O padrão de injeção de dependências visa remover dependências desnecessárias entre as classes". referência: https://pt.stackoverflow.com/questions/20770/o-que-%C3%A9-inje%C3%A7%C3%A3o-de-depend%C3%AAncia



**Pasta *repositories***: Nesta pasta teremos as interfaces dos repositories (para cada arquivo irá resultar em uma implementação dentro de **fakes** e **infra/typeorm/repositories**).

A pasta **fakes** é uma pasta que contém uma classe que implementa a interface de repositories simulando um banco de dados fake, que será utilizado posteriormente para testes.

Já em infra/typeorm/repositories contém uma classe que implementa a interface de repositories e seus métodos irão se comunicar e transferir dados com o banco.



**Pasta *services***: Nesta pasta teremos a implementação de todos os serviços, que basicamente é quem irá chamar conter toda a regra de negócio e também chamará um repository para buscar, filtrar, criar, deletar um certo dado no banco. Também dentro desta pasta, teremos os testes unitários de cada service, todo arquivo que conter no seu nome .spec significa que será um arquivo de teste do nosso software.
