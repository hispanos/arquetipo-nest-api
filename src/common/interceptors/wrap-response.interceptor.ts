// src/common/wrap-response.interceptor.ts

import {
    CallHandler,
    ExecutionContext,
    NestInterceptor,
    Injectable,
    HttpException,
    HttpStatus,
  } from '@nestjs/common';
  import { Observable, throwError } from 'rxjs';
  import { map, catchError } from 'rxjs/operators';
  
  @Injectable()
  export class WrapResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => ({ data })),
        catchError((err) => {
          if (err instanceof HttpException) {
            const response = err.getResponse();
            const errorMessage = Array.isArray(response['message'])
              ? response['message'].join('. ')
              : response['message'] || 'Ocurrió un error';
  
            return throwError(
              () =>
                new HttpException(
                  {
                    error: { message: errorMessage, statusCode: err.getStatus() },
                  },
                  err.getStatus(),
                ),
            );
          } else {
            // For any other type of error, we wrap it in a HttpException
            return throwError(
              () =>
                new HttpException(
                  {
                    error: {
                      message: err.message || 'Ocurrió un error',
                      statusCode: err.getStatus(),
                    },
                  },
                  HttpStatus.INTERNAL_SERVER_ERROR,
                ),
            );
          }
        }),
      );
    }
  }
  