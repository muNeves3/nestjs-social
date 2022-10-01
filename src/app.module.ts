import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { ReturnDateController } from './controllers/returndate.controller';
import { ReturnDateService } from './services/returndate.service';
import { CreateUserController } from './controllers/createuser.controller';
import { CreateUserService } from './services/createUser.service';

@Module({
  imports: [],
  controllers: [AppController, ReturnDateController, CreateUserController],
  providers: [AppService, ReturnDateService, CreateUserService],
})
export class AppModule {}
