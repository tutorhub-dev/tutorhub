

const Tutor = require('./tutor');
const User = require('./user');

const bcrypt = require('bcrypt')
const saltRounds = 10

class Account {
    #api;

    constructor(api) {
        this.#api = api;
    }

    isTutor(token) {
        return new Promise((resolve, reject) => {
            // if the id starts with 't' its a tutor
            resolve(token.startsWith('t'));
        });
    }

    makeNewAccount = (accountData, is_tutor) => {
        // check if the email is in use in either user or tutor collections
        return new Promise((resolve, reject) => {
            this.#api.userCollection.findOne({ email: accountData.email })
            .then((user) => {
                if (user) reject(409);
                else {
                    this.#api.tutorCollection.findOne({ email: accountData.email })
                    .then((tutor) => {
                        if (tutor) reject(409);
                        else {
                            // hash the password
                            bcrypt.hash(accountData.password, saltRounds, (err, hash) => {
                                if (err) {
                                    console.log(err);
                                    reject(500);
                                } else {
                                    // append the password hash
                                    accountData.hash_password = hash;

                                    // delete the old password
                                    delete accountData.password;

                                    // create a new user or tutor
                                    if (is_tutor)
                                        resolve(Tutor.createHandlerFromBlank(this.#api, accountData));
                                    else
                                        resolve(User.createHandlerFromBlank(this.#api, accountData));
                                }
                            });
                        }
                    })
                    .catch(reject);
                }
            })
            .catch(reject);
        });
    }

    /* Factory method to create a handler for
    manipulating user or tutor accounts (with a uniform API) */
    createAccountHandler = (token) => {
        return new Promise((resolve, reject) => {
            if (token == undefined) reject(400)
            else {
                // look up the user by the token
                this.#api.authTokenCollection.findOne({
                    auth_token: token
                }, 'user_id')
                .then((authTokenEntry) => {
                    if (!authTokenEntry) reject(401)
                    else {
                        const id = authTokenEntry.get('user_id');
                        this.isTutor(token)
                        .then((isTutor) => {
                            if (isTutor)
                                resolve(Tutor.createHandler(this.#api, id));
                            else
                                resolve(User.createHandler(this.#api, id));
                        })
                        .catch(reject);
                    }
                })
                .catch(reject);
            }
        });
    }

    testCredentials = (email, password) => {
        // test against the users and the tutors
        return new Promise((resolve, reject) => {
            this.#api.userCollection.findOne({
                email: email
            }, '_id hash_password')
            .then((user) => {
                if (!user) {
                    this.#api.tutorCollection.findOne({
                        email: email
                    }, '_id hash_password').then((tutor) => {
                        if (!tutor) resolve(false);
                        else {
                            bcrypt.compare(password, tutor.get('hash_password'), (err, result) => {
                                if (err) reject(500);
                                else {
                                    // create an account and resolve
                                    resolve(Tutor.createHandler(this.#api, tutor.get('_id')));
                                }
                            });
                        }
                    }).catch(reject);
                } else {
                    bcrypt.compare(password, user.get('hash_password'), (err, result) => {
                        if (err) reject(500);
                        else {
                            // create an account and resolve
                            resolve(User.createHandler(this.#api, user.get('_id')));
                        }
                    });
                }
            }).catch(reject);
        });
    }
}

module.exports = Account;