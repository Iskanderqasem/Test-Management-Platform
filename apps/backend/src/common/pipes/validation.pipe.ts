import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
  private readonly logger = new Logger(CustomValidationPipe.name);

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object, {
      whitelist: true,
      forbidNonWhitelisted: false,
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      const messages = this.formatErrors(errors);
      this.logger.warn(`Validation failed: ${JSON.stringify(messages)}`);
      throw new BadRequestException({
        message: messages,
        error: 'Validation Failed',
        statusCode: 400,
      });
    }

    return object;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatErrors(errors: ValidationError[]): string[] {
    const messages: string[] = [];

    const extractMessages = (errs: ValidationError[], prefix = '') => {
      for (const error of errs) {
        const propertyPath = prefix ? `${prefix}.${error.property}` : error.property;

        if (error.constraints) {
          const constraintMessages = Object.values(error.constraints);
          messages.push(...constraintMessages.map((msg) => `${propertyPath}: ${msg}`));
        }

        if (error.children && error.children.length > 0) {
          extractMessages(error.children, propertyPath);
        }
      }
    };

    extractMessages(errors);
    return messages;
  }
}
