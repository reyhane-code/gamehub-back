import { SmsSenderNumbers } from "../enum/sms.enum";

export interface ISms {
  message: string;
  senderNumber: SmsSenderNumbers;
  recipientList: string[];
}

