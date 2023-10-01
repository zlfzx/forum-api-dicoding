const AddComment = require("../../Domains/comments/entities/AddComment");

class AddCommentUseCase {
    constructor({ threadRepository, commentRepository, authenticationTokenManager }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._authenticationTokenManager = authenticationTokenManager;
    }

    async execute(useCasePayload, useCaseParams, headerAuth) {
        const accessToken = await this._authenticationTokenManager.getTokenFromHeader(headerAuth);
        await this._authenticationTokenManager.verifyAccessToken(accessToken);
        const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);
        await this._threadRepository.getThreadByID(useCaseParams.threadID);

        const addedComment = await this._commentRepository.addComment(new AddComment({
            ...useCasePayload,
            threadID: useCaseParams.threadID,
            owner: owner,
        }));
        return addedComment;
    }
}

module.exports = AddCommentUseCase;