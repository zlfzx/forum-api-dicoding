const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe('ThreadRepositoryPostgres', () => {
    it ('should be instance of ThreadRepository domain', () => {
        // Arrange
        const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});

        // Action & Assert
        expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
    });

    describe('behavior test', () => {
        afterEach(async () => {
            await ThreadsTableTestHelper.cleanTable();
            await UsersTableTestHelper.cleanTable();
        })
    
        afterAll(async () => {
            await pool.end();
        })

        describe('addThread function', () => {
            it ('should persist add thread correctly', async () => {
                // Arrange

                // arrange for add user
                await UsersTableTestHelper.addUser({
                    id: 'user-123',
                    username: 'usertest',
                    password: 'secret',
                    fullname: 'User Test'
                });

                const fakeIDGenerator = () => '123';

                // arrange for add thread
                const addThread = new AddThread({
                    title: 'title thread',
                    body: 'body thread',
                    owner: 'user-123',
                });

                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIDGenerator);

                // action
                const addedThread = await threadRepositoryPostgres.addThread(addThread)

                // assert
                const threads = await ThreadsTableTestHelper.findThreadByID(addedThread.id);
                expect(threads).toHaveLength(1);
                expect(threads).toStrictEqual([{
                    id: 'thread-123',
                    title: 'title thread',
                    body: 'body thread',
                    owner: 'user-123',
                }]);
                expect(addedThread).toStrictEqual({
                    id: 'thread-123',
                    title: 'title thread',
                    body: 'body thread',
                    owner: 'user-123',
                });
            });
        });

        describe('getThreadByID function', () => {
            it ('should get thread by id correctly', async () => {
                // Arrange
                const userID = 'user-123';
                const username = 'usertest';
                const threadID = 'thread-123';
                const addThread = {
                    id: threadID,
                    title: 'title thread',
                    body: 'body thread',
                    owner: userID,
                };
                const expectedThread = {
                    id: threadID,
                    title: 'title thread',
                    body: 'body thread',
                    username: username,
                };

                await UsersTableTestHelper.addUser({ id: userID, username: username });
                await ThreadsTableTestHelper.addThread(addThread);

                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

                // Action
                const thread = await threadRepositoryPostgres.getThreadByID(threadID);
                expectedThread.date = thread.date;

                // Assert
                expect(thread).toStrictEqual(expectedThread);
            });

            it ('should return NotFoundError when thread not found', async () => {
                // Arrange
                const userID = 'user-123';
                const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
                await UsersTableTestHelper.addUser({ id: userID, username: 'usertest' });
                await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userID })

                // Action & Assert
                expect(threadRepositoryPostgres.getThreadByID('thread-456')).rejects.toThrowError(NotFoundError);
            });
        });
    })
});