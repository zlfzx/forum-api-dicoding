const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const AddReply = require("../../../Domains/replies/entities/AddReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AuthenticationTokenManager = require("../../security/AuthenticationTokenManager");
const AddReplyUseCase = require("../AddReplyUseCase");

describe('AddReplyUseCase', () => {
    it ('should orchestrating the add reply action correctly', async () => {
        // Arrange
        const useCaseParams = {
            threadID: 'thread-123',
            commentID: 'comment-123',
        };
        const useCasePayload = {
            content: 'reply content',
        };

        const expectedAddedReply = new AddedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: 'user-123',
        });

        const accessToken = 'accessToken';
        const headerAuthorization = `Bearer ${accessToken}`;

        const mockReplyRepository = new ReplyRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockAuthenticationTokenManager = new AuthenticationTokenManager();
        
        // mocking
        mockAuthenticationTokenManager.getTokenFromHeader = jest.fn().mockImplementation(() => Promise.resolve(accessToken));
        mockAuthenticationTokenManager.verifyAccessToken = jest.fn().mockImplementation(() => Promise.resolve());
        mockAuthenticationTokenManager.decodePayload = jest.fn().mockImplementation(() => Promise.resolve({ id: expectedAddedReply.owner }));
        mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedReply))
        mockThreadRepository.getThreadByID = jest.fn().mockImplementation(() => Promise.resolve());
        // mockCommentRepository.getCommentByID = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.checkCommentIsExist = jest.fn().mockImplementation(() => Promise.resolve());

        // instance of use case
        const addReplyUseCase = new AddReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            authenticationTokenManager: mockAuthenticationTokenManager,
        })
        
        // action
        const addedReply = await addReplyUseCase.execute(useCasePayload, useCaseParams, headerAuthorization);

        // assert
        expect(mockAuthenticationTokenManager.getTokenFromHeader).toBeCalledWith(headerAuthorization);
        expect(mockAuthenticationTokenManager.verifyAccessToken).toBeCalledWith(accessToken);
        expect(mockAuthenticationTokenManager.decodePayload).toBeCalledWith(accessToken);
        expect(addedReply).toStrictEqual(expectedAddedReply);
        expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
            threadID: useCaseParams.threadID,
            commentID: useCaseParams.commentID,
            content: useCasePayload.content,
            owner: expectedAddedReply.owner,
        }));
    });
});