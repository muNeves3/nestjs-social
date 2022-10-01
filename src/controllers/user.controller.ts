import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { UpdateUserDTO } from 'src/interfaces/UpdateUserDTO';
import { IUserDTO } from 'src/interfaces/UserDTO';
import { UserService } from 'src/services/user/user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() body: IUserDTO) {
    const { name, email, password } = body;

    try {
      const user = await this.userService.createUser({
        name,
        email,
        password,
      });

      return user;
    } catch (error) {
      return error.message;
    }
  }

  @Put()
  async editUser(@Body() body: UpdateUserDTO) {
    const { id, name } = body;

    try {
      const user = await this.userService.updateUser({ id, name });

      return user;
    } catch (error) {
      return error.message;
    }
  }

  @Get()
  async getUser() {
    const users = await this.userService.getUsers();

    return users;
  }
}
