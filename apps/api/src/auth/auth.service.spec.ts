import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UsersService, SafeUser } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';

describe('AuthService', () => {
  let service: AuthService;
  const existingUser: SafeUser = { id: '507f1f77bcf86cd799439011', email: 'demo@example.com', name: 'Demo' };

  const usersServiceMock = {
    findByEmailWithHash: jest.fn(),
    create: jest.fn(),
    findById: jest.fn(),
  };

  const jwtServiceMock = { sign: jest.fn(() => 'signed-token') };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
    jest.clearAllMocks();
  });

  describe('signup', () => {
    const dto: SignupDto = { email: 'new@example.com', name: 'New User', password: 'Str0ng!Pass' };

    it('creates a user and returns a token', async () => {
      usersServiceMock.findByEmailWithHash.mockResolvedValue(null);
      usersServiceMock.create.mockResolvedValue({ ...existingUser, email: dto.email, name: dto.name });

      const result = await service.signup(dto);

      expect(bcrypt.compare(dto.password, usersServiceMock.create.mock.calls[0][2])).resolves.toBe(true);
      expect(result.accessToken).toBe('signed-token');
      expect(result.user.name).toBe(dto.name);
    });

    it('rejects duplicate email', async () => {
      usersServiceMock.findByEmailWithHash.mockResolvedValue({ ...existingUser, passwordHash: 'hash' });
      await expect(service.signup(dto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signin', () => {
    it('returns token for valid credentials', async () => {
      const hash = await bcrypt.hash('Str0ng!Pass', 4);
      usersServiceMock.findByEmailWithHash.mockResolvedValue({
        ...existingUser,
        _id: { toString: () => existingUser.id },
        passwordHash: hash,
      });

      const result = await service.signin({ email: 'demo@example.com', password: 'Str0ng!Pass' });
      expect(result.accessToken).toBe('signed-token');
    });

    it('rejects unknown email', async () => {
      usersServiceMock.findByEmailWithHash.mockResolvedValue(null);
      await expect(service.signin({ email: 'nope@example.com', password: 'x' })).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('rejects wrong password', async () => {
      const hash = await bcrypt.hash('Correct1!', 4);
      usersServiceMock.findByEmailWithHash.mockResolvedValue({
        ...existingUser,
        _id: { toString: () => existingUser.id },
        passwordHash: hash,
      });
      await expect(service.signin({ email: 'demo@example.com', password: 'Wrong1!x' })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
