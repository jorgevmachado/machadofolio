import * as dotenv from 'dotenv';

import { DataSourceOptions } from 'typeorm';

dotenv.config({
    path: [
        `.env.${process.env.NODE_ENV}`,
        '../.env',
        '.env'
    ]
});

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
    synchronize: true,
};