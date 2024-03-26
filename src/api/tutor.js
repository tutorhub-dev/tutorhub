
class Tutor {
    static #privateConstruct = false;
    #api;
    #id;
    #data;

    constructor(api, id, data) {
        // prevent instantiation of Tutor class directly, since JS lacks private constructors
        if (Tutor.#privateConstruct == false)
            throw new Error('Tutor cannot be instantiated directly. Use Tutor.createHandler instead');

        Tutor.#privateConstruct = false;

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
            hourly_rate: this.#data.hourly_rate,
            is_tutor: true
        };
    }

    static createHandler = (api, id) => {
        // try and get the tutor from the database
        return new Promise((resolve, reject) => {
            api.tutorCollection.findById(id)
            .then((tutor) => {
                // if the tutor doesn't exist, fail
                if (tutor == null) reject(404);
                else {
                    Tutor.#privateConstruct = true;
                    resolve(new Tutor(api, id, tutor));
                }
            })
            .catch(reject);
        });
    }

    deleteAccount = () => {
        return new Promise((resolve, reject) => {
            this.#api.userCollection.findOneAndDelete({ _id: this.#id })
            .then((tutor) => {
                if (tutor == null)
                    reject('Tutor not found');
                else
                    resolve();
            })
            .catch(reject);
        });
    }
}

module.exports = Tutor;