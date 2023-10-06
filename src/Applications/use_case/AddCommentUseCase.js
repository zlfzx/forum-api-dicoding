const AddComment = require("../../Domains/comments/entities/AddComment");

class AddCommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload, useCaseParams, userID) {
        await this._threadRepository.getThreadByID(useCaseParams.threadID);
        return await this._commentRepository.addComment(new AddComment({
            ...useCasePayload,
            threadID: useCaseParams.threadID,
            owner: userID,
        }));
    }
}

module.exports = AddCommentUseCase;