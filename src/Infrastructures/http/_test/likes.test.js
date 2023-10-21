const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const ServerTestHelper = require("../../../../tests/ServerTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const container = require("../../container");
const pool = require("../../database/postgres/pool");
const createServer = require("../createServer");

describe('likes API', () => {
    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await AuthenticationsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await LikesTableTestHelper.cleanTable();
    });
    
    afterAll(async () => {
        await pool.end();
    });

    describe('when PUT /threads/{threadID}/comments/{commentID}/likes', () => {
        it ('should response 200 and liked comment', async () => {
            // arrange
            const server = await createServer(container);

            const { accessToken, userID } = await ServerTestHelper.getAccessTokenHelper({server});

            const threadID = 'thread-123';
            const commentID = 'comment-123';

            await ThreadsTableTestHelper.addThread({
                id: threadID,
                title: 'sebuah thread',
                body: 'sebuah body',
                owner: userID,
            });

            await CommentsTableTestHelper.addComment({
                id: commentID,
                threadID,
                content: 'sebuah comment',
                owner: userID,
            });

            // action
            const response = await server.inject({
                method: 'PUT',
                url: `/threads/${threadID}/comments/${commentID}/likes`,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            // assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });

});