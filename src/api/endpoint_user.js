class UserEndpoints {
    #api;

    constructor(api) {
        this.#api = api;
    }

    getUser = (req, res) => {
        res.status(501).send('Not Implemented')
    }

    createUser = (req, res) => {
        res.status(501).send('Not Implemented')
    }

    updateUser = (req, res) => {
        res.status(501).send('Not Implemented')
    }

    deleteUser = (req, res) => {
        res.status(501).send('Not Implemented')
    }

    getAppointments = (req, res) => {
        res.status(501).send('Not Implemented')
    }
}

module.exports = UserEndpoints;