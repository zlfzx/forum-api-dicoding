const AddComment = require("../AddComment");

describe('AddComment', () => {
    it ('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'comment content',
        };

        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it ('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            content: 123,
            threadID: {},
            owner: [],
        };

        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it ('should create addComment object correctly', () => {
        // Arrange
        const payload = {
            content: 'comment content',
            threadID: 'thread-123',
            owner: 'user-123',
        };

        // Action
        const { content, threadID, owner } = new AddComment(payload);

        // Assert
        expect(content).toEqual(payload.content);
        expect(threadID).toEqual(payload.threadID);
        expect(owner).toEqual(payload.owner);
    });
});