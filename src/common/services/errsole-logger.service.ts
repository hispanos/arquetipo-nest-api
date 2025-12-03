import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import errsole from 'errsole';
import { CORRELATION_ID_HEADER } from '../middlewares/correlation-id.middleware';

/**
 * Servicio de logging con Errsole que incluye correlationId automáticamente
 */
@Injectable({ scope: Scope.REQUEST })
export class ErrsoleLoggerService {
  constructor(@Inject(REQUEST) private request: Request) {}

  private getCorrelationId(): string {
    return (
      this.request[CORRELATION_ID_HEADER] ||
      (this.request.headers[CORRELATION_ID_HEADER] as string) ||
      'no-correlation-id'
    );
  }

  private enrichMetadata(metadata?: any): any {
    return {
      correlationId: this.getCorrelationId(),
      ...metadata,
    };
  }

  log(message: string, metadata?: any) {
    errsole.log(message, this.enrichMetadata(metadata));
  }

  info(message: string, metadata?: any) {
    errsole.info(message, this.enrichMetadata(metadata));
  }

  debug(message: string, metadata?: any) {
    errsole.debug(message, this.enrichMetadata(metadata));
  }

  warn(message: string, metadata?: any) {
    errsole.warn(message, this.enrichMetadata(metadata));
  }

  error(message: string, metadata?: any) {
    errsole.error(message, this.enrichMetadata(metadata));
  }
}
