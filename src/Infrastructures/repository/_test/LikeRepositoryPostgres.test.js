const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const LikesTableTestHelper = require("../../../../tests/LikesTableTestHelper");
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const pool = require("../../database/postgres/pool");
const LikeRepositoryPostgres = require("../LikeRepositoryPostgres");

describe('LikeRepositoryPostgres', () => {
    describe('behavior test', () => {
        beforeAll(async () => {
            const userId = 'user-123';
            const threadId = 'thread-123';
            const commentID = 'comment-123';
            const commentID2 = 'comment-456';
            await UsersTableTestHelper.addUser({ id: userId });
            await ThreadsTableTestHelper.addThread({ id: threadId, owner: userId });
            await CommentsTableTestHelper.addComment({ id: commentID, threadId, owner: userId });
            await CommentsTableTestHelper.addComment({ id: commentID2, threadId, owner: userId });
        });
        afterEach(async () => {
            await LikesTableTestHelper.cleanTable();
        });
        
        afterAll(async () => {
            await UsersTableTestHelper.cleanTable();
            await ThreadsTableTestHelper.cleanTable();
            await AuthenticationsTableTestHelper.cleanTable();
            await CommentsTableTestHelper.cleanTable();
            await pool.end();
        });

        describe('addLike function', () => {
            it ('should add like to database', async () => {
                // Arrange
                const fakeIdGenerator = () => '123';
                const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
                const owner = 'user-123';
                const commentID = 'comment-123';

                // Action
                await likeRepositoryPostgres.addLike({ owner, commentID });

                // Assert
                const likes = await LikesTableTestHelper.findLikeById('like-123');
                expect(likes).toHaveLength(1);
            });

            it ('should return added like correctly', async () => {
                // Arrange
                const fakeIdGenerator = () => '123'; // stub!
                const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
                const owner = 'user-123';
                const commentID = 'comment-123';

                // Action
                const addedLike = await likeRepositoryPostgres.addLike({ owner, commentID });

                // Assert
                expect(addedLike).toStrictEqual({
                    id: 'like-123',
                    owner,
                });
            });
        });

        describe('deleteLike function', () => {
            it ('should delete like from database', async () => {
                // Arrange
                const fakeIdGenerator = () => '123';
                const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
                const owner = 'user-123';
                const commentID = 'comment-123';

                await LikesTableTestHelper.addLike({ id: 'like-123', owner, commentID });

                // Action
                await likeRepositoryPostgres.deleteLike({ owner, commentID });

                // Assert
                const likes = await LikesTableTestHelper.findLikeById('like-123');
                expect(likes).toHaveLength(0);
            });

            // it ('should return deleted like correctly', async () => {
            //     // Arrange
            //     const fakeIdGenerator = () => '123';
            //     const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
                
            // });
        });

        describe('getLikeCount function', () => {
            it ('should return likes from database', async () => {
                // Arrange
                const fakeIdGenerator = () => '123';
                const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
                const owner = 'user-123';
                const commentID = 'comment-123';

                await LikesTableTestHelper.addLike({ id: 'like-123', owner, commentID });

                // Action
                const likes = await likeRepositoryPostgres.getLikeCount(commentID);

                // Assert
                expect(likes).toEqual(1);
            });
        });

        describe('checkLike function', () => {
            it ('should return like from database', async () => {
                // Arrange
                const fakeIdGenerator = () => '123';
                const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
                const owner = 'user-123';
                const commentID = 'comment-123';

                await LikesTableTestHelper.addLike({ id: 'like-123', owner, commentID });

                // Action
                const like = await likeRepositoryPostgres.checkLike(commentID, owner);

                // Assert
                expect(like).toStrictEqual({
                    id: 'like-123',
                    owner,
                });
            });
        });
    });
});