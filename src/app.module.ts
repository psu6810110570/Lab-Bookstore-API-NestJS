import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'password123',
      database: 'bookstore_dev',
      entities: [], // We will add entities here later
      synchronize: true, // Auto-create tables (Dev only)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
