/* eslint-disable no-unused-vars */
class ThreadRepository {
    async addThread(addThread) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getThreadByID(id) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    // async verifyThreadOwner({ threadId, owner }) {
    //     throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    // }

    // async getThreadByCommentId(commentId) {
    //     throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    // }
}

module.exports = ThreadRepository;