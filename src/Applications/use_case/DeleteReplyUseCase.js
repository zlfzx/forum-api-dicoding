class DeleteReplyUseCase {
    constructor({ replyRepository, commentRepository, threadRepository }) {
        this._replyRepository = replyRepository;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload, userID) {
        const { threadID, commentID, replyID } = useCasePayload;
        await this._threadRepository.getThreadByID(threadID);
        await this._commentRepository.checkCommentIsExist(commentID);
        await this._replyRepository.checkReplyIsExist(replyID);
        await this._replyRepository.verifyReplyOwner(replyID, userID);
        await this._replyRepository.deleteReplyByID(replyID);
    }
}

module.exports = DeleteReplyUseCase;