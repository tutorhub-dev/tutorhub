const bcrypt = require('bcrypt')

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
                            authTokenEntry.get('user_id')
                        );
                    }
                })
                .then((user) => {
                    // return the user
                    if (!user) resolve(null)
                    else
                        resolve({
                            user_id: user.get('_id'),
                            first_name: user.get('first_name'),
                            last_name: user.get('last_name'),
                            email: user.get('email'),
                            username: user.get('username'),
                            is_tutor: user.get('is_tutor'),
                            profile_picture: user.get('profile_picture')
                        });
                })
                .catch(reject);
            }
        });
    }

    insertAuthToken = (userID, is_tutor) => {
        return new Promise((resolve, reject) => {
            const authToken = (is_tutor ? 't' : 'u')
                + Math.random().toString(36).substring(2, 15)
                + Math.random().toString(36).substring(2, 15)

            const authTokenEntry = new this.#api.authTokenCollection({
                user_id: userID,
                auth_token: authToken
            })

            // delete existing tokens with the same user_id
            this.clearAuthTokens(userID)
            .then(() => {
                // insert into the table
                return authTokenEntry.save();
            })
            .then(() => {
                resolve(authToken);
            })
            .catch(reject);
        });
    }

    clearAuthTokens = (userID) => {
        return this.#api.authTokenCollection.deleteMany({
            user_id: userID
        });
    }
}

module.exports = AuthAPI;