class DetailThreadUseCase {
    constructor({ threadRepository, commentRepository, replyRepository, likeRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
        this._likeRepository = likeRepository;
    }

    async execute(useCasePayload) {
        const { threadID } = useCasePayload;
        const thread = await this._threadRepository.getThreadByID(threadID);
        const comments = await this._commentRepository.getCommentsByThreadID(threadID);
        thread.comments = this._filterCommentIsDeleted(comments);

        const repliesComment = await this._replyRepository.getReplyCommentByThreadID(threadID);
        thread.comments = this._getRepliesComment(thread.comments, repliesComment);
        thread.comments = await this._getLikeCountComment(thread.comments);

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

    _getRepliesComment(comments, repliesComment) {
        return comments.map((comment) => {
            let commentReplies = repliesComment.filter((reply) => reply.comment_id === comment.id);
            commentReplies = commentReplies.map((reply) => {
                if (reply.is_delete) {
                    reply.content = '**balasan telah dihapus**';
                }

                return reply;
            });
            comment.replies = commentReplies;
            return comment;
        });
    }

    async _getLikeCountComment(comments) {
        for (let i = 0; i < comments.length; i++) {
            const likeCount = await this._likeRepository.getLikeCount(comments[i].id);
            comments[i].likeCount = likeCount;
        }

        return comments;
    }
}

module.exports = DetailThreadUseCase;