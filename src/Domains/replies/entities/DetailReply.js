class DetailReply {
    constructor(payload) {
        this._verifyPayload(payload);

        const { id, comment_id, username, date, content, is_delete } = payload;

        this.id = id;
        this.comment_id = comment_id;
        this.username = username;
        this.date = date;
        this.content = content;
        this.is_delete = is_delete;
    }

    _verifyPayload({ id, comment_id, username, date, content, is_delete }) {
        if (!id || !comment_id || !username || !date || !content || is_delete === undefined) {
            throw new Error('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (
            typeof id !== 'string' ||
            typeof comment_id !== 'string' ||
            typeof username !== 'string' ||
            typeof date !== 'string' ||
            typeof content !== 'string' ||
            typeof is_delete !== 'boolean'
        ) {
            throw new Error('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = DetailReply;