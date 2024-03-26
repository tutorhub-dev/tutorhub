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
        }).catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
    }

    createUser = (req, res) => {
        // ensure we specified if we want to make a tutor or not
        if (this.#api.validateRequest(req, res, ['is_tutor'])) {
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
                res.status(201).json(account.getDataFiltered());
            }).catch((err) => {
                // if the err is a number
                if (err == 409) res.status(409).send();
                else {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                }
            });
        }
    }

    updateUser = (req, res) => {
        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.auth.fetchUserByToken(token)
        .then((user) => {
            if (user == null)
                res.status(401).send('Unauthorized')
            else {
                // update the user
                this.#api.userCollection.findOneAndUpdate({ _id: user.user_id }, req.body, { new: true })
                .then((user) => {
                    if (user == null)
                        res.status(404).send('User not found');
                    else
                        res.status(200).json({
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            username: user.username,
                            is_tutor: user.is_tutor
                        });
                });
            }
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
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
    }
}

module.exports = UserEndpoints;