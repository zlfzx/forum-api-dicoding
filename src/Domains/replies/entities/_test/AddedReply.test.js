const AddedReply = require("../AddedReply");

describe('AddedReply entities', () => {
    it ('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'reply content',
        };

        // Action and Assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it ('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            content: {},
            owner: [],
        };

        // Action and Assert
        expect(() => new AddedReply(payload)).toThrowError('ADDED_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it ('should create addedReply object correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            content: 'reply content',
            owner: 'user-123',
        };

        // Action
        const { id, content, owner } = new AddedReply(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
    });
});