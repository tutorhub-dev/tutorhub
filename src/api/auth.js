class AuthAPI {
    #api;

    constructor(api) {
        this.#api = api;
    }

    fetchUserByToken = (authToken) => {
        if (authToken == undefined) return null
        
        // look up the user by the token
        this.#api.authTokenCollection.findOne({
            auth_token: authToken
        }, 'user_id').then((authTokenEntry) => {
            if (!authTokenEntry) return null
            else {
                // look up the user by the user id
                this.#api.userCollection.findOne({
                    _id: authTokenEntry.get('user_id')
                }, 'email, username, profile_picture').then((user) => {
                    return {
                        user_id: authTokenEntry.get('user_id'),
                        email: user.get('email'),
                        username: user.get('username'),
                        profile_picture: user.get('profile_picture')
                    }
                })
            }
        })
    }
}

module.exports = AuthAPI;