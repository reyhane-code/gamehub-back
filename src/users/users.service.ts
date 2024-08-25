import {
  Injectable,
  ConflictException,
  BadRequestException,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUser } from './interfaces/user.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { UserPasswordDto } from './dtos/user-password.dto';
import { User } from '../../models/user.model';
import { Repository, Role } from 'src/enums/database.enum';
import { generatePaginationQuery } from 'src/helpers/helpers';

@Injectable()
export class UsersService {
  constructor(
    @Inject(Repository.USERS)
    private usersRepository: typeof User,
  ) {}

  async updateUser(user: IUser, body: UpdateUserDto) {
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

  async updateUserRole(user: IUser, role: Role, id?: number) {
    if (user.role === Role.SUPER || process.env.NODE_ENV === 'test') {
      try {
        const condition = id ? { id } : { id: user.id };
        return this.usersRepository.update({ role }, { where: condition });
      } catch (error) {
        throw new BadRequestException('Failed to update user role!');
      }
    }
    throw new UnauthorizedException(
      'You do not have permission to access this route',
    );
  }

  async setUserPassword(user: IUser, body: UserPasswordDto) {
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
    try {
      const newPassword = await bcrypt.hash(body.password, salt);
      const setPassword = await this.usersRepository.update(
        { password: newPassword },
        { where: { id: user.id }, returning: true, fields: ['password'] },
      );
      return { message: 'password set successfully!' };
    } catch (error) {
      throw new BadRequestException('something went wrong!');
    }
  }

  async allUsers(query: IPaginationQueryOptions) {
    const { page, perPage } = generatePaginationQuery(query, User);
    const offset = !!((page - 1) * perPage) ? (page - 1) * perPage : 0;
    const { count, rows } = await this.usersRepository.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit: perPage,
      offset,
    });

    return {
      pagination: {
        count,
        page,
        perPage,
      },
      items: rows,
    };
  }

  deleteUser(user: IUser) {
    return this.usersRepository.destroy({ where: { id: user.id } });
  }
}
