const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe('DeleteCommentUseCase', () => {
    it ('should orchestrating the delete comment action correctly', async () => {
        // Arrange
        const useCaseParams = {
            threadID: 'thread-123',
            commentID: 'comment-123',
        };

        const userID = 'user-123';
        const accessToken = 'accessToken';
        const headerAuthorization = `Bearer ${accessToken}`;

        // mock function
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        // mock implementation
        mockAuthenticationTokenManager.getTokenFromHeader = jest.fn().mockImplementation(() => Promise.resolve(accessToken));
        mockAuthenticationTokenManager.verifyAccessToken = jest.fn().mockImplementation(() => Promise.resolve());
        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve({ id: userID }));
        mockThreadRepository.getThreadByID = jest.fn(() => Promise.resolve());
        mockCommentRepository.checkCommentIsExist = jest.fn(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
        mockCommentRepository.deleteCommentByID = jest.fn(() => Promise.resolve());
        
        // create use case instance
        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
            authenticationTokenManager: mockAuthenticationTokenManager,
        });

        // Action
        await deleteCommentUseCase.execute(useCaseParams, headerAuthorization);

        // Assert
        expect(mockAuthenticationTokenManager.getTokenFromHeader).toHaveBeenCalledWith(headerAuthorization);
        expect(mockAuthenticationTokenManager.verifyAccessToken).toHaveBeenCalledWith(accessToken);
        expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(accessToken);
        // expect(mockAuthenticationTokenManager.decodePayload).toReturnWith(Promise.resolve({ id: userID }));
        expect(mockThreadRepository.getThreadByID).toHaveBeenCalledWith(useCaseParams.threadID);
        expect(mockCommentRepository.checkCommentIsExist).toHaveBeenCalledWith(useCaseParams.commentID);
        expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(useCaseParams.commentID, userID);
        expect(mockCommentRepository.deleteCommentByID).toHaveBeenCalledWith(useCaseParams.commentID);
        
    });
});