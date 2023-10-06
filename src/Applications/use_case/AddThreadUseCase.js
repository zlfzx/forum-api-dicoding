const AddThread = require("../../Domains/threads/entities/AddThread");

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }
    
    async execute(useCasePayload, userID) {
        return await this._threadRepository.addThread(new AddThread({
            ...useCasePayload,
            owner: userID,
        }));
    }
}

module.exports = AddThreadUseCase;