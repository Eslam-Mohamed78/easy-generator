import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class HealthController {
  @Get()
  health() {
    return {
      status: 'ok',
      service: 'auth-api',
      message: 'Auth API is running. Docs: /api (local) — spec: /api-json',
      endpoints: {
        signup: 'POST /auth/signup',
        signin: 'POST /auth/signin',
        me: 'GET /me (Bearer JWT)',
        openApiSpec: 'GET /api-json',
      },
    };
  }
}
