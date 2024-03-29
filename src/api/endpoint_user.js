const bcrypt = require('bcrypt');
const saltRounds = 10;

class UserEndpoints {
    #api;

    constructor(api) {
        this.#api = api;
    }

    getUser = (req, res) => {
        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                res.status(200).json(account.getDataFiltered())
            }
        })
        .catch((err) => {
            this.#api.handleError(err, res);
        });
    }

    createUser = (req, res) => {
        // ensure we specified if we want to make a tutor or not
        if (this.#api.validateRequest(req, res, ['is_tutor']) == false) return;

        // validate the request if we are making a tutor
        if (req.body.is_tutor) {
            // if we are making a tutor, ensure we have the subject
            if (this.#api.validateRequest(
                req, res, [
                    'first_name', 'last_name', 'email',
                    'password', 'username', 'hourly_rate'
                ]
            ) == false) return;
        } else {
            // if we are making a tutor, ensure we have the subject
            if (this.#api.validateRequest(
                req, res, [
                    'first_name', 'last_name', 'email',
                    'password', 'username'
                ]
            ) == false) return;
        }

        // create a new account
        this.#api.account.makeNewAccount(req.body, req.body.is_tutor)
        .then((account) => {
            // log the user in
            account.generateToken()
            .then((authToken) => {
                // send the user data and the auth token
                let data = account.getDataFiltered();
                data.token = authToken;

                res.status(201).json(data);
            })
        })
        .catch(err => {
            this.#api.handleError(err, res);
        });
    }

    updateUser = (req, res) => {
        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                // update the user
                return this.#api.userCollection.findOneAndUpdate(
                    { _id: account.getID() }, req.body, { new: true }
                );
            }
        })
        .then((user) => {
            if (user == null)
                res.status(404).send();
            else
                res.status(200).json({
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    username: user.username,
                    is_tutor: false
                });
        })
        .catch((err) => {
            this.#api.handleError(err, res);
        });
    }

    deleteUser = (req, res) => {
        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                return account.deleteAccount();
            }
        })
        .then(() => {
            res.status(204).send();
        })
        .catch(err => {
            this.#api.handleError(err, res);
        });
    }
}

module.exports = UserEndpoints;