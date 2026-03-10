import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    const req = context.switchToHttp().getRequest<Request>() as any;
    const method = req?.method;
    const url = req?.url;
    const startedAt = Date.now();

    const stream$ = next.handle();

    // Pas de typage RxJS strict ici pour éviter les conflits de versions.
    // On s'abonne simplement pour logguer quand la réponse est envoyée.
    (stream$ as any).subscribe({
      next: () => {
        const duration = Date.now() - startedAt;
        console.log(
          JSON.stringify({
            type: 'http_request',
            method,
            url,
            durationMs: duration,
          }),
        );
      },
      error: () => {
        const duration = Date.now() - startedAt;
        console.log(
          JSON.stringify({
            type: 'http_request_error',
            method,
            url,
            durationMs: duration,
          }),
        );
      },
    });

    return stream$;
  }
}


