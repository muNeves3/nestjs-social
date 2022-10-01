import { Body, Controller, Post, Req } from '@nestjs/common';
import { IUserDTO } from 'src/interfaces/UserDTO';
import { CreateUserService } from 'src/services/createUser.service';

@Controller('user')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  async createUser(@Body() body: IUserDTO) {
    const { name, email, password } = body;

    const user = await this.createUserService.createUser({
      name,
      email,
      password,
    });

    return user;
  }
}
