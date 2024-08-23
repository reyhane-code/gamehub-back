import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

export function TransformResponse(dto: any) {
  return createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    const originalSend = response.send.bind(response);

    response.send = (body: any) => {
      try {
        const transformedBody = plainToInstance(dto, body, { excludeExtraneousValues: true });
        return originalSend(transformedBody);
      } catch (error) {
        // Handle transformation error (e.g., log it, send a default response, etc.)
        console.error('Transformation error:', error);
        return originalSend({ error: 'Transformation failed' });
      }
    };

    return null; // The decorator does not modify the request parameters
  })();
}