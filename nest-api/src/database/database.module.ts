import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'mysql',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DATABASE_USER,
        // password:
        //   process.env.NODE_ENV !== 'development' &&
        //   process.env.DATABASE_PASSWORD,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        synchronize: false,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        extra: {
          connectionLimit: 10,
          waitForConnections: true,
        },
        /**
         * You can also use createConnection to establish the connection manually
         * and then return a Promise<Connection> instance
         *
         * return mysql.createConnection({
         *   host: 'localhost',
         *   port: 3306,
         *   user: 'root',
         *   password: 'password',
         *   database: 'my_database',
         * }).then((connection) => {
         *   return {
         *     ...options,
         *     connection,
         *   };
         * });
         */
      }),
    }),
  ],
})
export class DatabaseModule {}
