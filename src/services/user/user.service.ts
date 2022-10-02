import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { IUserDTO } from 'src/interfaces/UserDTO';
import { client } from 'src/prisma/client';
import { Follower, Prisma, User } from '@prisma/client';
import { UpdateUserDTO } from 'src/interfaces/UpdateUserDTO';
import { IUserWithFollowersDTO } from 'src/interfaces/UserWithFollowersDTO';

@Injectable()
export class UserService {
  constructor(@Inject(CACHE_MANAGER) private cachemanager: Cache) {}

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
    const cachekey = `users`;
    let users = await this.cachemanager.get<User[]>(cachekey);

    if (!users) {
      users = await client.user.findMany();
      await this.cachemanager.set(cachekey, users, 60 * 60 * 24);
    }

    return users;
  }

  async getUserWithFollowers(): Promise<IUserWithFollowersDTO[]> {
    const usersCachekey = `users`;
    const followersCacheKey = `follower`;
    let users = await this.cachemanager.get<User[]>(usersCachekey);
    let followers = await this.cachemanager.get<Follower[]>(followersCacheKey);

    if (!users) {
      users = await client.user.findMany();
      await this.cachemanager.set(usersCachekey, users, 60 * 60 * 24);
    }
    if (!followers) {
      followers = await client.follower.findMany();
      await this.cachemanager.set(followersCacheKey, users, 60 * 60 * 24);
    }

    const usersWithFollowers = users.map((user) => {
      const userFollowers = followers.map((x) => x.userId);
      let acc = 0;

      userFollowers.forEach((x) => {
        if (x === user.id) {
          acc++;
        }
      });

      return {
        ...user,
        followers: acc,
      };
    });

    return usersWithFollowers;

    // const users: IUserWithFollowersDTO[] = await client.$queryRaw(
    //   Prisma.sql`SELECT CAST(count(follower) as int) as "followers", "user".* FROM "user"
    // LEFT OUTER JOIN follower on "user".id = follower."userId"
    // GROUP BY
    //   "user".id,
    //   "user".email,
    //   "user".name,
    //   "user"."createdAt"`,
    // );

    // return users
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
