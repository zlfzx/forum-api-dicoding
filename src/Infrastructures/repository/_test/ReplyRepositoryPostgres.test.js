const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AddReply = require("../../../Domains/replies/entities/AddReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const DetailReply = require("../../../Domains/replies/entities/DetailReply");
const pool = require("../../database/postgres/pool");
const ReplyRepositoryPostgres = require("../ReplyRepositoryPostgres");

describe('ReplyRepositoryPostgres', () => {
    it ('should be instance of ReplyRepository domain', () => {
        // Arrange
        const replyRepositoryPostgres = new ReplyRepositoryPostgres({}, {});
 
        // Action & Assert
        expect(replyRepositoryPostgres).toBeInstanceOf(ReplyRepositoryPostgres);
    });
    
    describe('behavior test', () => {
        afterEach(async () => {
            await RepliesTableTestHelper.cleanTable();
            await UsersTableTestHelper.cleanTable();
            await ThreadsTableTestHelper.cleanTable();
            await CommentsTableTestHelper.cleanTable();
        });

        afterAll(async () => {
            await pool.end();
        });

        describe('addReply function', () => {
            it ('should persist add reply correctly', async () => {
                // Arrange
                // arrange for add reply
                const fakeIDGenerator = () => '123';
                const userID = 'user-123';
                const threadID = 'thread-123';
                const commentID = 'comment-123';
                await UsersTableTestHelper.addUser({
                    id: userID,
                    username: 'usertest',
                    password: 'secret',
                    fullname: 'User Test'
                });

                await ThreadsTableTestHelper.addThread({
                    id: threadID,
                    title: 'title thread',
                    body: 'body thread',
                    owner: userID,
                });

                await CommentsTableTestHelper.addComment({
                    id: commentID,
                    content: 'comment content',
                    owner: userID,
                    threadID: threadID,
                });

                const addReply = new AddReply({
                    commentID: commentID,
                    content: 'reply content',
                    owner: userID,
                });


                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIDGenerator);

                // Action
                const addedReply = await replyRepositoryPostgres.addReply(addReply);
                const replies = await RepliesTableTestHelper.findReplyByID(addedReply.id);

                // Assert
                expect(addedReply).toStrictEqual(new AddedReply({
                    id: 'reply-123',
                    commentID: commentID,
                    content: 'reply content',
                    owner: userID,
                }));
                expect(replies).toBeDefined();
                expect(replies).toHaveLength(1);
                expect(replies).toStrictEqual([{
                    id: 'reply-123',
                    comment_id: commentID,
                    content: 'reply content',
                    owner: userID,
                    is_delete: false,
                }]);
            });
        });

        describe('getReplyCommentByThreadID function', () => {
            it ('should return replies comment by thread id correctly', async () => {
                // Arrange
                // arrange for add reply
                const userID = 'user-123';
                const threadID = 'thread-123';
                const commentID = 'comment-123';
                await UsersTableTestHelper.addUser({
                    id: userID,
                    username: 'usertest',
                    password: 'secret',
                    fullname: 'User Test'
                });

                await ThreadsTableTestHelper.addThread({
                    id: threadID,
                    title: 'title thread',
                    body: 'body thread',
                    owner: userID,
                });

                await CommentsTableTestHelper.addComment({
                    id: commentID,
                    content: 'comment content',
                    owner: userID,
                    threadID: threadID,
                });

                const addReply = {
                    id: 'reply-123',
                    commentID: commentID,
                    content: 'reply content',
                    owner: userID,
                    date: '2023',
                };

                await RepliesTableTestHelper.addReply(addReply);

                const expectedReply = [
                    new DetailReply({
                        id: 'reply-123',
                        comment_id: commentID,
                        username: 'usertest',
                        date: '2023',
                        content: 'reply content',
                        is_delete: false,
                    })
                ]

                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

                // Action
                const replies = await replyRepositoryPostgres.getReplyCommentByThreadID('thread-123');

                // Assert
                expect(replies).toHaveLength(1);
                expect(replies).toStrictEqual(expectedReply);
                expect(replies[0].id).toEqual(addReply.id);
                expect(replies[0].comment_id).toEqual(addReply.commentID);
                expect(replies[0].username).toEqual('usertest');
                expect(replies[0].date).toEqual(addReply.date);
                expect(replies[0].content).toEqual(addReply.content);
            });

            it ('should return empty array if no replies comment by thread id', async () => {
                // Arrange
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

                // Action
                const replies = await replyRepositoryPostgres.getReplyCommentByThreadID('thread-123');

                // Assert
                expect(replies).toBeDefined();
                expect(replies).toHaveLength(0);
                expect(replies).toEqual([]);
            });
        });

        describe('checkReplyIsExist function', () => {
            it ('should throw NotFoundError when reply is not exist', async () => {
                // Arrange
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

                // Action & Assert
                await expect(replyRepositoryPostgres.checkReplyIsExist('reply-123')).rejects.toThrowError(NotFoundError);
            });

            it ('should not throw NotFoundError when reply is exist', async () => {
                // Arrange
                // arrange for add reply
                const fakeIDGenerator = () => '123';
                const userID = 'user-123';
                const threadID = 'thread-123';
                const commentID = 'comment-123';
                await UsersTableTestHelper.addUser({
                    id: userID,
                    username: 'usertest',
                    password: 'secret',
                    fullname: 'User Test'
                });

                await ThreadsTableTestHelper.addThread({
                    id: threadID,
                    title: 'title thread',
                    body: 'body thread',
                    owner: userID,
                });

                await CommentsTableTestHelper.addComment({
                    id: commentID,
                    content: 'comment content',
                    owner: userID,
                    threadID: threadID,
                });

                await RepliesTableTestHelper.addReply({
                    id: 'reply-123',
                    comment_id: commentID,
                    content: 'reply content',
                    owner: userID,
                });

                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIDGenerator);

                // Action & Assert
                await expect(replyRepositoryPostgres.checkReplyIsExist('reply-123')).resolves.not.toThrowError(NotFoundError);
            });
        });

        describe('verifyReplyOwner function', () => {
            it ('should throw NotFoundError when reply is not exist', async () => {
                // Arrange
                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

                // Action & Assert
                await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).rejects.toThrowError(NotFoundError);
            });

            it ('should throw AuthorizationError when reply is not owned by user', async () => {
                // Arrange
                // arrange for add reply
                await UsersTableTestHelper.addUser({
                    id: 'user-123',
                    username: 'usertest',
                });

                await ThreadsTableTestHelper.addThread({
                    id: 'thread-123',
                    title: 'title thread',
                    body: 'body thread',
                    owner: 'user-123',
                });

                await CommentsTableTestHelper.addComment({
                    id: 'comment-123',
                    content: 'comment content',
                    owner: 'user-123',
                    threadID: 'thread-123',
                });

                await RepliesTableTestHelper.addReply({
                    id: 'reply-123',
                    owner: 'user-123',
                    comment_id: 'comment-123',
                    content: 'reply content',
                });

                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

                // Action & Assert
                await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-456')).rejects.toThrowError(Error);
            });

            it ('should not throw AuthorizationError when reply is owned by user', async () => {
                // Arrange
                // arrange for add reply
                await UsersTableTestHelper.addUser({
                    id: 'user-123',
                    username: 'usertest',
                });

                await ThreadsTableTestHelper.addThread({
                    id: 'thread-123',
                    title: 'title thread',
                    body: 'body thread',
                    owner: 'user-123',
                });

                await CommentsTableTestHelper.addComment({
                    id: 'comment-123',
                    content: 'comment content',
                    owner: 'user-123',
                    threadID: 'thread-123',
                });

                await RepliesTableTestHelper.addReply({
                    id: 'reply-123',
                    owner: 'user-123',
                    comment_id: 'comment-123',
                    content: 'reply content',
                });

                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

                // Action & Assert
                await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123')).resolves.not.toThrowError(Error);
            });
        });

        describe('deleteReplyByID function', () => {
            it ('should delete reply by id correctly', async () => {
                // Arrange
                // arrange for add reply
                const fakeIDGenerator = () => '123';
                const userID = 'user-123';
                const threadID = 'thread-123';
                const commentID = 'comment-123';
                await UsersTableTestHelper.addUser({
                    id: userID,
                    username: 'usertest',
                    password: 'secret',
                    fullname: 'User Test'
                });

                await ThreadsTableTestHelper.addThread({
                    id: threadID,
                    title: 'title thread',
                    body: 'body thread',
                    owner: userID,
                });

                await CommentsTableTestHelper.addComment({
                    id: commentID,
                    content: 'comment content',
                    owner: userID,
                    threadID: threadID,
                });

                await RepliesTableTestHelper.addReply({
                    id: 'reply-123',
                    comment_id: commentID,
                    content: 'reply content',
                    owner: userID,
                });

                const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIDGenerator);

                // Action
                await replyRepositoryPostgres.deleteReplyByID('reply-123');

                // Assert
                const replies = await RepliesTableTestHelper.findReplyByID('reply-123');
                expect(replies).toBeDefined();
                expect(replies).toHaveLength(1);
                expect(replies[0].is_delete).toEqual(true);
            });
        });
    });
});