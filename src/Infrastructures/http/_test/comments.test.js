const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe('Comments HTTP API', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        // await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('when POST /threads/{threadId}/comments', () => {

        it ('should response 401 when request not contain access token', async () => {
            // Arrange
            const requestPayload = {
                content: 'isi komentar',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/123/comments',
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
            const requestPayload = {};

            const threadID = 'thread-123';

            const server = await createServer(container);

            const { accessToken, userID } = await ServerTestHelper.getAccessTokenHelper({server});

            await ThreadsTableTestHelper.addThread({
                id: threadID,
                title: 'title thread',
                body: 'body thread',
                owner: userID,
            });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadID}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena data yang dikirimkan tidak lengkap');
        });

        it ('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const requestPayload = {
                content: 123,
            };

            const threadID = 'thread-123';

            const server = await createServer(container);

            const { accessToken, userID } = await ServerTestHelper.getAccessTokenHelper({server});

            await ThreadsTableTestHelper.addThread({
                id: threadID,
                title: 'title thread',
                body: 'body thread',
                owner: userID,
            });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadID}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
        });

        it ('should response 404 when thread not found', async () => {
            // Arrange
            const requestPayload = {
                content: 'isi komentar',
            };

            const server = await createServer(container);

            const { accessToken } = await ServerTestHelper.getAccessTokenHelper({server});

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });

        it('should response 201 and persisted comment', async () => {
            // Arrange
            const requestPayload = {
                content: 'isi komentar',
            };

            const server = await createServer(container);

            const { accessToken, userID } = await ServerTestHelper.getAccessTokenHelper({server});

            const threadId = 'thread-123';
            
            await ThreadsTableTestHelper.addThread({
                id: threadId,
                title: 'title thread',
                body: 'body thread',
                owner: userID,
            });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: `/threads/${threadId}/comments`,
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
            expect(responseJson.data.addedComment.id).toBeDefined();
            expect(responseJson.data.addedComment.content).toBeDefined();
            expect(responseJson.data.addedComment.owner).toBeDefined();
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it ('should response 401 when request not contain access token', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/123/comments/123',
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Missing authentication');
        });

        it ('should response 404 when thread not found', async () => {
            // Arrange
            const server = await createServer(container);

            const { accessToken } = await ServerTestHelper.getAccessTokenHelper({server});

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/123',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('thread tidak ditemukan');
        });

        it ('should response 404 when comment not found', async () => {
            // Arrange
            const server = await createServer(container);

            const { accessToken, userID } = await ServerTestHelper.getAccessTokenHelper({server});

            const threadId = 'thread-123';
            
            await ThreadsTableTestHelper.addThread({
                id: threadId,
                title: 'title thread',
                body: 'body thread',
                owner: userID,
            });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/comment-123`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('comment tidak ditemukan');
        });

        it ('should response 403 when user not owner of comment', async () => {
            // Arrange
            const server = await createServer(container);

            const { accessToken, userID } = await ServerTestHelper.getAccessTokenHelper({server});

            const threadId = 'thread-123';
            
            await ThreadsTableTestHelper.addThread({
                id: threadId,
                title: 'title thread',
                body: 'body thread',
                owner: userID,
            });

            await UsersTableTestHelper.addUser({
                id: 'user-456',
                username: 'user456',
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'comment content',
                threadID: threadId,
                owner: 'user-456',
            });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/comment-123`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('Anda tidak berhak mengakses resource ini');
        });

        it ('should response 200 when user is owner of comment', async () => {
            // Arrange
            const server = await createServer(container);

            const { accessToken, userID } = await ServerTestHelper.getAccessTokenHelper({server});

            const threadId = 'thread-123';
            
            await ThreadsTableTestHelper.addThread({
                id: threadId,
                title: 'title thread',
                body: 'body thread',
                owner: userID,
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'comment content',
                threadID: threadId,
                owner: userID,
            });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: `/threads/${threadId}/comments/comment-123`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });
});