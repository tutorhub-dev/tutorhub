class UserEndpoints {
    #api;

    constructor(api) {
        this.#api = api;
    }

    getUser = (req, res) => {
        if (this.#api.validateRequest(req, res, ['username', 'email']) == false) return;

        const username = req.body.username;
        const email = req.body.email;
        res.status(501).send('Not Implemented')
    
        this.#api.userCollection.findUser({ email: email, username: username }, (err, user) => {
            if (err) {
                res.status(500).send('Internal Server Error');
            } else if (!user) {
                res.status(404).send('User not found');
            } else {
                res.status(200).json(user);
            }
        });
    }



    createUser = (req, res) => {
        if (this.#api.validateRequest(req, res, ['email', 'hash_password', 'username']) == false) return;

        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        

        // Hash the password before saving
        bcrypt.hash(hash_password, saltRounds, (err, hash) => {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            } else {
                // Save the user with hashed password
                const newUser = new this.#api.userCollection({
                    email: email,
                    hash_password: hash,
                    username: username
                });
                newUser.save().then(user => {
                    res.status(201).json(user);
                }).catch(err => {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
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


    getAppointments = (req, res) => {
        if (this.#api.validateRequest(req, res, ['user_id'])) return;

        const user_id = req.body.user_id;

        this.#api.appointmentCollection.find({ tutor_id: user_id }, (err, appointments) => {
            if (err) {
                res.status(500).send('Internal Server Error');
            } else {
                res.status(200).json(appointments);
            }
        });
    }

}

module.exports = UserEndpoints;