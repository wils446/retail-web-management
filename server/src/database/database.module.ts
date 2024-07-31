import { databaseConfig } from 'commons/configs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [databaseConfig.KEY],
      useFactory: (config: ConfigType<typeof databaseConfig>) => ({
        type: 'postgres',
        ...config,
        entities: [__dirname + '/../**/*.entity.{js, ts}'],
        subscribers: [__dirname + '/../**/*.subscriber.{js, ts}'],
        synchronize: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
