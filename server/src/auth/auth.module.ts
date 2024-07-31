import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';

import { ConfigModule, ConfigType } from '@nestjs/config';
import { jwtConfig } from 'commons/configs';
import { UserModule } from 'user/user.module';
import { CommandHandlers } from './commands';
import { JwtStrategy } from './strategies';

@Module({
  imports: [
    CqrsModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [jwtConfig.KEY],
      useFactory: (config: ConfigType<typeof jwtConfig>) => ({
        secret: config.secret,
        signOptions: { expiresIn: config.expiresIn },
      }),
    }),
  ],
  providers: [...CommandHandlers, JwtStrategy],
})
export class AuthModule {}
