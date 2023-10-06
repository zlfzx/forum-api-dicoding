const AddThread = require("../../Domains/threads/entities/AddThread");

class AddThreadUseCase {
    constructor({ threadRepository, authenticationTokenManager }) {
        this._threadRepository = threadRepository;
        this._authenticationTokenManager = authenticationTokenManager;
    }
    
    async execute(useCasePayload, headerAuth) {
        const accessToken = await this._authenticationTokenManager.getTokenFromHeader(headerAuth);
        await this._authenticationTokenManager.verifyAccessToken(accessToken);
        const { id } = await this._authenticationTokenManager.decodePayload(accessToken);

        return await this._threadRepository.addThread(new AddThread({
            ...useCasePayload,
            owner: id,
        }));
    }
}

module.exports = AddThreadUseCase;