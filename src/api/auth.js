const bcrypt = require('bcrypt')
const saltRounds = 10

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

    insertAuthToken = (userID) => {
        return new Promise((resolve, reject) => {
            const authToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

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

    testCredentials = (email, password, cb) => {
        // make a query to the database to see if the user exists
        this.#api.userCollection.findOne({
            email: email
        }, '_id hash_password').then((user) => {
            // if the user does not exist, return false
            if (!user) cb(null, false, null)

            // if the user exists, compare the password
            else {
                bcrypt.compare(password, user.get('hash_password'), (err, result) => {
                    if (err) cb(err, null, null)
                    else cb(null, result, user.get('_id'))
                })
            }
        }).catch((err) => {
            cb(err, null, null)
        })
    }
}

module.exports = AuthAPI;