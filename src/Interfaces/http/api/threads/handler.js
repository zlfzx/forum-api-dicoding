const AuthenticationTokenManager = require("../../../../Applications/security/AuthenticationTokenManager");
const AddThreadUseCase = require("../../../../Applications/use_case/AddThreadUseCase");
const DetailThreadUseCase = require("../../../../Applications/use_case/DetailThreadUseCase");

class ThreadHandler {
    constructor(container) {
        this._container = container;
        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadByIDHandler = this.getThreadByIDHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const headerAuthorization = request.headers.authorization;
        
        const authenticationTokenManager = this._container.getInstance(AuthenticationTokenManager.name);
        const accessToken = await authenticationTokenManager.getTokenFromHeader(headerAuthorization);
        await authenticationTokenManager.verifyAccessToken(accessToken);
        const { id: userID } = await authenticationTokenManager.decodePayload(accessToken);

        const addedThread = await this._container.getInstance(AddThreadUseCase.name).execute(request.payload, userID);

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });

        response.code(201);
        return response;
    }

    async getThreadByIDHandler(request, h) {
        const thread = await this._container.getInstance(DetailThreadUseCase.name).execute(request.params);

        return h.response({
            status: 'success',
            data: {
                thread,
            },
        });
    }
}

module.exports = ThreadHandler;
