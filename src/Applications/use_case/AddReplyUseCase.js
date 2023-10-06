const AddReply = require("../../Domains/replies/entities/AddReply");

class AddReplyUseCase {
    constructor({ replyRepository, threadRepository, commentRepository, authenticationTokenManager }) {
        this._replyRepository = replyRepository;
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._authenticationTokenManager = authenticationTokenManager;
    }

    async execute(useCasePayload, useCaseParams, headerAuthorization) {
        const { threadID, commentID } = useCaseParams;
        const { content } = useCasePayload;

        const accessToken = await this._authenticationTokenManager.getTokenFromHeader(headerAuthorization);
        await this._authenticationTokenManager.verifyAccessToken(accessToken);
        const { id: owner } = await this._authenticationTokenManager.decodePayload(accessToken);

        await this._threadRepository.getThreadByID(threadID);
        await this._commentRepository.checkCommentIsExist(commentID);

        return await this._replyRepository.addReply(new AddReply({
            threadID: threadID,
            commentID: commentID,
            content: content,
            owner: owner,
        }));
    }
}

module.exports = AddReplyUseCase;