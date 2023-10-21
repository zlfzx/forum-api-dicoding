const DetailComment = require("../DetailComment");

describe('DetailComment entities', () => {
    it ('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'comment content',
        };

        // Action and Assert
        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it ('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            username: 123,
            date: {},
            content: {},
            is_delete: 'true',
            likeCount: '0',
        };

        // Action and Assert
        expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it ('should create detailComment object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            username: 'username',
            date: 'date',
            content: 'comment content',
            is_delete: false,
            likeCount: 0,
        };

        // Action
        const { id, username, date, content, is_delete, likeCount } = new DetailComment(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(username).toEqual(payload.username);
        expect(date).toEqual(payload.date);
        expect(content).toEqual(payload.content);
        expect(is_delete).toEqual(payload.is_delete);
        expect(likeCount).toEqual(payload.likeCount);
    });
});