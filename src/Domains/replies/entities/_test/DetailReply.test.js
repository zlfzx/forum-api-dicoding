const DetailReply = require("../DetailReply");

describe('a DetailReply entities', () => {
    it ('should throw error when payload not contain needed property', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
        };

        // Action & Assert
        expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    })

    it ('should throw error when payload not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 123,
            comment_id: 123,
            username: {},
            date: {},
            content: {},
            is_delete: 'true',
        };

        // Action & Assert
        expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    })

    it ('should create DetailReply object correctly', () => {
        // Arrange
        const payload = {
            id: 'reply-123',
            comment_id: 'comment-123',
            username: 'user-123',
            date: '2021-08-08T07:22:01.000Z',
            content: 'reply content',
            is_delete: false,
        };

        // Action
        const { id, comment_id, username, date, content, is_delete } = new DetailReply(payload);

        // Assert
        expect(id).toEqual(payload.id);
        expect(comment_id).toEqual(payload.comment_id);
        expect(username).toEqual(payload.username);
        expect(date).toEqual(payload.date);
        expect(content).toEqual(payload.content);
        expect(is_delete).toEqual(payload.is_delete);
    });
});