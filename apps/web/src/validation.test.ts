import { describe, expect, it } from 'vitest';
import { signupSchema, signinSchema } from './validation';

describe('signupSchema', () => {
  const valid = { email: 'user@example.com', name: 'John Doe', password: 'Str0ng!Pass' };

  it('accepts a valid payload', () => {
    expect(signupSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(signupSchema.safeParse({ ...valid, email: 'nope' }).success).toBe(false);
  });

  it('rejects short name', () => {
    expect(signupSchema.safeParse({ ...valid, name: 'ab' }).success).toBe(false);
  });

  it('rejects short password', () => {
    expect(signupSchema.safeParse({ ...valid, password: 'Ab1!' }).success).toBe(false);
  });

  it('rejects password without number', () => {
    expect(signupSchema.safeParse({ ...valid, password: 'Abcdefgh!' }).success).toBe(false);
  });

  it('rejects password without special character', () => {
    expect(signupSchema.safeParse({ ...valid, password: 'Abcdefg1' }).success).toBe(false);
  });
});

describe('signinSchema', () => {
  it('accepts valid payload', () => {
    expect(signinSchema.safeParse({ email: 'a@b.com', password: 'x' }).success).toBe(true);
  });

  it('rejects empty password', () => {
    expect(signinSchema.safeParse({ email: 'a@b.com', password: '' }).success).toBe(false);
  });
});
