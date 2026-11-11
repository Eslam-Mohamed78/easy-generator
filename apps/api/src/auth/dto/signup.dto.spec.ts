import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { SignupDto } from './signup.dto';

function base(): Partial<SignupDto> {
  return { email: 'user@example.com', name: 'John Doe', password: 'Str0ng!Pass' };
}

describe('SignupDto validation', () => {
  it('accepts a valid payload', async () => {
    const errors = await validate(plainToInstance(SignupDto, base()));
    expect(errors).toHaveLength(0);
  });

  it('rejects invalid email', async () => {
    const errors = await validate(plainToInstance(SignupDto, { ...base(), email: 'not-an-email' }));
    expect(errors.some((e) => e.property === 'email')).toBe(true);
  });

  it('rejects short name', async () => {
    const errors = await validate(plainToInstance(SignupDto, { ...base(), name: 'ab' }));
    expect(errors.some((e) => e.property === 'name')).toBe(true);
  });

  it('rejects short password', async () => {
    const errors = await validate(plainToInstance(SignupDto, { ...base(), password: 'Ab1!' }));
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('rejects password without number', async () => {
    const errors = await validate(plainToInstance(SignupDto, { ...base(), password: 'Abcdefgh!' }));
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });

  it('rejects password without special char', async () => {
    const errors = await validate(plainToInstance(SignupDto, { ...base(), password: 'Abcdefg1' }));
    expect(errors.some((e) => e.property === 'password')).toBe(true);
  });
});
