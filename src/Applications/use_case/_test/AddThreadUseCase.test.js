const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const AddThreadUseCase = require("../AddThreadUseCase");

describe('AddThreadUseCase', () => {
    it ('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'title thread',
            body: 'body thread',
        };
        
        const userID = 'user-123';
        const expectedAddedThread = new AddedThread({
            id: 'thread-123',
            title: 'title thread',
            owner: 'user-123',
        });

        const mockThreadRepository = new ThreadRepository();
        
        // mocking
        mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedThread))

        // instance of use case
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
        })
        
        // action
        const addedThread = await addThreadUseCase.execute(useCasePayload, userID);

        // assert
        expect(addedThread).toStrictEqual(expectedAddedThread);
        expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: expectedAddedThread.owner,
        }));
    });
});