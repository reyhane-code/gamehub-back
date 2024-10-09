import {
  Injectable,
  ConflictException,
  BadRequestException,
  Inject,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUser } from './interfaces/user.interface';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { UserPasswordDto } from './dtos/user-password.dto';
import { User } from '../../models/user.model';
import { Repository, Role } from 'src/enums/database.enum';
import { buildQueryOptions } from 'src/helpers/dynamic-query-helper';
import { AdminUpdateUserDto } from './dtos/admin-update-user.dto';
import { AdminCreateUserDto } from './dtos/admin-create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(Repository.USERS)
    private usersRepository: typeof User,
  ) { }

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

  async adminUpdateUser(body: AdminUpdateUserDto, userId?: number) {
    if (body.username) {
      const existingUser = await this.usersRepository.findOne({
        where: { username: body.username },
      });
      if (existingUser) throw new ConflictException('username already taken!');
    }
    const updatedUser = await this.usersRepository.update(body, {
      where: { id: userId },
      returning: true
    })

    return updatedUser;
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

  async findAllUsers(query: IPaginationQueryOptions) {
    const { page, perPage, offset, limit } = buildQueryOptions(query, User);
    const { count, rows } = await this.usersRepository.findAndCountAll({
      attributes: { exclude: ['password'] },
      limit,
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

  async findUser(id: number) {
    const user = await this.usersRepository.findOne({
      where: { id },
    })
    if (!user) {
      throw new NotFoundException('Can not find user with this id.')
    }
    return user;
  }

  async addUser(body: AdminCreateUserDto) {
    let foundUser;
    foundUser = await this.usersRepository.findOne({
      where: { phone: body.phone }
    })
    if (foundUser) {
      throw new ConflictException('User Already exists.')
    }

    if (body.email) {
      foundUser = await this.usersRepository.findOne({
        where: { email: body.email }
      })

      if (foundUser) {
        throw new ConflictException('User Already exists.')
      }
    }

    const user = this.usersRepository.create({
      phone: body.phone,
      username: body.username,
      email: body.email,
      first_name: body.first_name,
      last_name: body.last_name,
      role: body.role,
      active: body.active,
    })


  }
}
