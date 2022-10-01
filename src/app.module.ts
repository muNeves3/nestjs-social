import { Module } from '@nestjs/common';

import { AppController } from './controllers/app.controller';
import { UserController } from './controllers/user.controller';
import { PostController } from './controllers/post.controller';

import { AppService } from './services/app.service';
import { UserService } from './services/user/user.service';
import { PostService } from './services/post/post.service';

@Module({
  imports: [],
  controllers: [AppController, UserController, PostController],
  providers: [AppService, UserService, PostService],
})
export class AppModule {}
