const AddReply = require("../../Domains/replies/entities/AddReply");

class AddReplyUseCase {
    constructor({ replyRepository, threadRepository, commentRepository, authenticationTokenManager }) {
        this._replyRepository = replyRepository;
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._authenticationTokenManager = authenticationTokenManager;
    }

    async execute(useCasePayload, useCaseParams, userID) {
        const { threadID, commentID } = useCaseParams;
        const { content } = useCasePayload;

        await this._threadRepository.checkThreadIsExist(threadID);
        await this._commentRepository.checkCommentIsExist(commentID);

        return await this._replyRepository.addReply(new AddReply({
            commentID: commentID,
            content: content,
            owner: userID,
        }));
    }
}

module.exports = AddReplyUseCase;