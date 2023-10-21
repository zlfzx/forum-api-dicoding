const NewLike = require("../NewLike");

describe('NewLike entities', () => {
    it ('should throw error when payload does not contain needed property', () => {
        // Arrange
        const payload = {
            owner: 'user-123',
        };

        // Action and Assert
        expect(() => new NewLike(payload)).toThrowError('NEW_LIKE.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it ('should throw error when payload does not meet data type specification', () => {
        // Arrange
        const payload = {
            owner: 123,
            commentID: 123,
        };

        // Action and Assert
        expect(() => new NewLike(payload)).toThrowError('NEW_LIKE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it ('should create newLike object correctly', () => {
        // Arrange
        const payload = {
            owner: 'user-123',
            commentID: 'comment-123',
        };

        // Action
        const newLike = new NewLike(payload);

        // Assert
        expect(newLike).toBeInstanceOf(NewLike);
        expect(newLike.owner).toEqual(payload.owner);
        expect(newLike.commentID).toEqual(payload.commentID);
    });
});