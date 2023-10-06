const AuthenticationTokenManager = require("../../../../Applications/security/AuthenticationTokenManager");
const AddReplyUseCase = require("../../../../Applications/use_case/AddReplyUseCase");
const DeleteReplyUseCase = require("../../../../Applications/use_case/DeleteReplyUseCase");

class ReplyHandler {
    constructor(container) {
        this._container = container;
        this.postReplyHandler = this.postReplyHandler.bind(this);
        this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    }

    async postReplyHandler(request, h) {
        const headerAuthorization = request.headers.authorization;

        const authenticationTokenManager = this._container.getInstance(AuthenticationTokenManager.name);
        const accessToken = await authenticationTokenManager.getTokenFromHeader(headerAuthorization);
        await authenticationTokenManager.verifyAccessToken(accessToken);
        const { id: userID } = await authenticationTokenManager.decodePayload(accessToken);

        const addedReply = await this._container.getInstance(AddReplyUseCase.name).execute(request.payload, request.params, userID);

        const response = h.response({
            status: 'success',
            data: {
                addedReply,
            },
        });
        response.code(201);
        return response;
    }

    async deleteReplyHandler(request, h) {
        const headerAuthorization = request.headers.authorization;

        const authenticationTokenManager = this._container.getInstance(AuthenticationTokenManager.name);
        const accessToken = await authenticationTokenManager.getTokenFromHeader(headerAuthorization);
        await authenticationTokenManager.verifyAccessToken(accessToken);
        const { id: userID } = await authenticationTokenManager.decodePayload(accessToken);

        await this._container.getInstance(DeleteReplyUseCase.name).execute(request.params, userID);

        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = ReplyHandler;