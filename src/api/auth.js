class AuthAPI {
    #api;

    constructor(api) {
        this.#api = api;
    }

    fetchUserByToken = (authToken) => {
        return new Promise((resolve, reject) => {
            if (authToken == undefined) resolve(null)
            else {
                // look up the user by the token
                this.#api.authTokenCollection.findOne({
                    auth_token: authToken
                }, 'user_id')
                .then((authTokenEntry) => {
                    if (!authTokenEntry) resolve(null)
                    else {
                        // look up the user by the user id
                        return this.#api.userCollection.findById(
                            authTokenEntry.get('user_id'),
                            'email username profile_picture'
                        );
                    }
                })
                .then((user) => {
                    // return the user
                    if (!user) resolve(null)
                    else
                        resolve({
                            user_id: user.get('_id'),
                            email: user.get('email'),
                            username: user.get('username'),
                            is_tutor: user.get('is_tutor'),
                            profile_picture: user.get('profile_picture')
                        });
                })
                .catch(reject);
            }
        });
    };
}

module.exports = AuthAPI;