const AddedComment = require("../AddedComment");

describe('AddedComment entities', () => {
    it('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'comment content',
        };
 
        // Action and Assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            content: {},
            owner: [],
        };
 
        // Action and Assert
        expect(() => new AddedComment(payload)).toThrowError('ADDED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create addedComment object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'comment content',
            owner: 'user-123',
        };
 
        // Action
        const { id, content, owner } = new AddedComment(payload);
 
        // Assert
        expect(id).toEqual(payload.id);
        expect(content).toEqual(payload.content);
        expect(owner).toEqual(payload.owner);
    });
});