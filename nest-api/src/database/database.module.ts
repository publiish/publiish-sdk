import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        // password: 'password',
        database: 'publiish_local',
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
