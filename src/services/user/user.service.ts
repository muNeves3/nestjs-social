import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'This email is already in use',
        },
        HttpStatus.FORBIDDEN,
      );
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
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'User not found',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return user;
  }

  async getUsers(): Promise<User[]> {
    const users = await client.user.findMany();

    return users;
  }

  async deleteUser(id: number): Promise<User> {
    const user = await client.user.delete({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'User not found',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    return user;
  }
}
