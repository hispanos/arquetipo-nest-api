import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WrapResponseInterceptor } from './common/interceptors/wrap-response.interceptor';
import { initializeErrsole } from './config/errsole.config';
import errsole from 'errsole';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

initializeErrsole();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'debug', 'verbose'], // Excluir 'log' para evitar RoutesResolver
  });
  app.setGlobalPrefix('api');

  // Registrar el middleware proxy de Errsole (debe ser el primero)
  const errsolePath = process.env.ERSOLE_PATH || '/errsole';
  app.use(errsolePath, (req: any, res: any, next: any) => {
    errsole.nestExpressProxyMiddleware(errsolePath, req, res, next);
  });

  app.useGlobalInterceptors(
    new WrapResponseInterceptor(),
    new ClassSerializerInterceptor(app.get('Reflector')),
  );

  const config = new DocumentBuilder()
  .setTitle('API de Facturación electrónica DIAN Modern')
  .setDescription('API de Facturación electrónica DIAN, para el manejo de facturas electrónicas')
  .setVersion('1.0')
  .addTag('dian-modern')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use(
    '/docs',
    apiReference({
      content: document,
      theme: 'deepSpace'
    }),
  )

  app.enableCors();

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
