import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService, SafeUser } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';

export interface AuthResponse {
  accessToken: string;
  user: SafeUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(dto: SignupDto): Promise<AuthResponse> {
    const existing = await this.usersService.findByEmailWithHash(dto.email);
    if (existing) {
      throw new UnauthorizedException('An account with this email already exists');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create(dto.email, dto.name, passwordHash);
    return this.buildAuthResponse(user);
  }

  async signin(dto: SigninDto): Promise<AuthResponse> {
    const userDoc = await this.usersService.findByEmailWithHash(dto.email);
    if (!userDoc) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const valid = await bcrypt.compare(dto.password, userDoc.passwordHash);
    if (!valid) {
      throw new UnauthorizedException('Invalid email or password');
    }
    const user: SafeUser = { id: userDoc._id.toString(), email: userDoc.email, name: userDoc.name };
    return this.buildAuthResponse(user);
  }

  private buildAuthResponse(user: SafeUser): AuthResponse {
    return {
      accessToken: this.jwtService.sign({ sub: user.id, email: user.email }),
      user,
    };
  }
}
