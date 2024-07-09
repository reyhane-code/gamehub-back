import { SmsSenderNumbers } from "../enum/sms.enum";

export interface Sms {
  message: string;
  senderNumber: SmsSenderNumbers;
  recipientList: string[];
}

