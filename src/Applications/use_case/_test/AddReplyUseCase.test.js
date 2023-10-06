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

        const expectedAddedReply = new AddedReply({
            id: 'reply-123',
            content: useCasePayload.content,
            owner: 'user-123',
        });

        const userID = 'user-123';

        const mockReplyRepository = new ReplyRepository();
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        
        // mocking
        mockReplyRepository.addReply = jest.fn().mockImplementation(() => Promise.resolve(expectedAddedReply))
        mockThreadRepository.getThreadByID = jest.fn().mockImplementation(() => Promise.resolve());
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
        expect(addedReply).toStrictEqual(expectedAddedReply);
        expect(mockReplyRepository.addReply).toBeCalledWith(new AddReply({
            threadID: useCaseParams.threadID,
            commentID: useCaseParams.commentID,
            content: useCasePayload.content,
            owner: expectedAddedReply.owner,
        }));
    });
});