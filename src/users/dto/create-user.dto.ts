// src/users/dto/create-user.dto.ts
export class CreateUserDto {
  name: string;
  email: string;
  password; string; // O controller receberá a senha
  role: string; // admin, teacher, etc.
}