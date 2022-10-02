import { CacheModule, Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { UserController } from './controllers/user.controller';
import { PostController } from './controllers/post.controller';

import { AppService } from './services/app.service';
import { UserService } from './services/user/user.service';
import { PostService } from './services/post/post.service';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment/comment.service';
import { FollowerController } from './controllers/follower.controller';
import { FollowerService } from './services/follower/follower.service';

@Module({
  imports: [CacheModule.register()],
  controllers: [
    AppController,
    UserController,
    PostController,
    CommentController,
    FollowerController,
  ],
  providers: [
    AppService,
    UserService,
    PostService,
    CommentService,
    FollowerService,
  ],
})
export class AppModule {}
