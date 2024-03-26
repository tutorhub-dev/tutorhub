const bcrypt = require('bcrypt')
const saltRounds = 10

/**
 * Represents the authentication endpoints for the API.
 */
class AuthEndpoints {
    #api

    constructor(api) {
        this.#api = api
    }

    makeHash = (req, res) => {
        // ensure we were sent the parameters we need
        if (this.#api.validateRequest(req, res, ['password']) == false) return

        // get the password from the request
        const password = req.body.password

        // hash the password
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else {
                res.status(200).send({
                    "hash": hash
                })
            }
        })
    }

    login = (req, res) => {
        // ensure we were sent the parameters we need
        if (this.#api.validateRequest(req, res, ['email', 'password']) == false) return

        // get the username and password from the request
        const email = req.body.email
        const password = req.body.password

        // test the credentials
        this.#api.auth.testCredentials(email, password, (err, success, user_id) => {
            if (err) {
                console.log(err)
                res.status(500).send('Internal Server Error')
            } else if (!success) {
                res.status(401).send('Unauthorized')
            } else {
                this.#api.auth.insertAuthToken(user_id)
                .then((authToken) => {
                    res.status(200).send({
                        "auth_token": authToken
                    })
                })
            }
        })
    }

    logout = (req, res) => {
        // get the user from the auth token
        this.#api.auth.fetchUserByToken(req.headers['authorization'])
        .then((user) => {
            if (user == null)
                res.status(401).send('Unauthorized')
            else {
                // delete the auth token
                this.#api.authTokenCollection.deleteOne({ user_id: user.user_id })
                .then(() => {
                    res.status(200).send('Logged out')
                })
            }
        });
    }
}

module.exports = AuthEndpoints