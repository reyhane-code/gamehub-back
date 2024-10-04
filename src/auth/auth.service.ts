import {
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
  PreconditionFailedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IUser } from '../users/interfaces/user.interface';
import { Cache } from 'cache-manager';
import { SmsService } from '../sms/sms.service';
import { LoginOrRegisterDto } from './dtos/login-or-register.dto';
import { SmsSenderNumbers, SmsStatus } from '../sms/enum/sms.enum';
import { LoginWithPasswordDto } from './dtos/login-with-password.dto';
import { GetValidationTokenDto } from './dtos/get-validation-token.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { User } from 'models/user.model';
import { Repository, Role } from '../enums/database.enum';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private readonly jwtService: JwtService,
    private smsService: SmsService,

    @Inject(CACHE_MANAGER) protected cacheManager: Cache,
    @Inject(Repository.USERS) private usersRepository: typeof User,
  ) { }

  private async verifyRefreshTokenAndGetUserId(
    refreshToken: string,
  ): Promise<string> {
    try {
      const verifyData = await this.jwtService.verify(refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
      if (!verifyData?.aud) throw new Error('refresh token is invalid');
      const userId = verifyData.aud.toString();
      const existingToken = await this.cacheManager.get(`${userId}-refresh`);
      if (existingToken !== refreshToken)
        throw new Error('refresh token is invalid');

      return userId;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  generate(n: number): string {
    let add = 1,
      max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

    if (n > max) {
      return this.generate(max) + this.generate(n - max);
    }

    max = Math.pow(10, n + add);
    const min = max / 10; // Math.pow(10, n) basically
    const number = Math.floor(Math.random() * (max - min + 1)) + min;

    return ('' + number).substring(add);
  }

  getBaseOptionsTokens(key: string | number) {
    const audience = key.toString();
    const issuer = 'base.dev';

    return {
      audience,
      issuer,
    };
  }

  async generateValidationTokenAndCode(phoneNumber: string | number, codeDigitCount: number) {
    const code = this.generate(codeDigitCount);
    const payload = { code, phoneNumber };
    const baseOptions = this.getBaseOptionsTokens(phoneNumber);
    const validationToken = await this.jwtService.sign(payload, {
      ...baseOptions,
      expiresIn: '2m',
      secret: this.configService.get('VALIDATION_TOKEN_SECRET'),
    });
    await this.cacheManager.set(
      `${phoneNumber.toString()}-validation`,
      validationToken,
      { ttl: 120 }, // 2min
    );

    return {
      validationToken,
      code,
    };
  }

  async generateAuthTokens(userId: string | number) {
    try {
      const payload = { key: Date.now() + Math.random() };
      const baseOptions = this.getBaseOptionsTokens(userId);
      const refreshToken = await this.jwtService.sign(payload, {
        ...baseOptions,
        expiresIn: '1y',
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
      const accessToken = await this.jwtService.sign(payload, {
        ...baseOptions,
        expiresIn: '20m',
        secret: this.configService.get('ACCESS_TOKEN_SECRET'),
      });
      await this.cacheManager.set(
        `${userId.toString()}-refresh`,
        refreshToken,
        { ttl: 60 * 60 * 24 * 365 },
      );
      return { refreshToken, accessToken };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async login(body: LoginWithPasswordDto) {
    let user;

    if (body.phone) {
      user = await this.findUserByField('phone', body.phone);
    } else if (body.username) {
      user = await this.findUserByField('username', body.username);
    } else if (body.email) {
      user = await this.findUserByField('email', body.email);
    }

    this.validateUser(user);

    await this.comparePasswords(body.password, user.password);

    const { accessToken, refreshToken } = await this.generateAuthTokens(
      user.id,
    );

    return { refreshToken, accessToken };
  }

  async findUserByField(field: string, value: string) {
    return this.usersRepository.findOne({
      where: { [field]: value },
    });
  }

  validateUser(user) {
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) {
      throw new PreconditionFailedException("User doesn't have a password");
    }
  }

  async comparePasswords(inputPassword: string, userPassword: string) {
    const comparePasswordResult = await bcrypt.compare(
      inputPassword,
      userPassword,
    );

    if (!comparePasswordResult) {
      throw new NotFoundException('Invalid credentials or password');
    }
  }

  async generateValidationTokenAndSendCode(
    phone: string,
    forceSendSms: boolean = false,
    tryNumber: number = 0,
  ): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { phone } });
    const hasPassword = Boolean(user?.password);
    if (!hasPassword || forceSendSms) {
      const { validationToken, code } =
        await this.generateValidationTokenAndCode(phone, 4);

      const message = `با سلام کد تایید شما در بیس پروژه : ${code}`;

      // let number: SmsSenderNumbers = SmsSenderNumbers.NUMBER_3500;
      // if (+tryNumber > 0) {
      //   number =
      //     +tryNumber % 2 == 0
      //       ? SmsSenderNumbers.NUMBER_9000
      //       : SmsSenderNumbers.NUMBER_1000;
      // }

      // const sendSmsStatus = await this.smsService.sendSms({
      //   message,
      //   senderNumber: number,
      //   recipientList: [phone],
      // });

      return {
        validationToken,
        code, // todo: remove for production
        hasPassword,
        // sendSmsStatus: SmsStatus.SUCCESS, // must be change to sendSmsStatus from smsService.sendSms
      };
    }

    return {
      hasPassword,
    };
  }

  async generateAdminValidationTokenAndSendCode(
    phone: string,
    forceSendSms: boolean = false,
    tryNumber: number = 0,
  ): Promise<any> {
    const user = await this.usersRepository.findOne({ where: { phone } });

    if (!user || user.role == Role.USER) {
      throw new UnauthorizedException('You are not an admin')
    }

    const { validationToken, code } = await this.generateValidationTokenAndCode(phone, 5);

    const message = `با سلام کد تایید شما در بیس پروژه : ${code}`;


    // Send the SMS (uncomment and implement the SMS sending logic)
    // const sendSmsStatus = await this.smsService.sendSms({
    //   message,
    //   senderNumber: SmsSenderNumbers.NUMBER_3500,
    //   recipientList: [phone],
    // });

    return {
      validationToken,
      code, //todo: remove code for production
      // sendSmsStatus: SmsStatus.SUCCESS, 
    };
  }


  async sendAuthTokenAndIdentity(phone: string) {
    let user = await this.usersRepository.findOne({ where: { phone } });
    if (!user) {
      user = await this.usersRepository.create({ phone });
    }
    const { accessToken, refreshToken } = await this.generateAuthTokens(
      user.id,
    );
    return {
      refreshToken,
      accessToken,
      identity: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        email: user.email,
        hasPassword: user.password ? true : false,
        role: user.role
      },
    };
  }
  async checkCodeAndLoginOrRegister(validationToken: string, code: string) {
    const blockedValidToken = await this.cacheManager.get(
      `block-validation-token-${validationToken}`,
    );
    if (blockedValidToken) {
      throw new BadRequestException('token already used.');
    }

    let verifyData: any;
    try {
      verifyData = await this.jwtService.verify(validationToken, {
        secret: this.configService.get('VALIDATION_TOKEN_SECRET'),
      });
    } catch (e) {
      throw new BadRequestException('invalid token');
    }
    if (!verifyData?.phoneNumber)
      throw new BadRequestException('must send code or phone');

    const existingToken = await this.cacheManager.get(
      `${verifyData.phoneNumber.toString()}-validation`,
    );
    if (!existingToken)
      throw new BadRequestException('token is not sign by me');
    if (verifyData.code != code)
      throw new BadRequestException('code and token not equal');

    // Adding the validation token to block list for 2 mins after being registerd or loged in.
    await this.cacheManager.set(
      `block-validation-token-${validationToken}`,
      validationToken,
      { ttl: 60 * 2 },
    );

    return this.sendAuthTokenAndIdentity(verifyData.phoneNumber);
  }
  async loginOrRegister({ code, validationToken }: LoginOrRegisterDto) {
    return this.checkCodeAndLoginOrRegister(validationToken, code);
  }
  async getValidationToken({
    phone,
    tryNumber,
    forceSendSms,
  }: GetValidationTokenDto) {
    try {
      return this.generateValidationTokenAndSendCode(
        phone,
        forceSendSms,
        tryNumber,
      );
    } catch (error) {
      throw new BadRequestException('Something went wrong!');
    }
  }

  async getAdminValidationToken({
    phone,
    tryNumber,
    forceSendSms,
  }: GetValidationTokenDto) {
    try {
      return this.generateAdminValidationTokenAndSendCode(
        phone,
      );
    } catch (error) {
      throw new BadRequestException('Something went wrong!');
    }
  }
  async logout(user: IUser, accessToken: string) {
    await this.cacheManager.del(`${user.id.toString()}-refresh`);
    await this.cacheManager.set(`block-${user.id}`, accessToken, {
      ttl: 60 * 2,
    });
  }

  async refreshToken(refToken: string) {
    const userId = await this.verifyRefreshTokenAndGetUserId(refToken);
    try {
      await this.cacheManager.del(userId);
      const { accessToken, refreshToken } =
        await this.generateAuthTokens(userId);
      return { refreshToken, accessToken };
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
