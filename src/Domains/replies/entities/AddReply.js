class AddReply {
    constructor(payload) {
        this._verifyPayload(payload);
 
        const { commentID, content, owner } = payload;
 
        this.commentID = commentID; 
        this.content = content;
        this.owner = owner;
    }
 
    _verifyPayload({ commentID, content, owner }) {
        if (!commentID || !content || !owner) {
            throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }
 
        if (typeof commentID !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
            throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddReply;