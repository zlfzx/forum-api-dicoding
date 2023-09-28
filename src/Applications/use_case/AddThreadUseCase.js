class AddThreadUseCase {
    constructor({ threadRepository, authenticationTokenManager }) {
        this._threadRepository = threadRepository;
        this._authenticationTokenManager = authenticationTokenManager;
    }
    
    async execute(useCasePayload, headerAuth) {
        this._verifyPayload(useCasePayload);
        
        const { title, body } = useCasePayload;

        const accessToken = await this._authenticationTokenManager.getTokenFromHeader(headerAuth);
        
        await this._authenticationTokenManager.verifyAccessToken(accessToken);
        const { id } = await this._authenticationTokenManager.decodePayload(accessToken);

        const addedThread = await this._threadRepository.addThread({
            title,
            body,
            owner: id,
        });

        return addedThread;
    }

    _verifyPayload(payload) {
        const { title, body } = payload;
        
        if (!title || !body) {
            throw new Error('ADD_THREAD_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
        }
        
        if (typeof title !== 'string' || typeof body !== 'string') {
            throw new Error('ADD_THREAD_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddThreadUseCase;