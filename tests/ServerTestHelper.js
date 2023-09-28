/* istanbul ignore file */
const ServerTestHelper = {
    async getUserIdHelper({ server, username = 'JohnDoe' }) {
        const userPayload = {
            username, password: 'secret',
        };

        const responseUser = await server.inject({
            method: 'POST',
            url: '/users',
            payload: {
                ...userPayload,
                fullname: 'placeholder fullname',
            },
        });

        const { id: userId } = (JSON.parse(responseUser.payload)).data.addedUser;
        return userId;
    },
    async getAccessTokenHelper({ server, username = 'JohnDoe' }) {

        await this.getUserIdHelper({ server, username });

        const userPayload = {
            username, password: 'secret',
        };

        const responseAuth = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: userPayload,
        });

        const { accessToken } = (JSON.parse(responseAuth.payload)).data;
        return accessToken;
    }
};

module.exports = ServerTestHelper;