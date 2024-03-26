
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
            tutorname: this.#data.tutorname,
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

    static createHandlerFromBlank = (api, data) => {
        return new Promise((resolve, reject) => {
            // create a new tutor
            const tutor = new api.tutorCollection(data);
            tutor.save()
            .then(() => {
                // append the id to the data
                data.tutor_id = tutor._id;

                Tutor.#privateConstruct = true;
                resolve(new Tutor(api, tutor._id, data));
            })
            .catch(reject);
        });
    }

    deleteAccount = () => {
        return new Promise((resolve, reject) => {
            this.#api.tutorCollection.findOneAndDelete({ _id: this.#id })
            .then((tutor) => {
                if (tutor == null)
                    reject('Tutor not found');
                else
                    resolve();
            })
            .catch(reject);
        });
    }

    generateToken = () => {
        return new Promise((resolve, reject) => {
            // create a new auth token
            this.#api.auth.insertAuthToken(this.#id, true)
            .then(resolve)
            .catch(reject);
        });
    }

    deAuthenticate = () => {
        return new Promise((resolve, reject) => {
            this.#api.auth.clearAuthTokens(this.#id)
            .then(resolve)
            .catch(reject);
        });
    }
}

module.exports = Tutor;