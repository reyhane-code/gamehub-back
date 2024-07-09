import {
  Body,
  Controller,
  Delete,
  Post,
  Headers,
  UseGuards,
  Res,
  HttpStatus,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '../guards/auth.guard';
import { AuthService } from './auth.service';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { LoginOrRegisterDto } from './dtos/login-or-register.dto';
import { LoginWithPasswordDto } from './dtos/login-with-password.dto';
import { GetValidationTokenDto } from './dtos/get-validation-token.dto';
import { UserInterface } from 'src/users/interfaces/user.interface';

@Controller('/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body() body: LoginWithPasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { refreshToken, accessToken } = await this.authService.login(body);
    response.status(HttpStatus.OK).send({ refreshToken, accessToken });
    return;
  }

  @Post('/login-or-register')
  async loginOrRegister(
    @Body() body: LoginOrRegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const data = await this.authService.loginOrRegister(body);
    response.status(HttpStatus.OK).send(data);
    return;
  }

  @Post('/get-validation-token')
  async getValidationToken(@Body() body: GetValidationTokenDto) {
    // TODO: fix what if data null ???
    return this.authService.getValidationToken(body);
  }

  @Get('/identity')
  @UseGuards(AuthGuard)
  async getIdentity(@CurrentUser() user: UserInterface) {
    return user;
  }

  @Delete('/logout')
  @UseGuards(AuthGuard)
  logout(@CurrentUser() user: UserInterface, @Headers() headers: any) {
    const accessToken = headers.authorization.split(' ')[1];
    return this.authService.logout(user, accessToken);
  }

  @Post('/refresh-token')
  refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body.refreshToken);
  }
}
