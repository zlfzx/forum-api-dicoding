const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const AddCommentUseCase = require("../AddCommentUseCase");

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'comment content',
        };

        const useCaseParams = {
            threadID: 'thread-123',
        };

        const accessToken = 'accessToken';
        const headerAuthorization = `Bearer ${accessToken}`;

        const expectedAddedComment = new AddedComment({
            id: 'comment-123',
            content: 'comment content',
            owner: 'user-123',
        });

        const mockCommentRepository = new CommentRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();

        // mock
        mockCommentRepository.addComment = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedComment));
        mockThreadRepository.getThreadByID = jest.fn().mockImplementation(() => Promise.resolve());
        mockAuthenticationTokenManager.getTokenFromHeader = jest.fn().mockImplementation(() => Promise.resolve(accessToken));
        mockAuthenticationTokenManager.verifyAccessToken = jest.fn().mockImplementation(() => Promise.resolve());
        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve({ id: expectedAddedComment.owner }));
 
        // instance of use case
        const addCommentUseCase = new AddCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            authenticationTokenManager: mockAuthenticationTokenManager,
        });
 
        // Action
        const addedComment = await addCommentUseCase.execute(useCasePayload, useCaseParams, headerAuthorization);
        
        // Assert
        expect(mockAuthenticationTokenManager.getTokenFromHeader).toBeCalledWith(headerAuthorization);
        expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(accessToken);
        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(accessToken);
        expect(mockThreadRepository.getThreadByID).toBeCalledWith(useCaseParams.threadID);
        expect(addedComment).toStrictEqual(expectedAddedComment);
        expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
            content: useCasePayload.content,
            threadID: useCaseParams.threadID,
            owner: expectedAddedComment.owner,
        }));
    });
});