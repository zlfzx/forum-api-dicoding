const AuthenticationTokenManager = require("../../../../Applications/security/AuthenticationTokenManager");
const AddLikeUseCase = require("../../../../Applications/use_case/AddLikeUseCase");

class LikesHandler {
    constructor(container) {
        this._container = container;
    
        this.putLikeHandler = this.putLikeHandler.bind(this);
    }
  
    async putLikeHandler(request, h) {
        const headerAuthorization = request.headers.authorization;

        const authenticationTokenManager = this._container.getInstance(AuthenticationTokenManager.name);
        const accessToken = await authenticationTokenManager.getTokenFromHeader(headerAuthorization);
        await authenticationTokenManager.verifyAccessToken(accessToken);
        const { id: userID } = await authenticationTokenManager.decodePayload(accessToken);

        await this._container.getInstance(AddLikeUseCase.name).execute(request.params, userID);
        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
  }
  
  module.exports = LikesHandler;
  