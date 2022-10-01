// import { Test, TestingModule } from '@nestjs/testing';
// import { UserController } from '../controllers/user.controller';
// import { UserService } from '../services/user/user.service';

// describe('UserController', () => {
//   let userController: UserController;

//   beforeEach(async () => {
//     const app: TestingModule = await Test.createTestingModule({
//       controllers: [UserController],
//       providers: [UserService],
//     }).compile();

//     userController = app.get<UserController>(UserController);
//   });

//   describe('createUsers', () => {
//     it('should be able to create a user', async () => {
//       const user = await userController.createUser({
//         name: 'Cliente Teste',
//         email: 'clienteste@email.com',
//         password: '123456',
//       });

//       expect(user.body.client.name).toBe('Cliente Teste');
//       expect(user.body.client.email).toBe('clienteste@email.com');
//     });
//   });
// });
