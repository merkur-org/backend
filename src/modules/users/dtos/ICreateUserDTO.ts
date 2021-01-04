export type IRole =
  | 'r' // root (vai poder fazer todas as ações)
  | 'b' // Comprador (buyer)
  | 'p' // fornecedor (provider)
  | 'd' // entregador (deliveryman)
  | 'a' // administrador (administrator)
  | 'f' // financeiro (financial)
  | 'bp' // comprador && fornecedor
  | 'db' // entregador && comprador
  | 'bf'; // comprador e financeiro
export default interface ICreateUserDTO {
  name: string;
  email?: string;
  phone: string;
  password: string;
  cpf: string;
  cnpj?: string;
  role?: IRole;
}
