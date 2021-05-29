import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Request, Response } from 'express';
import { ErrorException } from './errorException';

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    let isOperational = exception.getResponse().isOperational || false;
    // const url =request.url

    if (!isOperational)
      switch (status) {
        case HttpStatus.FORBIDDEN:
          isOperational = true;
          break;
        case HttpStatus.UNAUTHORIZED:
          isOperational = true;
      }

    if (!isOperational) {
      if (exception.message != undefined)
        console.log(`Unsupported Err: ${exception.message}`);
      return response.status(500).json({
        statusCode: 500,
        message: 'something is very wrong',
      });
    }

    response.status(status).json({
      statusCode: status,
      message: exception.message,
    });
  }
}
