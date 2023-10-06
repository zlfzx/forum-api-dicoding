const ReplyRepository = require("../ReplyRepository");

describe('ReplyRepository', () => {
    describe('behavior test', () => {
        it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const replyRepository = new ReplyRepository();
     
        // Action and Assert
        await expect(replyRepository.addReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(replyRepository.getReplyCommentByThreadID('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(replyRepository.checkReplyIsExist('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(replyRepository.verifyReplyOwner('', '')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(replyRepository.deleteReplyByID('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        });
    });
});