const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const pool = require("../../database/postgres/pool");
const CommentRepositoryPostgres = require("../CommentRepositoryPostgres");

describe('CommentRepositoryPostgres', () => {
    it ('should be instance of CommentRepository domain', () => {
        // Arrange
        const pool = {};
        const nanoid = {};
        const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, nanoid);
 
        // Action and Assert
        expect(commentRepositoryPostgres).toBeInstanceOf(CommentRepository);
    });

    describe('behavior test', () => {
        afterEach(async () => {
            await CommentsTableTestHelper.cleanTable();
            await ThreadsTableTestHelper.cleanTable();
            await UsersTableTestHelper.cleanTable();
        })
    
        afterAll(async () => {
            await pool.end();
        })

        describe('addComment function', () => {
            it ('should persist add comment correctly', async () => {
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

                const fakeIDGenerator = () => '123';

                // arrange for add comment
                const addComment = {
                    content: 'comment content',
                    threadID: 'thread-123',
                    owner: 'user-123',
                };

                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIDGenerator);

                // action
                const addedComment = await commentRepositoryPostgres.addComment(addComment)
                const comments = await CommentsTableTestHelper.findCommentByID(addedComment.id);

                // assert
                expect(comments).toBeDefined();
                expect(addedComment).toStrictEqual(new AddedComment({
                    id: 'comment-123',
                    content: addComment.content,
                    owner: addComment.owner,
                }));
            });
        });

        describe('checkCommentIsExist function', () => {
            it ('should throw NotFoundError when comment not found', async () => {
                // Arrange
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

                // Action and Assert
                await expect(commentRepositoryPostgres.checkCommentIsExist('comment-123')).rejects.toThrowError(NotFoundError);
            });

            it ('should not throw NotFoundError when comment is found', async () => {
                // Arrange
                // arrange for add user
                await UsersTableTestHelper.addUser({
                    id: 'user-123',
                    username: 'usertest',
                });

                // arrange for add thread
                await ThreadsTableTestHelper.addThread({
                    id: 'thread-123',
                    title: 'title thread',
                    body: 'body thread',
                    owner: 'user-123',
                });

                // arrange for add comment
                await CommentsTableTestHelper.addComment({
                    id: 'comment-123',
                    content: 'comment content',
                    threadID: 'thread-123',
                    owner: 'user-123',
                });

                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

                // Action and Assert
                await expect(commentRepositoryPostgres.checkCommentIsExist('comment-123')).resolves.not.toThrowError(NotFoundError);
            });
        });

        describe('verifyCommentOwner function', () => {
            it ('should throw NotFoundError when comment not found', async () => {
                // Arrange
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

                // Action and Assert
                await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).rejects.toThrowError(NotFoundError);
            });

            it ('should throw AuthorizationError when comment not owned by user', async () => {
                // Arrange
                // arrange for add user
                await UsersTableTestHelper.addUser({
                    id: 'user-123',
                    username: 'usertest',
                });

                // arrange for add thread
                await ThreadsTableTestHelper.addThread({
                    id: 'thread-123',
                    title: 'title thread',
                    body: 'body thread',
                    owner: 'user-123',
                });

                // arrange for add comment
                await CommentsTableTestHelper.addComment({
                    id: 'comment-123',
                    content: 'comment content',
                    threadID: 'thread-123',
                    owner: 'user-123',
                });

                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

                // Action and Assert
                await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-456')).rejects.toThrowError(AuthorizationError);
            });

            it ('should not throw AuthorizationError when comment owned by user', async () => {
                // Arrange
                // arrange for add user
                await UsersTableTestHelper.addUser({
                    id: 'user-123',
                    username: 'usertest',
                });

                // arrange for add thread
                await ThreadsTableTestHelper.addThread({
                    id: 'thread-123',
                    title: 'title thread',
                    body: 'body thread',
                    owner: 'user-123',
                });

                // arrange for add comment
                await CommentsTableTestHelper.addComment({
                    id: 'comment-123',
                    content: 'comment content',
                    threadID: 'thread-123',
                    owner: 'user-123',
                });

                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

                // Action and Assert
                await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123')).resolves.not.toThrowError(AuthorizationError);
            });
        });

        describe('deleteCommentByID function', () => {
            it ('should throw NotFoundError when comment not found', async () => {
                // Arrange
                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

                // Action and Assert
                await expect(commentRepositoryPostgres.deleteCommentByID('comment-123')).rejects.toThrowError(NotFoundError);
            });

            it ('should delete comment by id correctly', async () => {
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

                // arrange for add comment
                await CommentsTableTestHelper.addComment({
                    id: 'comment-123',
                    content: 'comment content',
                    threadID: 'thread-123',
                    owner: 'user-123',
                });

                const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

                // Action
                await commentRepositoryPostgres.deleteCommentByID('comment-123');

                // Assert
                const comments = await CommentsTableTestHelper.findCommentByID('comment-123');

                expect(comments).toBeDefined();
                expect(comments.is_delete).toEqual(true);
            });
        });
    })
});