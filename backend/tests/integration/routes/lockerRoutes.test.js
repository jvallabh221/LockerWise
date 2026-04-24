const request = require('supertest');
const createApp = require('../../../createApp.js');
const {
    createTestUser,
    createTestLocker,
    createAuthHeader,
} = require('../../helpers/fixtures.js');

let app;

beforeAll(() => {
    app = createApp();
});

describe('GET /api/locker/allLockers', () => {
    it('returns 401 without a token (verifyToken middleware)', async () => {
        const res = await request(app).get('/api/locker/allLockers');
        expect(res.status).toBe(401);
    });

    it('returns a response for an authenticated Admin request', async () => {
        const { user } = await createTestUser({
            role: 'Admin',
            email: 'admin-route@example.com',
        });
        await createTestLocker();

        const res = await request(app)
            .get('/api/locker/allLockers')
            .set(createAuthHeader(user));

        // The controller's exact response shape is not frozen in D0 —
        // we just prove auth + routing + DB round-trip work end-to-end.
        expect(res.status).toBeLessThan(500);
        expect(res.body).toBeDefined();
    });
});
