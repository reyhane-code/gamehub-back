import { Injectable } from '@nestjs/common';
import createAxiosInstance from 'src/helpers/axios/create-axios-instance';
import { SendSmsDto } from './dtos/send-sms.dto';
import { SmsSenderUrls, SmsSettings, SmsStatus } from './enum/sms.enum';

@Injectable()
export class SmsService {
  constructor(
  ) { }

  async sendSms(
    body: SendSmsDto,
  ) {

    try {
      const recipientListTo = body.recipientList.filter((rec) => rec != 'undefined');
      const bodyOfSms = {
        op: 'send',
        from: body.senderNumber,
        to: recipientListTo,
        uname: SmsSettings.USERNAME,
        pass: SmsSettings.PASSWORD,
        message: body.message,
        // recipientList,
        //sender,
        // time,
      };
      const api = createAxiosInstance(SmsSettings.BASE_URL)
      const sendData = await api.post(SmsSenderUrls.SELECT_wAY, bodyOfSms);
      const newSendList: string[] = [];
      sendData.data.forEach((sendStatus: number, index: number) => {
        if (sendStatus != SmsStatus.SUCCESS) {
          if (recipientListTo[index]) {
            newSendList.push(recipientListTo[index]);
          }
        }
      });
      if (newSendList.length <= 0) {
        return SmsStatus.SUCCESS;
      } else {
        return SmsStatus.MAY_USER_BLOCK;
      }
    } catch (e) {
      console.error('sms send error ', e);
      return SmsStatus.ERROR_TO_SEND;
    }
  }

}