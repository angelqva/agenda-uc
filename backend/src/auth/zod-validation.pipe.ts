import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import type { ZodSchema, ZodError } from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: any) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof Error && 'issues' in error) {
        const zodError = error as ZodError;
        const errorMessages = zodError.issues.map(issue => {
          return `${issue.path.join('.')}: ${issue.message}`;
        });
        
        throw new BadRequestException({
          message: 'Datos de entrada inválidos',
          errors: errorMessages,
        });
      }
      throw new BadRequestException('Error de validación');
    }
  }
}