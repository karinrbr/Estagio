import { HttpException, Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    // const context = host.switchToHttp();
    // const response = context.getResponse<Response>();
    // const request = context.getRequest<Request>();
    // const status = exception.getStatus();
    // const message = exception.message;
    // response.status(status).json(Object.assign({ errorCode: stringHashCode(message) }, exception.getResponse()));

    super.catch(exception, host);
  }
}
