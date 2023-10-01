/* istanbul ignore file */
const ServerTestHelper = {
    async getAccessTokenHelper({ server, username = 'JohnDoe' }) {
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

        const responseJSONUser = JSON.parse(responseUser.payload);
        const { id: userID } = responseJSONUser.data.addedUser;

        const responseAuth = await server.inject({
            method: 'POST',
            url: '/authentications',
            payload: userPayload,
        });

        const { accessToken } = (JSON.parse(responseAuth.payload)).data;
        return { accessToken, userID };
    }
};

module.exports = ServerTestHelper;