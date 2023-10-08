class DeleteCommentUseCase {
    constructor({ commentRepository, threadRepository }) {
        this._commentRepository = commentRepository;
        this._threadRepository = threadRepository;
    }

    async execute(useCaseParams, userID) {
        await this._threadRepository.checkThreadIsExist(useCaseParams.threadID);
        await this._commentRepository.checkCommentIsExist(useCaseParams.commentID);
        await this._commentRepository.verifyCommentOwner(useCaseParams.commentID, userID);
        await this._commentRepository.deleteCommentByID(useCaseParams.commentID);
    }
}

module.exports = DeleteCommentUseCase;