const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const DetailThread = require("../../../Domains/threads/entities/DetailThread");
const DetailThreadUseCase = require("../DetailThreadUseCase");

describe('DetailThreadUseCase', () => {
    it ('should orchestrating the detail thread action correctly', async () => {
        // Arrange
        const useCaseParams = {
            threadID: 'thread-123',
        };

        const expectedDetailThread = new DetailThread({
            id: 'thread-123',
            title: 'title thread',
            body: 'body thread',
            date: 'date',
            username: 'username',
            comments: [],
        });

        const expectedComments = [
            new DetailComment({
                id: 'comment-123',
                username: 'username',
                date: 'date',
                content: 'comment content',
                is_delete: false,
            }),
            new DetailComment({
                id: 'comment-456',
                username: 'username',
                date: 'date',
                content: 'comment content',
                is_delete: false,
            }),
        ]

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        mockThreadRepository.getThreadByID = jest.fn(() => Promise.resolve(expectedDetailThread));
        mockCommentRepository.getCommentsByThreadID = jest.fn(() => Promise.resolve(expectedComments));

        const detailThreadUseCase = new DetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });
        
        detailThreadUseCase._filterCommentIsDeleted = jest.fn().mockImplementation(() => expectedComments)

        // Action
        const detailThread = await detailThreadUseCase.execute(useCaseParams);

        // Assert
        expect(mockThreadRepository.getThreadByID).toBeCalledWith(useCaseParams.threadID);
        expect(mockCommentRepository.getCommentsByThreadID).toBeCalledWith(useCaseParams.threadID);
        expect(detailThreadUseCase._filterCommentIsDeleted).toBeCalledWith(expectedComments);
        expect(detailThread).toStrictEqual(new DetailThread({
            ...expectedDetailThread,
            comments: expectedComments,
        }));
    });

    it ('should orchestrating the detail thread action correctly when comment is deleted', async () => {
        // Arrange
        const retrivedComments = [
            new DetailComment({
                id: 'comment-123',
                threadID: 'thread-123',
                username: 'username',
                date: 'date',
                content: 'comment content',
                is_delete: true,

            }),
            new DetailComment({
                id: 'comment-456',
                threadID: 'thread-123',
                username: 'username',
                date: 'date',
                content: 'comment content',
                is_delete: true,
            }),
        ]

        const expectedComments = retrivedComments.map((comment) => {
            comment.content = '**komentar telah dihapus**';
            return comment;
        });

        const detailThreadUseCase = new DetailThreadUseCase({
            threadRepository: {},
            commentRepository: {},
        });

        const spyFilterCommentIsDeleted = jest.spyOn(detailThreadUseCase, '_filterCommentIsDeleted');

        // Action
        await detailThreadUseCase._filterCommentIsDeleted(retrivedComments);

        // Assert
        expect(spyFilterCommentIsDeleted).toBeCalledWith(retrivedComments);
        expect(spyFilterCommentIsDeleted).toReturnWith(expectedComments);
    });
});