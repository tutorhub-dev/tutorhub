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

    // Endpoint for debugging purposes only.
    // TODO: remove endpoint before production
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
        this.#api.account.testCredentials(email, password)
        .then((account) => {
            if (!account || account == null)
                res.status(401).send('Unauthorized')
            else {
                account.generateToken()
                .then((authToken) => {
                    // send the user data and the auth token
                    let data = account.getDataFiltered()
                    data.auth_token = authToken
                    delete data._id

                    res.status(200).send(data)
                }).catch(err => {
                    this.#api.handleError(err, res);
                });
            }
        }).catch(err => {
            this.#api.handleError(err, res);
        });
    }

    logout = (req, res) => {
        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            return account.deAuthenticate();
        })
        .then(() => {
            res.status(200).send('Logged out')
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
    }
}

module.exports = AuthEndpoints