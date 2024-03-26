

const Tutor = require('./tutor');
const User = require('./user');

class Account {
    #api;

    constructor(api) {
        this.#api = api;
    }

    isTutor(id) {
        return new Promise((resolve, reject) => {
            // if the id starts with 't' its a tutor
            resolve(id.startsWith('t'));
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
                    if (!authTokenEntry) resolve(null)
                    else {
                        const id = authTokenEntry.get('user_id');
                        this.isTutor(id)
                        .then((isTutor) => {
                            if (isTutor) {
                                resolve(Tutor.createHandler(this.#api, id));
                            } else {
                                resolve(User.createHandler(this.#api, id));
                            }
                        })
                    }
                })
                .catch(reject);
            }
        });
    }
}

module.exports = Account;