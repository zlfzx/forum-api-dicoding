const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const ThreadRepositoryPostgres = require("../ThreadRepositoryPostgres");
const pool = require("../../database/postgres/pool");
const AddThread = require("../../../Domains/threads/entities/AddThread");

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
            });
        })
    })
});