const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {

        it ('should response 401 when request not contain access token', async () => {
            // Arrange
            const requestPayload = {
                title: 'title thread',
                body: 'body thread',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it ('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const requestPayload = {
                title: 'title thread',
            };

            const server = await createServer(container);

            const { accessToken } = await ServerTestHelper.getAccessTokenHelper({server});

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena data yang dikirimkan tidak lengkap');
        });

        it ('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                title: 123,
                body: 'body thread',
            };

            const server = await createServer(container);

            const { accessToken } = await ServerTestHelper.getAccessTokenHelper({server});

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
        });

        it ('should response 201 and persisted thread', async () => {
            // Arrange
            const requestPayload = {
                title: 'title thread',
                body: 'body thread',
            };

            const server = await createServer(container);

            const { accessToken } = await ServerTestHelper.getAccessTokenHelper({server});

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedThread).toBeDefined();
        });
    });

    describe('when GET /threads/{threadID}', () => {
        it ('should response 404 when thread not found', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123',
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });
        
        it ('should response 200 and thread', async () => {
            // Arrange
            // arrange for add user
            await UsersTableTestHelper.addUser({
                id: 'user-123',
                username: 'usertest',
                password: 'secret',
                fullname: 'User Test'
            });

            // arrange for add thread
            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'title thread',
                body: 'body thread',
                owner: 'user-123',
            });

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123',
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.thread).toBeDefined();
            expect(responseJson.data.thread.id).toEqual('thread-123');
            expect(responseJson.data.thread.comments).toBeDefined();
        });
    });
});