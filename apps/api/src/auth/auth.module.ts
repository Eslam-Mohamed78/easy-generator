import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController, MeController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register({})],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController, MeController],
})
export class AuthModule {}
