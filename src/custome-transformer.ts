import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

export function TransformResponse(dto: any) {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    const originalSend = response.send.bind(response);

    response.send = (body: any) => {
      const transformedBody = plainToInstance(dto, body, {
        excludeExtraneousValues: true,
      });
      return originalSend(transformedBody);
    };

    // Return null as the decorator does not modify the request parameters
    return null;
  })();
}
