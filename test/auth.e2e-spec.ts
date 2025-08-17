// test/auth.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import { createTestingApp } from './utils';
import * as request from 'supertest';

describe('Authentication system (e2e)', () => {
  let app: INestApplication;
  const inputEmail = 'email2@mail.com';
  const password = 'password';

  beforeEach(async () => {
    app = await createTestingApp();
    (global as any).__app = app; // setup.ts will close it afterEach
  });

  it('handles signup request', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: inputEmail, password })
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.email).toBe(inputEmail);
  });

  it('signup as  a new user then get the currently loged user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: inputEmail, password })
      .expect(201);

    const cookie = response.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/current-user')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(inputEmail);
  });
});
