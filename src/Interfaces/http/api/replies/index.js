const ReplyHandler = require("./handler");
const routes = require("./routes");

module.exports = {
    name: 'replies',
    register: async (server, { container }) => {
        const threadHandler = new ReplyHandler(container);
        server.route(routes(threadHandler));
    },
};