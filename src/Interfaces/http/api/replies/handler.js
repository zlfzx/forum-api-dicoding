class ReplyHandler {
    constructor(container) {
        this._container = container;
        this.postReplyHandler = this.postReplyHandler.bind(this);
        this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    }

    async postReplyHandler(request, h) {
        const headerAuthorization = request.headers.authorization;
        const addReplyUseCase = this._container.getInstance('AddReplyUseCase');
        const addedReply = await addReplyUseCase.execute(request.payload, request.params, headerAuthorization);

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
        const deleteReplyUseCase = this._container.getInstance('DeleteReplyUseCase');
        await deleteReplyUseCase.execute(request.params, headerAuthorization);

        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }
}

module.exports = ReplyHandler;