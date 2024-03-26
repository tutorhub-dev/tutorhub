
class User {
    static #privateConstruct = false;
    #api;
    #id;
    #data;

    constructor(api, id, data) {
        // prevent instantiation of User class directly, since JS lacks private constructors
        if (User.#privateConstruct == false)
            throw new Error('User cannot be instantiated directly. Use User.createHandler instead');

        User.#privateConstruct = false;

        this.#api = api;
        this.#id = id;
        this.#data = data;
    }

    getDataFiltered = () => {
        return {
            _id: this.#id,
            first_name: this.#data.first_name,
            last_name: this.#data.last_name,
            email: this.#data.email,
            username: this.#data.username,
            is_tutor: false
        };
    }

    static createHandler = (api, id) => {
        // try and get the user from the database
        return new Promise((resolve, reject) => {
            api.userCollection.findById(id)
            .then((user) => {
                // if the user doesn't exist, fail
                if (user == null) reject(404);
                else {
                    User.#privateConstruct = true;
                    resolve(new User(api, id, user));
                }
            })
            .catch(reject);
        });
    }

    deleteAccount = () => {
        return new Promise((resolve, reject) => {
            this.#api.userCollection.findOneAndDelete({ _id: this.#id })
            .then((user) => {
                if (user == null)
                    reject('User not found');
                else
                    resolve();
            })
            .catch(reject);
        });
    }
}

module.exports = User;