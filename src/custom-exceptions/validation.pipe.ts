import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ValidationPipeOptions,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { CustomException } from './custom-exception';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  protected options: ValidationPipeOptions;
  constructor(options?: ValidationPipeOptions) {
    this.options = options;
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    try {
      if (!metatype || !this.toValidate(metatype)) {
        return value;
      }
      const transformOptions = this.options?.transformOptions ?? {};
      const object = plainToInstance(metatype, value, transformOptions);

      const errors = await validate(object);
      if (errors.length > 0) {
        const errList: Array<any> = errors.map(({ property, constraints }) => {
          if (constraints && property) {
            return this.getErrorData(property, constraints);
          }
        }).filter(Boolean); // Filter out undefined values

        throw new CustomException(
          'invalid data',
          HttpStatus.UNPROCESSABLE_ENTITY,
          errList,
        );
      }
      return object;
    } catch (e) {
      console.error('Error during transformation:', e);
      throw e;
    }
  }


  private getErrorData(property: string, constraints: object) {
    const errorText = constraints[Object.keys(constraints)[0]];
    return {
      [property]: errorText,
    };
  }

  protected toValidate(metadata: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metadata);
  }
}
