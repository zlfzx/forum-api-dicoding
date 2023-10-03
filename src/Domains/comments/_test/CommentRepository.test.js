const CommentRepository = require('../CommentRepository');

describe('CommentRepository interface', () => {
    it ('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const commentRepository = new CommentRepository();

        // Action and Assert
        await expect(commentRepository.addComment({})).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.checkCommentIsExist('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.verifyCommentOwner('', '')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.deleteCommentByID('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.getCommentsByThreadID('')).rejects.toThrowError('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    })
});