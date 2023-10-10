const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const AddReply = require("../../../Domains/replies/entities/AddReply");
const AddedReply = require("../../../Domains/replies/entities/AddedReply");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddReplyUseCase = require("../AddReplyUseCase");

describe('AddReplyUseCase', () => {
    it ('should orchestrating the add reply action correctly', async () => {
        // Arrange
        const useCaseParams = {
            threadID: 'thread-123',
            commentID: 'comment-123',
        };
        const useCasePayload = {
            content: 'reply content',
        };
        const userID = 'user-123';

        const mockAddedReply = new AddedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: userID,
        });

        const mockReplyRepository = new ReplyRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        
        // mocking
        mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(mockAddedReply))
        mockThreadRepository.checkThreadIsExist = jest.fn().mockImplementation(() => Promise.resolve());
        mockCommentRepository.checkCommentIsExist = jest.fn().mockImplementation(() => Promise.resolve());

        // instance of use case
        const addReplyUseCase = new AddReplyUseCase({
            replyRepository: mockReplyRepository,
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        })
        
        // action
        const addedReply = await addReplyUseCase.execute(useCasePayload, useCaseParams, userID);

        // assert
        expect(mockThreadRepository.checkThreadIsExist).toBeCalledWith(useCaseParams.threadID);
        expect(mockCommentRepository.checkCommentIsExist).toBeCalledWith(useCaseParams.commentID);
        expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
            commentID: useCaseParams.commentID,
            content: useCasePayload.content,
            owner: userID,
        }));
        expect(addedReply).toStrictEqual(new AddedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: userID,
        }));
    });
});