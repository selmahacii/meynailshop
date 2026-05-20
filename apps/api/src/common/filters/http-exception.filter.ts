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

    let message = 'Une erreur est survenue';
    let errors: string[] = [];

    const frenchFallback: Record<number, string> = {
      [HttpStatus.UNAUTHORIZED]: "Votre session a expiré ou vos identifiants sont incorrects.",
      [HttpStatus.FORBIDDEN]: "Vous n'avez pas l'autorisation d'accéder à cette section.",
      [HttpStatus.NOT_FOUND]: "La ressource demandée n'existe pas ou plus.",
      [HttpStatus.INTERNAL_SERVER_ERROR]: "Le serveur rencontre une difficulté technique. Veuillez réessayer plus tard.",
      [HttpStatus.BAD_REQUEST]: "Veuillez vérifier les informations saisies.",
    };

    if (typeof exceptionResponse === 'object' && 'message' in exceptionResponse) {
      if (Array.isArray(exceptionResponse.message)) {
        errors = exceptionResponse.message;
        message = 'Certains champs sont invalides.';
      } else if (typeof exceptionResponse.message === 'string') {
        const rawMsg = exceptionResponse.message;
        // Use more human friendly version if it looks like a standard technical msg
        if (rawMsg === 'Unauthorized' || rawMsg === 'Forbidden' || rawMsg === 'Not Found' || rawMsg === 'Bad Request') {
            message = frenchFallback[status] || rawMsg;
        } else {
            message = rawMsg;
        }
      }
    } else {
        message = frenchFallback[status] || message;
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
    let message = 'Désolé, une erreur technique est survenue.';
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      const rawMessage = typeof res === 'string' ? res : (res as any).message || 'Erreur inconnue';

      const mappings: Record<string, string> = {
        'Unauthorized': "Désolé, vous n'êtes pas autorisé à faire cela. Veuillez vous connecter.",
        'Forbidden': "Accès refusé. Veuillez vérifier vos droits.",
        'Not Found': "Désolé, cette page ou ce produit n'existe pas.",
        'Bad Request': "Les données saisies ne sont pas valides.",
      };

      message = mappings[rawMessage] || rawMessage;
    } else if (exception instanceof Error) {
      // Include exception message temporarily for production debugging
      message = exception.message;
    }

    console.error('🔥 [AllExceptionsFilter] Exception caught:', exception);

    response.status(statusCode).json({
      statusCode: statusCode,
      message: message,
      error: exception instanceof Error ? exception.name : 'Error',
      stack: exception instanceof Error ? exception.stack : undefined,
    });
  }
}
