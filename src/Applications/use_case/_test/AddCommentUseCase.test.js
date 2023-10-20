const CommentRepository = require("../../../Domains/comments/CommentRepository");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const AddedComment = require("../../../Domains/comments/entities/AddedComment");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddCommentUseCase = require("../AddCommentUseCase");

describe('AddCommentUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'comment content',
        };
        const useCaseParams = {
            threadID: 'thread-123',
        };
        const userID = 'user-123';

        const mockAddedComment = new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: userID,
        });

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        // mock
        mockThreadRepository.checkThreadIsExist = jest.fn(() => Promise.resolve());
        mockCommentRepository.addComment = jest.fn(() => Promise.resolve(mockAddedComment));

        // instance of use case
        const addCommentUseCase = new AddCommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
        });
 
        // Action
        const addedComment = await addCommentUseCase.execute(useCasePayload, useCaseParams, userID);
        
        // Assert
        expect(mockThreadRepository.checkThreadIsExist).toBeCalledWith(useCaseParams.threadID);
        expect(mockCommentRepository.addComment).toBeCalledWith(new AddComment({
            content: useCasePayload.content,
            threadID: useCaseParams.threadID,
            owner: userID,
        }));
        expect(addedComment).toStrictEqual(new AddedComment({
            id: 'comment-123',
            content: useCasePayload.content,
            owner: userID,
        }));
    });
});