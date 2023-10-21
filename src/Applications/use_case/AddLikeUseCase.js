const NewLike = require("../../Domains/likes/entities/NewLike");

class AddLikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCaseParams, userID) {
    await this._threadRepository.checkThreadIsExist(useCaseParams.threadID);
    await this._commentRepository.checkCommentIsExist(useCaseParams.commentID);

    const isLikeExist = await this._likeRepository.checkLike(useCaseParams.commentID, userID);
    if (isLikeExist) {
        return this._likeRepository.deleteLike({ commentID: useCaseParams.commentID, owner: userID });
    } else {
        return this._likeRepository.addLike(new NewLike({
            commentID: useCaseParams.commentID,
            owner: userID,
        }));
    }
  }
}

module.exports = AddLikeUseCase;