import { HttpException } from '@nestjs/common';

export class ErrorException extends HttpException {
  constructor(message: string, status = 400, code = undefined) {
    super({ message, isOperational: true, code }, status);
  }
}
