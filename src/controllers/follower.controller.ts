import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { CreateFollowerDTO } from 'src/interfaces/CreateFollowerDTO';
import { FollowerService } from 'src/services/follower/follower.service';

@Controller('/follow')
export class FollowerController {
  constructor(private readonly followerService: FollowerService) {}

  @Post()
  async handleFollowUser(@Body() body: CreateFollowerDTO) {
    const { followerId, userId } = body;

    return await this.followerService.handleFollowUser({ followerId, userId });
  }

  @Get(':userId')
  async getUserFollowers(@Req() request: Request) {
    const { userId } = request.params;

    return await this.followerService.getUserFollowers(Number(userId));
  }
}
