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
import { UserInterface } from './interfaces/user.interface';
import { paginationQueryOptions } from 'src/interfaces/database.interfaces';
import { paginationDefault } from 'src/constance';
import { UserPasswordDto } from './dtos/user-password.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';
import { Role } from 'src/enums/database.enum';

@Controller('/user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put()
  @UseGuards(AuthGuard)
  updateUser(@CurrentUser() user: UserInterface, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(user, body);
  }

  @Put('/role/:id')
  @UseGuards(AuthGuard)
  updateUserRole(
    @Param('id') id: number,
    @CurrentUser() user: UserInterface,
    @Body() role: Role,
  ) {
    return this.usersService.updateUserRole(id, user, role);
  }

  @Get()
  @UseGuards(AuthGuard)
  getUsers(@Query() query: paginationQueryOptions = paginationDefault) {
    return this.usersService.allUsers(query);
  }

  @UseGuards(AuthGuard)
  @Delete()
  remove(@CurrentUser() user: UserInterface) {
    return this.usersService.deleteUser(user);
  }
  @UseGuards(AuthGuard)
  @Put('/password')
  setPassword(
    @CurrentUser() user: UserInterface,
    @Body() body: UserPasswordDto,
  ) {
    return this.usersService.setUserPassword(user, body);
  }
}
