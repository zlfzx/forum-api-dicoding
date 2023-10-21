class DetailComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, username, date, content, is_delete, likeCount, replies } = payload;

        this.id = id;
        this.username = username;
        this.date = date;
        this.content = content;
        this.is_delete = is_delete;
        this.likeCount = likeCount;
        this.replies = replies;
    }

    _verifyPayload({ id, username, date, content, is_delete, likeCount }) {
        if (!id || !username || !date || !content || is_delete === undefined || likeCount === undefined) {
            throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof is_delete !== 'boolean' || typeof likeCount !== 'number') {
            throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DetailComment;