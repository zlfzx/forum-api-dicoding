const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const DeleteReplyUseCase = require("../DeleteReplyUseCase");

describe('DeleteReplyUseCase', () => {
    it ('should orchestrating the delete reply action correctly', async () => {
        // Arrange
        const useCaseParams = {
            threadID: 'thread-123',
            commentID: 'comment-123',
            replyID: 'reply-123',
        };

        const userID = 'user-123';
        const accessToken = 'accessToken';
        const headerAuthorization = `Bearer ${accessToken}`;

        // mock function
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        // mock implementation
        mockAuthenticationTokenManager.getTokenFromHeader = jest.fn().mockImplementation(() => Promise.resolve(accessToken));
        mockAuthenticationTokenManager.verifyAccessToken = jest.fn().mockImplementation(() => Promise.resolve());
        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve({ id: userID }));
        mockThreadRepository.getThreadByID = jest.fn(() => Promise.resolve());
        mockCommentRepository.checkCommentIsExist = jest.fn(() => Promise.resolve());
        mockReplyRepository.checkReplyIsExist = jest.fn(() => Promise.resolve());
        mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
        mockReplyRepository.deleteReplyByID = jest.fn(() => Promise.resolve());

        // create use case instance
        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository: mockReplyRepository,
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
            authenticationTokenManager: mockAuthenticationTokenManager,
        });

        // Action
        await deleteReplyUseCase.execute(useCaseParams, headerAuthorization);

        // Assert
        expect(mockAuthenticationTokenManager.getTokenFromHeader).toHaveBeenCalledWith(headerAuthorization);
        expect(mockAuthenticationTokenManager.verifyAccessToken).toHaveBeenCalledWith(accessToken);
        expect(mockAuthenticationTokenManager.decodePayload).toHaveBeenCalledWith(accessToken);
        expect(mockThreadRepository.getThreadByID).toHaveBeenCalledWith(useCaseParams.threadID);
        expect(mockCommentRepository.checkCommentIsExist).toHaveBeenCalledWith(useCaseParams.commentID);
        expect(mockReplyRepository.checkReplyIsExist).toHaveBeenCalledWith(useCaseParams.replyID);
        expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(useCaseParams.replyID, userID);
        expect(mockReplyRepository.deleteReplyByID).toHaveBeenCalledWith(useCaseParams.replyID);
    });
});