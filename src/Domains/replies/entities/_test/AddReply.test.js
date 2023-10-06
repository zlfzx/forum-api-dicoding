const AddReply = require("../AddReply");

describe('AddReply entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'reply content',
        };
 
        // Action and Assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            threadID: 123,
            commentID: 123,
            content: {},
            owner: [],
        };
 
        // Action and Assert
        expect(() => new AddReply(payload)).toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addReply object correctly', () => {
        // Arrange
        const payload = {
            threadID: 'thread-123',
            commentID: 'comment-123',
            content: 'reply content',
            owner: 'user-123',
        };
 
        // Action
        const { commentID, content, owner } = new AddReply(payload);
 
        // Assert
        expect(commentID).toEqual(payload.commentID);
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
    });
});