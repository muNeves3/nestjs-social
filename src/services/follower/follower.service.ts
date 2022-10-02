import {
  CACHE_MANAGER,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Follower } from '@prisma/client';
import { Cache } from 'cache-manager';
import { CreateFollowerDTO } from 'src/interfaces/CreateFollowerDTO';
import { client } from 'src/prisma/client';

@Injectable()
export class FollowerService {
  constructor(@Inject(CACHE_MANAGER) private cachemanager: Cache) {}

  async handleFollowUser({
    followerId,
    userId,
  }: CreateFollowerDTO): Promise<Follower> {
    if (followerId === userId) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'You cannot follow yourself',
        },
        HttpStatus.FORBIDDEN,
      );
    }

    let alreadyFollowed = await client.follower.findFirst({
      where: {
        followerId,
        userId,
      },
    });

    if (!alreadyFollowed) {
      alreadyFollowed = await client.follower.create({
        data: {
          followerId,
          userId,
        },
      });

      return alreadyFollowed;
    }

    await client.follower.delete({
      where: {
        id: alreadyFollowed.id,
      },
    });
  }

  async getUserFollowers(userId: number): Promise<Follower[]> {
    const cachekey = `follower:${userId}`;
    let followers = await this.cachemanager.get<Follower[]>(cachekey);

    if (!followers) {
      followers = await client.follower.findMany({
        where: {
          userId: userId,
        },
      });

      await this.cachemanager.set(cachekey, followers, 60 * 60 * 24);
    }

    return followers;
  }
}
