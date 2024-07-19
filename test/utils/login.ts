import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { JwtService } from '@nestjs/jwt';
import { requestSender } from './request-sender';

const DEFAULT_PHONE = '09363080321';
const jwtInstance = new JwtService();

export const getValidationTokenAndCode = async (
  app: NestFastifyApplication,
  status: number = 201,
  phone: string = DEFAULT_PHONE,
  forceSendSms = true,
) => {
  // get the validation token from response
  const body = await requestSender(app, status, '/auth/get-validation-token', {
    phone,
    forceSendSms,
  });

  let verifyData: any;
  try {
    if (body?.validationToken) {
      verifyData = await jwtInstance.verify(body.validationToken, {
        secret: process.env.VALIDATION_TOKEN_SECRET,
      });
    }
  } catch (e) {
    console.log('verify validation token err', e);
  }

  return {
    ...body,
    code: verifyData?.code || undefined,
  };
};

export const loginOrRegister = async (
  app: NestFastifyApplication,
  status: number = 201,
  code: string,
  validationToken: string,
) => {
  return requestSender(app, status, '/auth/login-or-register', {
    validationToken,
    code,
  });
};

export const getValidationDataAndRegister = async (
  app: NestFastifyApplication,
  phone: string = DEFAULT_PHONE,
) => {
  const { code, validationToken } = await getValidationTokenAndCode(
    app,
    201,
    phone,
  );
  return loginOrRegister(app, 200, code, validationToken);
};
