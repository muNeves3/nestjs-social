import { Injectable } from '@nestjs/common';
import { IUserDTO } from 'src/interfaces/UserDTO';
import { client } from 'src/prisma/client';
import { User } from '@prisma/client';
import { UpdateUserDTO } from 'src/interfaces/UpdateUserDTO';

@Injectable()
export class UserService {
  async createUser({ name, email, password }: IUserDTO): Promise<User> {
    const user = await client.user.create({
      data: {
        name,
        email,
        password,
      },
    });

    if (!user) {
      throw new Error('User already exists');
    }

    return user;
  }

  async updateUser({ id, name }: UpdateUserDTO): Promise<User> {
    const user = await client.user.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await client.user.findMany();

    return users;
  }
}
