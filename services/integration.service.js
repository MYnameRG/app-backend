const axios = require('axios');

module.exports = class IntegrationService {
    CLIENT_ID;
    CLIENT_SECRET;
    ACCESS_TOKEN;
    ACCESS_TOKEN_LINK;

    constructor(_CLIENT_ID, _CLIENT_SECRET, _TOKEN_LINK) {
        this.CLIENT_ID = _CLIENT_ID;
        this.CLIENT_SECRET = _CLIENT_SECRET;
        this.ACCESS_TOKEN_LINK = _TOKEN_LINK;
    }

    fetchToken = async (_AUTH_CODE) => {
        try {
            const response = await axios.post(this.ACCESS_TOKEN_LINK, {
                client_id: this.CLIENT_ID,
                client_secret: this.CLIENT_SECRET,
                code: _AUTH_CODE,
            }, {
                headers: {
                    Accept: 'application/json',
                },
            });

            this.ACCESS_TOKEN = response.data.access_token;
            return response.data.access_token;
        } catch (err) {
            console.log(err)
            throw new Error(err);
        }
    }

    fetchResponseFromAPI = async (_URL) => {
        const response = await axios.get(_URL, {
            headers: {
                Authorization: `Bearer ${this.ACCESS_TOKEN}`,
            },
        });

        return response.data;
    }
}