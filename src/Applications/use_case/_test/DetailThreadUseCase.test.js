const CommentRepository = require("../../../Domains/comments/CommentRepository");
const DetailComment = require("../../../Domains/comments/entities/DetailComment");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const DetailReply = require("../../../Domains/replies/entities/DetailReply");
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
        const mockReplyRepository = new ReplyRepository();

        mockThreadRepository.getThreadByID = jest.fn(() => Promise.resolve(expectedDetailThread));
        mockCommentRepository.getCommentsByThreadID = jest.fn(() => Promise.resolve(expectedComments));
        mockReplyRepository.getReplyCommentByThreadID = jest.fn(() => Promise.resolve([]));

        const detailThreadUseCase = new DetailThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
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
            replyRepository: {},
        });

        const spyFilterCommentIsDeleted = jest.spyOn(detailThreadUseCase, '_filterCommentIsDeleted');

        // Action
        await detailThreadUseCase._filterCommentIsDeleted(retrivedComments);

        // Assert
        expect(spyFilterCommentIsDeleted).toBeCalledWith(retrivedComments);
        expect(spyFilterCommentIsDeleted).toReturnWith(expectedComments);
    });

    it ('should orchestrating the detail thread action correctly when comment is not deleted', async () => {
        // Arrange
        const retrivedComments = [
            new DetailComment({
                id: 'comment-123',
                threadID: 'thread-123',
                username: 'username',
                date: 'date',
                content: 'comment content',
                is_delete: false,
            }),
            new DetailComment({
                id: 'comment-456',
                threadID: 'thread-123',
                username: 'username',
                date: 'date',
                content: 'comment content',
                is_delete: false,
            }),
        ]

        const expectedComments = retrivedComments;

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

    it ('should orchestrating the detail thread action correctly when reply comment is deleted', async () => {
        // Arrange
        const comments = [
            new DetailComment({
                id: 'comment-123',
                threadID: 'thread-123',
                username: 'username',
                date: 'date',
                content: 'comment content',
                is_delete: false,
            }),
            new DetailComment({
                id: 'comment-456',
                threadID: 'thread-123',
                username: 'username',
                date: 'date',
                content: 'comment content',
                is_delete: false,
            }),
        ]
        const retrivedReplies = [
            new DetailReply({
                id: 'reply-123',
                comment_id: 'comment-123',
                username: 'username',
                date: 'date',
                content: 'reply content',
                is_delete: true,

            }),
            new DetailReply({
                id: 'reply-456',
                comment_id: 'comment-123',
                username: 'username',
                date: 'date',
                content: 'reply content',
                is_delete: true,
            }),
        ]

        const expectedReplies = retrivedReplies.map((reply) => {
            reply.content = '**balasan telah dihapus**';
            return reply;
        });

        const expectedComments = comments.map((comment) => {
            comment.replies = expectedReplies.filter((reply) => reply.comment_id === comment.id);
            return new DetailComment(comment);
        });

        const detailThreadUseCase = new DetailThreadUseCase({
            threadRepository: {},
            commentRepository: {},
            replyRepository: {},
        });

        const spyGetRepliesComment = jest.spyOn(detailThreadUseCase, '_getRepliesComment');

        // Action
        await detailThreadUseCase._getRepliesComment(comments, retrivedReplies);

        // Assert
        expect(spyGetRepliesComment).toBeCalledWith(comments, retrivedReplies);
        expect(spyGetRepliesComment).toReturnWith(expectedComments);
    })

    it ('should orchestrating the detail thread action correctly when reply is not deleted', async () => {
        // Arrange
        const comments = [
            new DetailComment({
                id: 'comment-123',
                threadID: 'thread-123',
                username: 'username',
                date: 'date',
                content: 'comment content',
                is_delete: false,
            }),
            new DetailComment({
                id: 'comment-456',
                threadID: 'thread-123',
                username: 'username',
                date: 'date',
                content: 'comment content',
                is_delete: false,
            }),
        ]
        const retrivedReplies = [
            new DetailReply({
                id: 'reply-123',
                comment_id: 'comment-123',
                username: 'username',
                date: 'date',
                content: 'reply content',
                is_delete: false,

            }),
            new DetailReply({
                id: 'reply-456',
                comment_id: 'comment-123',
                username: 'username',
                date: 'date',
                content: 'reply content',
                is_delete: false,
            }),
        ]

        const expectedReplies = retrivedReplies;

        const expectedComments = comments.map((comment) => {
            comment.replies = expectedReplies.filter((reply) => reply.comment_id === comment.id);
            return comment;
        })

        const detailThreadUseCase = new DetailThreadUseCase({
            threadRepository: {},
            commentRepository: {},
            replyRepository: {},
        });

        const spyGetRepliesComment = jest.spyOn(detailThreadUseCase, '_getRepliesComment');

        // Action
        await detailThreadUseCase._getRepliesComment(comments, retrivedReplies);

        // Assert
        expect(spyGetRepliesComment).toBeCalledWith(comments, retrivedReplies);
        expect(spyGetRepliesComment).toReturnWith(expectedComments);
    })
});