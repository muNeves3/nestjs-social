import { Injectable } from '@nestjs/common';
import { IUserDTO } from 'src/interfaces/UserDTO';
import { client } from 'src/prisma/client';
import { User } from '@prisma/client';

@Injectable()
export class CreateUserService {
  async createUser({ name, email, password }: IUserDTO): Promise<User> {
    const user = await client.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    return user;
  }
}
