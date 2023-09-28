const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddedThread = require("../../../Domains/threads/entities/AddedThread");
const AddThread = require("../../../Domains/threads/entities/AddThread");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const AddThreadUseCase = require("../AddThreadUseCase");

describe('AddThreadUseCase', () => {
    it ('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'title thread',
            body: 'body thread',
        };

        const accessToken = 'accessToken';
        const headerAuthorization = `Bearer ${accessToken}`;
        
        const expectedAddedThread = new AddedThread({
            id: 'thread-123',
            title: 'title thread',
            owner: 'user-123',
        });

        const mockThreadRepository = new ThreadRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();
        
        // mocking
        mockThreadRepository.addThread = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedThread))
        mockAuthenticationTokenManager.getTokenFromHeader = jest.fn().mockImplementation(() => Promise.resolve(accessToken));
        mockAuthenticationTokenManager.verifyAccessToken = jest.fn().mockImplementation(() => Promise.resolve());
        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve({ id: expectedAddedThread.owner }));

        // instance of use case
        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadRepository,
            authenticationTokenManager: mockAuthenticationTokenManager,
        })
        
        // action
        const addedThread = await addThreadUseCase.execute(useCasePayload, headerAuthorization);

        // assert
        // expect(addedThread).toStrictEqual(expectedAddedThread);
        expect(mockAuthenticationTokenManager.getTokenFromHeader).toBeCalledWith(headerAuthorization);
        expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(accessToken);
        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(accessToken);
        expect(mockThreadRepository.addThread).toBeCalledWith(new AddThread({
            title: useCasePayload.title,
            body: useCasePayload.body,
            owner: expectedAddedThread.owner,
        }));
        expect(addedThread).toEqual(expectedAddedThread);
    });
});