const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads/{threadID}/comments',
        handler: handler.postCommentHandler,
    },
    {
        method: 'DELETE',
        path: '/threads/{threadID}/comments/{commentID}',
        handler: handler.deleteCommentByIDHandler,
    }
]);

module.exports = routes;