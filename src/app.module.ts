import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ExampleModule } from './api/example/example.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ErrsoleModule } from './common/logs/errsole.module';
import { CorrelationIdMiddleware } from './common/middlewares/correlation-id.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      timezone: '-05:00', // UTC-5
      autoLoadEntities: true,
      synchronize: process.env.TYPEORM_SYNC === 'true', //Dejar en false en producción
    }),
    ErrsoleModule,
    ExampleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
