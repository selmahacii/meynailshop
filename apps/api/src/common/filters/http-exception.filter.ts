import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message = 'An error occurred';
    let errors: string[] = [];

    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      if (Array.isArray(exceptionResponse.message)) {
        errors = exceptionResponse.message;
        message = 'Validation failed';
      } else if (typeof exceptionResponse.message === 'string') {
        message = exceptionResponse.message;
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
      errors: errors.length > 0 ? errors : undefined,
    });
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let message = 'Internal server error';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || 'Http Error';
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    console.error('🔥 [AllExceptionsFilter] Exception caught:', exception);

    response.status(statusCode).json({
      statusCode: statusCode,
      message: message,
      error: process.env.NODE_ENV === 'development' ? (exception instanceof Error ? exception.name : 'Error') : undefined,
    });
  }
}
