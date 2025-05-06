import {type DataSourceOptions} from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'localhost',
    password: 'localhost',
    database: 'portfolio',
    entities: [__dirname + '/../entities/*.entity{.ts,.js}'],
    synchronize: true,
};