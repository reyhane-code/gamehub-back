import {
  Body,
  Controller,
  Delete,
  Get,
  UseGuards,
  Put,
  Query,
  Param,
} from '@nestjs/common';

import { CurrentUser } from './decorators/current-user.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IUser } from './interfaces/user.interface';
import { IPaginationQueryOptions } from 'src/interfaces/database.interfaces';
import { paginationDefault } from 'src/constance';
import { UserPasswordDto } from './dtos/user-password.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';
import { Role } from 'src/enums/database.enum';
import { TransformResponse } from 'src/custome-transformer';
import { UserResponseDto } from './userdata.dto';

@Controller('/user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put()
  @UseGuards(AuthGuard)
  updateUser(@CurrentUser() user: IUser, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(user, body);
  }

  @Put('/role/:id?')
  @UseGuards(AuthGuard)
  updateUserRole(
    @CurrentUser() user: IUser,
    @Body() body: { role: Role },
    @Param('id') id?: number,
  ) {
    return this.usersService.updateUserRole(user, body.role, id);
  }

  @TransformResponse(UserResponseDto)
  @Get()
  @UseGuards(AuthGuard)
  async getUsers() {
    // return this.usersService.allUsers(query);
    const result = await this.usersService.allUsers();
    return result; 
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@CurrentUser() user: IUser) {
    return this.usersService.deleteUser(user);
  }
  @UseGuards(AuthGuard)
  @Put('/password')
  setPassword(@CurrentUser() user: IUser, @Body() body: UserPasswordDto) {
    return this.usersService.setUserPassword(user, body);
  }

  @Get('/identity')
  @UseGuards(AuthGuard)
  async getIdentity(@CurrentUser() user: IUser) {
    return {
      id: user.id,
      username: user.username,
      phone: user.phone,
      email: user.email,
      password: user.password,
      first_name: user.firstName,
      last_name: user.lastName,
    };
  }
}
