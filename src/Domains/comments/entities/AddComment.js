class AddComment {
    constructor(payload) {
        this._verifyPayload(payload);

        const { content, threadID, owner } = payload;

        this.content = content;
        this.threadID = threadID;
        this.owner = owner;
    }

    _verifyPayload({ content, threadID, owner }) {
        if (!content || !threadID || !owner) {
            throw new Error('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof content !== 'string' || typeof threadID !== 'string' || typeof owner !== 'string') {
            throw new Error('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddComment;