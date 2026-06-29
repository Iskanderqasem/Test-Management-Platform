import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const requestId = uuidv4();
    const { method, url, body, query, params, headers } = request;
    const userAgent = headers['user-agent'] || '';
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';
    const startTime = Date.now();

    // Attach requestId to request for downstream use
    (request as any).requestId = requestId;
    response.setHeader('X-Request-Id', requestId);

    // Sanitize body for logging (remove sensitive fields)
    const sanitizedBody = this.sanitizeBody(body);

    this.logger.log(
      `[${requestId}] --> ${method} ${url} - IP: ${ip} - Agent: ${userAgent}` +
        (Object.keys(sanitizedBody).length ? ` - Body: ${JSON.stringify(sanitizedBody)}` : ''),
    );

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        const statusCode = response.statusCode;

        this.logger.log(
          `[${requestId}] <-- ${method} ${url} - ${statusCode} - ${duration}ms`,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.logger.error(
          `[${requestId}] <-- ${method} ${url} - ERROR - ${duration}ms - ${error.message}`,
        );
        throw error;
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') return body || {};

    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'api_key', 'authorization'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    }

    return sanitized;
  }
}
