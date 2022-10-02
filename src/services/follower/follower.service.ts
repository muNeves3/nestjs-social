import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFollowerDTO } from 'src/interfaces/CreateFollowerDTO';
import { client } from 'src/prisma/client';

@Injectable()
export class FollowerService {
  async handleFollowUser({ followerId, userId }: CreateFollowerDTO) {
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

  async getUserFollowers(userId: number) {
    const followers = await client.follower.findMany({
      where: {
        userId: userId,
      },
    });

    return followers;
  }
}
