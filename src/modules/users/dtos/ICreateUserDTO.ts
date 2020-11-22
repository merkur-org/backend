export default interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
  cpf: string;
  role?: string;
}
