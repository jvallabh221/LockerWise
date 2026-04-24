const request = require('supertest');
const createApp = require('../../../createApp.js');
const { createTestUser } = require('../../helpers/fixtures.js');

let app;

beforeAll(() => {
    app = createApp();
});

describe('POST /api/user/login', () => {
    it('returns 400 when email or password is missing', async () => {
        const res = await request(app).post('/api/user/login').send({});
        expect(res.status).toBe(400);
    });

    it('returns 404 when the user does not exist', async () => {
        const res = await request(app)
            .post('/api/user/login')
            .send({ email: 'nobody@example.com', password: 'anything' });
        expect(res.status).toBe(404);
    });

    it('returns 200 and a JWT for valid credentials', async () => {
        const { user, plainPassword } = await createTestUser({
            email: 'login@example.com',
            role: 'Admin',
        });
        const res = await request(app)
            .post('/api/user/login')
            .send({ email: user.email, password: plainPassword });

        expect(res.status).toBe(200);
        expect(typeof res.body.token).toBe('string');
        expect(res.body.email).toBe(user.email);
        expect(res.body.password).toBeUndefined();
    });

    it('returns 401 for an invalid password', async () => {
        await createTestUser({ email: 'wrongpass@example.com' });
        const res = await request(app)
            .post('/api/user/login')
            .send({ email: 'wrongpass@example.com', password: 'WRONG' });
        expect(res.status).toBe(401);
    });
});
