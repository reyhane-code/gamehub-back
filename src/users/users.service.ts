import {
  Injectable,
  ConflictException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserInterface } from './interfaces/user.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
import { paginationQueryOptions } from 'src/interfaces/database.interfaces';
import { UserPasswordDto } from './dtos/user-password.dto';
import { User } from '../../models/user.model';
import { Repositories } from 'src/enums/database.enum';

@Injectable()
export class UsersService {
  constructor(
    @Inject(Repositories.USERS)
    private usersRepository: typeof User,
  ) {}

  async updateUser(user: UserInterface, body: UpdateUserDto) {
    if (body.username && body.username != user.username) {
      const existingUser = await this.usersRepository.findOne({
        where: { username: body.username },
      });
      if (existingUser) throw new ConflictException('username already taken!');
    }
    if (body.email && body.email != user.email) {
      const existingUser = await this.usersRepository.findOne({
        where: {
          email: body.email,
        },
      });
      if (existingUser) throw new ConflictException('email already taken!');
    }

    return this.usersRepository.update(body, { where: { id: user.id } });
  }

  async setUserPassword(user: UserInterface, body: UserPasswordDto) {
    if (user.password?.length > 0) {
      if (body?.oldPassword?.length < 1)
        throw new BadRequestException('old password is required');

      const comparePasswordResult = await bcrypt.compare(
        body.oldPassword,
        user.password,
      );
      if (!comparePasswordResult)
        throw new BadRequestException('wrong passwrod!');
    }
    const salt = await bcrypt.genSalt(10);
    const newPassword = await bcrypt.hash(body.password, salt);
    const setPassword = await this.usersRepository.update(
      { password: newPassword },
      { where: { id: user.id } },
      //TODO: do it with sequelize { serializeValue: ['password'] },
    );
    if (setPassword) return { message: 'password set successfully!' };
  }

  allUsers({ perPage, page }: paginationQueryOptions) {
    return this.usersRepository.findAll({
      attributes: { exclude: ['password'] },
      limit: perPage,
      offset: page * perPage,
    });
  }

  deleteUser(user: UserInterface) {
    return this.usersRepository.destroy({ where: { id: user.id } });
  }
}
