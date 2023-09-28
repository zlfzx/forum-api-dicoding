class ThreadRepository {
    async addThread(addThread) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getThreadById(id) {
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