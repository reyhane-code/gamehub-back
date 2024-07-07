// change the interface of Error and add a status and data property
interface Error {
  name: string;
  message: string;
  stack?: string;
  data?: Object | Array<any>;
  status?: number;
}

interface ErrorConstructor {
  new (message?: string): Error;
  (message?: string): Error;
  readonly prototype: Error;
}

declare var Error: ErrorConstructor;

/* 
 CustomException get message, status and errorList and set them to the Error object 
 you can get error by getError() method
*/
export class CustomException {
  private error: Error;

  constructor(
    message: string,
    status: number,
    errorList?: Object | Array<any>,
  ) {
    this.error = new Error(message);
    this.error.status = status;
    if (errorList) {
      this.error.data = errorList;
    }
  }

  getStatus(): number {
    return this.error.status;
  }

  getResponse(): Object | Array<any> {
    return {
      statusCode: this.error.status,
      data: this.error.data ? this.error.data : undefined,
    };
  }
}
