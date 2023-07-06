import { PipeTransform, Injectable, ArgumentMetadata, UnprocessableEntityException } from '@nestjs/common';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private readonly schema: Joi.ObjectSchema) {}

  async transform(value: unknown, metadata: ArgumentMetadata): Promise<UnprocessableEntityException | unknown> {
    try {
      if (this.toValidate(metadata)) {
        value = await this.schema.validateAsync(value);
      }
      return value;
    } catch (Error) {
      console.error(Error);
      throw new UnprocessableEntityException(
        Error.message.toString() ?? 'Something went wrong! Please try again later.',
      );
    }
  }

  private toValidate(metatype: ArgumentMetadata): boolean {
    const types: string[] = ['body'];
    return types.includes(metatype.type);
  }
}
