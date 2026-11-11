import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @ApiProperty({ example: 'Str0ng!pass' })
  @IsString()
  @MinLength(1, { message: 'Password is required' })
  password!: string;
}
