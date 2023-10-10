const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe('replies API', () => {
    afterEach(async () => {
        await RepliesTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it ('should response 401 when request not contain access token', async () => {
            // Arrange
            const requestPayload = {
                content: 'reply content',
            };

            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
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
            const threadID = 'thread-123';
            const requestPayload = {};

            const server = await createServer(container);

            const { accessToken, userID } = await ServerTestHelper.getAccessTokenHelper({server});

            await ThreadsTableTestHelper.addThread({
                id: threadID,
                title: 'title thread',
                body: 'body thread',
                owner: userID,
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'comment content',
                owner: userID,
                threadID: threadID,
            });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena data yang dikirimkan tidak lengkap');
        });

        it ('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const threadID = 'thread-123';
            const requestPayload = {
                content: 123,
            };

            const server = await createServer(container);

            const { accessToken, userID } = await ServerTestHelper.getAccessTokenHelper({server});

            await ThreadsTableTestHelper.addThread({
                id: threadID,
                title: 'title thread',
                body: 'body thread',
                owner: userID,
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'comment content',
                owner: userID,
                threadID: threadID,
            });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena tipe data tidak sesuai');
        });

        it ('should response 404 when thread not found', async () => {
            // Arrange
            const requestPayload = {
                content: 'reply content',
            };

            const server = await createServer(container);

            const { accessToken } = await ServerTestHelper.getAccessTokenHelper({server});

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
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

        it ('should response 404 when comment not found', async () => {
            // Arrange
            const requestPayload = {
                content: 'reply content',
            };

            const server = await createServer(container);

            const { accessToken, userID } = await ServerTestHelper.getAccessTokenHelper({server});

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'title thread',
                body: 'body thread',
                owner: userID,
            });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('komentar tidak ditemukan');
        });

        it ('should response 201 and added reply', async () => {
            // Arrange
            const requestPayload = {
                content: 'reply content',
            };

            const server = await createServer(container);

            const { accessToken, userID } = await ServerTestHelper.getAccessTokenHelper({server});

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'title thread',
                body: 'body thread',
                owner: userID,
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'comment content',
                owner: userID,
                threadID: 'thread-123',
            });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
                payload: requestPayload,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedReply).toBeDefined();
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        it ('should response 401 when request not contain access token', async () => {
            // Arrange
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
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
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
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

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'title thread',
                body: 'body thread',
                owner: userID,
            });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('komentar tidak ditemukan');
        });

        it ('should response 404 when reply not found', async () => {
            // Arrange
            const server = await createServer(container);

            const { accessToken, userID } = await ServerTestHelper.getAccessTokenHelper({server});

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'title thread',
                body: 'body thread',
                owner: userID,
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'comment content',
                owner: userID,
                threadID: 'thread-123',
            });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('balasan tidak ditemukan');
        });

        it ('should response 403 when user not owner', async () => {
            // Arrange
            const server = await createServer(container);

            const { accessToken } = await ServerTestHelper.getAccessTokenHelper({server});
            const otherUserID = 'user-456';

            await UsersTableTestHelper.addUser({
                id: otherUserID,
                username: 'usertest',
                password: 'secret',
                fullname: 'User Test'
            });

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'title thread',
                body: 'body thread',
                owner: otherUserID,
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'comment content',
                owner: otherUserID,
                threadID: 'thread-123',
            });

            await RepliesTableTestHelper.addReply({
                id: 'reply-123',
                content: 'reply content',
                owner: otherUserID,
                commentID: 'comment-123',
            });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
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

        it ('should response 200 when delete reply success', async () => {
            // Arrange
            const server = await createServer(container);

            const { accessToken, userID } = await ServerTestHelper.getAccessTokenHelper({server});

            await ThreadsTableTestHelper.addThread({
                id: 'thread-123',
                title: 'title thread',
                body: 'body thread',
                owner: userID,
            });

            await CommentsTableTestHelper.addComment({
                id: 'comment-123',
                content: 'comment content',
                owner: userID,
                threadID: 'thread-123',
            });

            await RepliesTableTestHelper.addReply({
                id: 'reply-123',
                content: 'reply content',
                owner: userID,
                commentID: 'comment-123',
            });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
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