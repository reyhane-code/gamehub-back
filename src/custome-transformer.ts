import { HttpException, HttpStatus } from '@nestjs/common';
import { instanceToPlain, plainToInstance } from 'class-transformer';

interface TransformOptions {
  excludeExtraneousValues?: boolean;
}

export function TransformResponse(dto: any, options?: TransformOptions) {
  const defaultOptions: TransformOptions = {
    excludeExtraneousValues: true, // Exclude extraneous values by default
    ...options, // Merge with provided options
  };

  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        const result = await originalMethod.apply(this, args);

        if (Array.isArray(result)) {
          return result.map((item) =>
            plainToInstance(dto, item, defaultOptions),
          );
        }

        return plainToInstance(dto, result, defaultOptions);
      } catch (error) {
        // Log the error (you can use a logging service here)
        console.error('Error in TransformResponse decorator:', error);

        // Optionally, throw a custom exception
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    };

    return descriptor;
  };
}
