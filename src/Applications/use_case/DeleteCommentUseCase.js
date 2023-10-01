class DeleteCommentUseCase {
    constructor({ commentRepository, threadRepository, authenticationTokenManager }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
        this._authenticationTokenManager = authenticationTokenManager;
    }

    async execute(useCaseParams, headerAuth) {
        const accessToken = await this._authenticationTokenManager.getTokenFromHeader(headerAuth);
        await this._authenticationTokenManager.verifyAccessToken(accessToken);
        const { id } = await this._authenticationTokenManager.decodePayload(accessToken);
        await this._threadRepository.getThreadByID(useCaseParams.threadID);
        await this._commentRepository.checkCommentIsExist(useCaseParams.commentID);
        await this._commentRepository.verifyCommentOwner(useCaseParams.commentID, id);
        await this._commentRepository.deleteCommentByID(useCaseParams.commentID);
    }
}

module.exports = DeleteCommentUseCase;