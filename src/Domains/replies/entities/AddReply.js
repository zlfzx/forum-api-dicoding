class AddReply {
    constructor(payload) {
        this._verifyPayload(payload);
 
        const { threadID, commentID, content, owner } = payload;
 
        this.threadID = threadID;
        this.commentID = commentID; 
        this.content = content;
        this.owner = owner;
    }
 
    _verifyPayload({ threadID, commentID, content, owner }) {
        if (!threadID || !commentID || !content || !owner) {
            throw new Error('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }
 
        if (typeof threadID !== 'string' || typeof commentID !== 'string' || typeof content !== 'string' || typeof owner !== 'string') {
            throw new Error('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddReply;