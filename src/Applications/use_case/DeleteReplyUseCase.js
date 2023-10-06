class DeleteReplyUseCase {
    constructor({ replyRepository, commentRepository, threadRepository, authenticationTokenManager }) {
        this._replyRepository = replyRepository;
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
        this._authenticationTokenManager = authenticationTokenManager;
    }

    async execute(useCasePayload, headerAuthorization) {
        const { threadID, commentID, replyID } = useCasePayload;
        const accessToken = await this._authenticationTokenManager.getTokenFromHeader(headerAuthorization);
        await this._authenticationTokenManager.verifyAccessToken(accessToken);
        const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
        await this._threadRepository.getThreadByID(threadID);
        await this._commentRepository.checkCommentIsExist(commentID);
        await this._replyRepository.checkReplyIsExist(replyID);
        await this._replyRepository.verifyReplyOwner(replyID, owner);
        await this._replyRepository.deleteReplyByID(replyID);
    }
}

module.exports = DeleteReplyUseCase;