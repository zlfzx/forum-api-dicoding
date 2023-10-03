class DetailComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, username, date, content, is_delete } = payload;

        this.id = id;
        this.username = username;
        this.date = date;
        this.content = content;
        this.is_delete = is_delete;
    }

    _verifyPayload({ id, username, date, content, is_delete }) {
        if (!id || !username || !date || !content || is_delete === undefined) {
            throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof id !== 'string' || typeof username !== 'string' || typeof date !== 'string' || typeof content !== 'string' || typeof is_delete !== 'boolean') {
            throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DetailComment;