import {
  Body,
  Controller,
  Delete,
  Get,
  UseGuards,
  Put,
  Query,
  Param,
  Post,
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
import { UserIdentityDto } from './user-identity.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { AdminIdentityDto } from './admin-identity.dto';
import { AdminUpdateUserDto } from './dtos/admin-update-user.dto';
import { UserDataDto } from './user-data.dto';
import { AdminCreateUserDto } from './dtos/admin-create-user.dto';


@Controller('/user')
export class UsersController {
  constructor(private usersService: UsersService) { }

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

  @Put('/admin/:id?')
  @UseGuards(AdminGuard)
  adminUpdateUser(
    @Body() body: AdminUpdateUserDto,
    @Param('id') id?: number,
  ) {
    return this.usersService.adminUpdateUser(body, id);
  }

  @Post()
  @UseGuards(AdminGuard)
  admiCreateUser(
    @Body() body: AdminCreateUserDto,
  ) {
    return this.usersService.addUser(body);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUsers(@Query() query: IPaginationQueryOptions = paginationDefault) {
    return this.usersService.findAllUsers(query);
  }

  @Get('/:id')
  @TransformResponse(UserDataDto)
  async getUser(@Param('id') id: number) {
    return this.usersService.findUser(id)
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
  @TransformResponse(UserIdentityDto)
  @UseGuards(AuthGuard)
  async getIdentity(@CurrentUser() user: IUser) {
    return user;
  }

  @UseGuards(AdminGuard)
  @Get('/admin/identity')
  @TransformResponse(AdminIdentityDto)
  async getAdminIdentity(@CurrentUser() user: IUser) {
    return user;
  }

}
