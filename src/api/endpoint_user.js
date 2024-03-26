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
        if (this.#api.validateRequest(
            req, res, [
                'first_name',
                'last_name',
                'email',
                'password',
                'username',
                'is_tutor'
            ]
        ) == false) return;

        // Check if a user exists with the same email
        this.#api.userCollection.findOne({
            email: req.body.email
        }, '_id').then((user) => {
            if (user != null) {
                res.status(409).send('User already exists');
            } else {
                // Hash the password before saving
                bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        // Save the user with hashed password
                        const newUser = new this.#api.userCollection({
                            first_name: req.body.first_name,
                            last_name: req.body.last_name,
                            email: req.body.email,
                            hash_password: hash,
                            username: req.body.username,
                            is_tutor:  req.body.is_tutor
                        });

                        newUser.save().then(user => {
                            // log the user in
                            this.#api.auth.insertAuthToken(user._id, res)
                            .then((authToken) => {
                                // return the user & token
                                res.status(201).json({
                                    token: authToken,
                                    first_name: user.first_name,
                                    last_name: user.last_name,
                                    email: user.email,
                                    username: user.username,
                                    is_tutor: user.is_tutor
                                });
                            });
                        }).catch(err => {
                            console.log(err);
                            res.status(500).send('Internal Server Error');
                        });
                    }
                });
            }
        });
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
            return account.deleteAccount();
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