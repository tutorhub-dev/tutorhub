const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Represents the authentication endpoints for the API.
 */
class AuthEndpoints {
    #api;

    constructor(api) {
        this.#api = api;
    }

    login = (req, res) => {
        // ensure we were sent the parameters we need
        if (this.#api.validateRequest(req, res, ['email', 'password']) == false) return;

        // get the username and password from the request
        const email = req.body.email;
        const password = req.body.password;

        // test the credentials
        this.#testCredentials(email, password, (err, success, user_id) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else if (!success) {
                res.status(401).send('Unauthorized');
            } else {
                this.#insertAuthToken(user_id, res);
            }
        });
    }

    logout = (req, res) => {
        res.status(501).send('Not Implemented')
    }

    register = (req, res) => {
        res.status(501).send('Not Implemented')
    }

    #testCredentials = (email, password, cb) => {
        // make a query to the database to see if the user exists
        this.#api.userCollection.findOne({
            email: email
        }, '_id, hash_password').then((user) => {
            // if the user does not exist, return false
            if (!user) cb(null, false, null);

            // if the user exists, compare the password
            else {
                bcrypt.compare(password, user.get('hash_password'), (err, result) => {
                    if (err) cb(err, null, null);
                    else cb(null, result, user.get('_id'));
                });
            }
        }).catch((err) => {
            cb(err, null, null);
        });
    }

    #insertAuthToken = (userID, res) => {
        const authToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const authTokenEntry = new this.#api.authTokenCollection({
            user_id: userID,
            auth_token: authToken
        });

        // insert into the table
        authTokenEntry.save().then(() => {
            res.status(200).send({
                "authToken": authToken
            });
        });
    }
}

module.exports = AuthEndpoints;