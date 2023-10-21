const routes = (handler) => ([
    {
        method: 'PUT',
        path: '/threads/{threadID}/comments/{commentID}/likes',
        handler: handler.putLikeHandler,
    }
])

module.exports = routes;