const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DeleteCommentUseCase = require("../DeleteCommentUseCase");

describe('DeleteCommentUseCase', () => {
    it ('should orchestrating the delete comment action correctly', async () => {
        // Arrange
        const useCaseParams = {
            threadID: 'thread-123',
            commentID: 'comment-123',
        };

        const userID = 'user-123';

        // mock function
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        // mock implementation
        mockThreadRepository.getThreadByID = jest.fn(() => Promise.resolve());
        mockCommentRepository.checkCommentIsExist = jest.fn(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
        mockCommentRepository.deleteCommentByID = jest.fn(() => Promise.resolve());
        
        // create use case instance
        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
            threadRepository: mockThreadRepository,
        });

        // Action
        await deleteCommentUseCase.execute(useCaseParams, userID);

        // Assert
        expect(mockThreadRepository.getThreadByID).toHaveBeenCalledWith(useCaseParams.threadID);
        expect(mockCommentRepository.checkCommentIsExist).toHaveBeenCalledWith(useCaseParams.commentID);
        expect(mockCommentRepository.verifyCommentOwner).toHaveBeenCalledWith(useCaseParams.commentID, userID);
        expect(mockCommentRepository.deleteCommentByID).toHaveBeenCalledWith(useCaseParams.commentID);
        
    });
});