const AuthenticationTokenManager = require("../../../../Applications/security/AuthenticationTokenManager");
const AddCommentUseCase = require("../../../../Applications/use_case/AddCommentUseCase");
const DeleteCommentUseCase = require("../../../../Applications/use_case/DeleteCommentUseCase");

class CommentHandler {
    constructor(container) {
        this._container = container;
        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentByIDHandler = this.deleteCommentByIDHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        const headerAuthorization = request.headers.authorization;

        const authenticationTokenManager = this._container.getInstance(AuthenticationTokenManager.name);
        const accessToken = await authenticationTokenManager.getTokenFromHeader(headerAuthorization);
        await authenticationTokenManager.verifyAccessToken(accessToken);
        const { id: userID } = await authenticationTokenManager.decodePayload(accessToken);

        const addedComment = await this._container.getInstance(AddCommentUseCase.name).execute(request.payload, request.params, userID);

        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    async deleteCommentByIDHandler(request, h) {
        const headerAuthorization = request.headers.authorization;

        const authenticationTokenManager = this._container.getInstance(AuthenticationTokenManager.name);
        const accessToken = await authenticationTokenManager.getTokenFromHeader(headerAuthorization);
        await authenticationTokenManager.verifyAccessToken(accessToken);
        const { id: userID } = await authenticationTokenManager.decodePayload(accessToken);

        await this._container.getInstance(DeleteCommentUseCase.name).execute(request.params, userID);

        return h.response({
            status: 'success',
        });
        
    }
}

module.exports = CommentHandler;