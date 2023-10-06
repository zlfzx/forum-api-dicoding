const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads/{threadID}/comments/{commentID}/replies',
        handler: handler.postReplyHandler,
    },
    {
        method: 'DELETE',
        path: '/threads/{threadID}/comments/{commentID}/replies/{replyID}',
        handler: handler.deleteReplyHandler,
    }
]);

module.exports = routes;