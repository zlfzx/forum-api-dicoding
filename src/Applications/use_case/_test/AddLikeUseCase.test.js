const CommentRepository = require("../../../Domains/comments/CommentRepository");
const LikeRepository = require("../../../Domains/likes/LikeRepository");
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const AddLikeUseCase = require("../AddLikeUseCase");

describe('AddLikeUseCase', () => {
    it ('should orchestrating the add like action correctly', async () => {
        // Arrange
        const useCaseParams = {
            threadID: 'thread-123',
            commentID: 'comment-123',
        }

        const expectedLike = {
            id: 'like-123',
            owner: 'user-123',
        };

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockLikeRepository = new LikeRepository();
        mockThreadRepository.checkThreadIsExist = jest.fn(() => Promise.resolve());
        mockCommentRepository.checkCommentIsExist = jest.fn(() => Promise.resolve());
        mockLikeRepository.checkLike = jest.fn(() => Promise.resolve());
        mockLikeRepository.addLike = jest.fn(() => Promise.resolve(expectedLike));

        const addLikeUseCase = new AddLikeUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            likeRepository: mockLikeRepository,
        });

        // Action
        const like = await addLikeUseCase.execute(useCaseParams, 'user-123');

        // Assert
        expect(like).toStrictEqual(expectedLike);
        expect(mockLikeRepository.checkLike).toBeCalledWith('comment-123', 'user-123');
        expect(mockLikeRepository.addLike).toBeCalledWith({
            commentID: 'comment-123',
            owner: 'user-123',
        });
    });

    it ('should orchestrating the delete like action correctly', async () => {
        // Arrange
        const useCaseParams = {
            threadID: 'thread-123',
            commentID: 'comment-123',
        }

        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockLikeRepository = new LikeRepository();
        mockThreadRepository.checkThreadIsExist = jest.fn(() => Promise.resolve());
        mockCommentRepository.checkCommentIsExist = jest.fn(() => Promise.resolve());
        mockLikeRepository.checkLike = jest.fn(() => Promise.resolve(true));
        mockLikeRepository.deleteLike = jest.fn(() => Promise.resolve());

        const addLikeUseCase = new AddLikeUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            likeRepository: mockLikeRepository,
        });

        // Action
        await addLikeUseCase.execute(useCaseParams, 'user-123');

        // Assert
        expect(mockLikeRepository.checkLike).toBeCalledWith('comment-123', 'user-123');
        expect(mockLikeRepository.deleteLike).toBeCalledWith({
            commentID: 'comment-123',
            owner: 'user-123',
        });
    });
    
});