import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { app } from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

describe('Create Category Controller', () => {
    let connection: Connection;

    beforeEach(() => {
        jest.setTimeout(30000);
    });

    beforeAll(async () => {
        connection = await createConnection();

        await connection.runMigrations();

        const id = uuidV4();
        const password = await hash('admin', 8);

        await connection.query(
            `INSERT INTO USERS(id, name, email, password, is_admin, created_at, driver_license )
             VALUES ('${id}', 'admin', 'admin@rentx.com.br','${password}', true, 'now()', 'HHHHHHH')
            `,
        );
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should be able to create a new category', async () => {
        const responseToken = await request(app).post('/sessions').send({
            email: 'admin@rentx.com.br',
            password: 'admin',
        });

        const { token } = responseToken.body;

        const response = await request(app)
            .post('/categories')
            .send({
                name: 'Category supertest',
                description: 'Category supertest',
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(response.status).toBe(201);
    });
    it('should not be able to create a new category if name already exists ', async () => {
        const responseToken = await request(app).post('/sessions').send({
            email: 'admin@rentx.com.br',
            password: 'admin',
        });

        const { token } = responseToken.body;

        const response = await request(app)
            .post('/categories')
            .send({
                name: 'Category supertest',
                description: 'Category supertest',
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        expect(response.status).toBe(400);
    });
});
