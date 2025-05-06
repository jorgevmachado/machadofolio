import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

import { SanitizeUserInterceptor } from './interceptors/sanitize-user/sanitize-user.interceptor';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'localhost',
            password: 'localhost',
            database: 'portfolio',
            entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
            synchronize: true,
        }),
        AuthModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_INTERCEPTOR, useClass: SanitizeUserInterceptor },
    ],
})
export class AppModule {
}
