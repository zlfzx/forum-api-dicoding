class NewLike {
    constructor(payload) {
        this._verifyPayload(payload);
 
        const { commentID, owner } = payload;
 
        this.commentID = commentID;
        this.owner = owner;
    }
    
    _verifyPayload({ commentID, owner }) {
        if (!commentID || !owner) {
            throw new Error('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
        }
 
        if (typeof commentID !== 'string' || typeof owner !== 'string') {
            throw new Error('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = NewLike;