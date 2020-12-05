# Typeorm

Pasta onde teremos a conexão com o banco, por padrão basta chamar a função ***createConnection*** e ela irá procurar por um arquivo de configurações na raiz do projeto com o nome ***ormconfig.json*** para estabelecer a conexão

Também teremos a pasta de migrations, onde ficará todas as migrações do banco, ou seja quem irá criar todas as tabelas e colunas no banco. tendo assim uma forma de padronizar o banco indiferente do local em que esteja rodando, pois rodando o comando de migrações, ele irá criar todas as tabelas no banco de acordo como for especificado no arquivo.
