import {
  Body,
  Controller,
  Delete,
  Get,
  UseGuards,
  Put,
  Query,
} from "@nestjs/common";

import { CurrentUser } from "./decorators/current-user.decorator";
import { UpdateUserDto } from "./dtos/update-user.dto";
import { UserInterface } from "./interfaces/user.interface";
import { paginationQueryOptions } from "src/interfaces/database.interfaces";
import { paginationDefault } from "src/constance";
import { UserPasswordDto } from "./dtos/user-password.dto";
import { UsersService } from "./users.service";
import { AuthGuard } from "../guards/auth.guard";

@Controller("/user")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Put()
  @UseGuards(AuthGuard)
  updateUser(@CurrentUser() user: UserInterface, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(user, body);
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
  @Put("/password")
  setPassword(
    @CurrentUser() user: UserInterface,
    @Body() body: UserPasswordDto
  ) {
    return this.usersService.setUserPassword(user, body);
  }
}
