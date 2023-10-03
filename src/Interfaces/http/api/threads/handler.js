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

        const addThreadUseCase = this._container.getInstance(AddThreadUseCase.name);
        const addedThread = await addThreadUseCase.execute(request.payload, headerAuthorization);

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
        const detailThreadUseCase = this._container.getInstance(DetailThreadUseCase.name);
        const thread = await detailThreadUseCase.execute(request.params);

        return h.response({
            status: 'success',
            data: {
                thread,
            },
        });
    }
}

module.exports = ThreadHandler;
