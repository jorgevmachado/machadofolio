import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FinanceModule } from './finance/finance.module';
import { SanitizeUserInterceptor } from './interceptors/sanitize-user/sanitize-user.interceptor';
import { PokemonModule } from './pokemon/pokemon.module';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                `.env.${process.env.NODE_ENV}`, // from app nest-js
                '../.env', // from the root of the monorepo
                '.env'
            ],
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: process.env.SYNCHRONIZE === 'true',
            ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
        }),
        AuthModule,
        FinanceModule,
        PokemonModule
    ],
    controllers: [AppController],
    providers: [
        AppService,
        { provide: APP_INTERCEPTOR, useClass: SanitizeUserInterceptor },
    ],
})
export class AppModule {
}
