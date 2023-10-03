class DetailThreadUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async execute(useCasePayload) {
        const { threadID } = useCasePayload;
        const thread = await this._threadRepository.getThreadByID(threadID);
        const comments = await this._commentRepository.getCommentsByThreadID(threadID);
        thread.comments = this._filterCommentIsDeleted(comments);

        return thread;
    }

    _filterCommentIsDeleted(comments) {
        return comments.map((comment) => {
            if (comment.is_delete) {
                comment.content = '**komentar telah dihapus**';
            }

            return comment;
        });
    }
}

module.exports = DetailThreadUseCase;