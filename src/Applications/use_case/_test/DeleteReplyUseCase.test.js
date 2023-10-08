const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
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

        // mock function
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        // mock implementation
        mockThreadRepository.checkThreadIsExist = jest.fn(() => Promise.resolve());
        mockCommentRepository.checkCommentIsExist = jest.fn(() => Promise.resolve());
        mockReplyRepository.checkReplyIsExist = jest.fn(() => Promise.resolve());
        mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
        mockReplyRepository.deleteReplyByID = jest.fn(() => Promise.resolve());

        // create use case instance
        const deleteReplyUseCase = new DeleteReplyUseCase({
            replyRepository: mockReplyRepository,
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // Action
        await deleteReplyUseCase.execute(useCaseParams, userID);

        // Assert
        expect(mockThreadRepository.checkThreadIsExist).toHaveBeenCalledWith(useCaseParams.threadID);
        expect(mockCommentRepository.checkCommentIsExist).toHaveBeenCalledWith(useCaseParams.commentID);
        expect(mockReplyRepository.checkReplyIsExist).toHaveBeenCalledWith(useCaseParams.replyID);
        expect(mockReplyRepository.verifyReplyOwner).toHaveBeenCalledWith(useCaseParams.replyID, userID);
        expect(mockReplyRepository.deleteReplyByID).toHaveBeenCalledWith(useCaseParams.replyID);
    });
});