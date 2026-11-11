import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  email!: string;

  @ApiProperty({ example: 'John Doe', minLength: 3 })
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name!: string;

  @ApiProperty({ example: 'Str0ng!pass', minLength: 8 })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/[a-zA-Z]/, { message: 'Password must contain at least one letter' })
  @Matches(/[0-9]/, { message: 'Password must contain at least one number' })
  @Matches(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' })
  password!: string;
}
