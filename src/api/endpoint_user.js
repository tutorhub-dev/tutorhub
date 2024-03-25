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
        let user = this.auth.fetchUserByToken(token)
        if (user == null) {
            res.status(401).send('Unauthorized')
            return
        }

        res.status(200).json(user)
    }

    createUser = (req, res) => {
        if (this.#api.validateRequest(
            req, res, ['email', 'password', 'username', 'is_tutor']
        ) == false) return;

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        const is_tutor = req.body.is_tutor;

        // Check if a user exists with the same email
        this.#api.userCollection.findOne({
            email: email
        }, '_id').then((user) => {
            if (user != null) {
                res.status(409).send('User already exists');
            } else {
                // Hash the password before saving
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        // Save the user with hashed password
                        const newUser = new this.#api.userCollection({
                            email: email,
                            hash_password: hash,
                            username: username,
                            is_tutor: is_tutor
                        });

                        newUser.save().then(user => {
                            res.status(201).json({
                                email: user.email,
                                username: user.username,
                                is_tutor: user.is_tutor
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
        if (this.#api.validateRequest(req, res, ['email'])) return;

        const email = req.body.email;

        this.#api.userCollection.findOneAndUpdate({ email: email }, req.body, { new: true }, (err, user) => {
            if (err) {
                res.status(500).send('Internal Server Error');
            } else if (!user) {
                res.status(404).send('User not found');
            } else {
                res.status(200).json(user);
            }
        });
    }

    deleteUser = (req, res) => {
        if (this.#api.validateRequest(req, res, ['email'])) return;

        const email = req.body.email;

        this.#api.userCollection.findOneAndDelete({ email: email }, (err, user) => {
            if (err) {
                res.status(500).send('Internal Server Error');
            } else if (!user) {
                res.status(404).send('User not found');
            } else {
                res.status(204).send();
            }
        });
    }
}

module.exports = UserEndpoints;