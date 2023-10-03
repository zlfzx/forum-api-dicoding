const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads',
        handler: handler.postThreadHandler,
    },
    {
        method: 'GET',
        path: '/threads/{threadID}',
        handler: handler.getThreadByIDHandler,
    }
]);

module.exports = routes;