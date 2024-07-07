import { CustomException } from './custom-exception';
import { HttpStatus } from '@nestjs/common';

/* 
 This method get property name and the constraints from an error
 an error object is like this:
{
    property: 'email'
    constraints : {
        'IsEmail' : 'email must be a email',
        'IsString' : 'email must be a string'
    }
}
 then get value from constraints object and replace constraints name with the property name and return it 
*/
const getErrorData = (property, constraints) => {
  const errorText = constraints[Object.keys(constraints)[0]];
  return {
    [property]: errorText,
  };
};

/* 
 This method get all errors from the validation errors object and return an array of errors
 we get the property name and the constraints from the validation errors object and throw a custom exception
*/
export const exceptionFactory = (errors: any) => {
  const errList: Array<any> = errors.map(({ property, constraints }) => {
    if (constraints && property) {
      return getErrorData(property, constraints);
    }
  });

  if (errList.length > 0) {
    throw new CustomException('invalid data', HttpStatus.BAD_REQUEST, errList);
  }
};
