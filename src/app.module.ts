import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { UserController } from './controllers/user.controller';
import { PostController } from './controllers/post.controller';

import { AppService } from './services/app.service';
import { UserService } from './services/user/user.service';
import { PostService } from './services/post/post.service';
import { CommentController } from './controllers/comment.controller';
import { CommentService } from './services/comment/comment.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    UserController,
    PostController,
    CommentController,
  ],
  providers: [AppService, UserService, PostService, CommentService],
})
export class AppModule {}
