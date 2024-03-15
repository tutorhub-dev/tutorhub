class ApptEndpoints {
    #api;

    constructor(api) {
        this.#api = api;
    }

    getAppointment = (req, res) => {
        res.status(501).send('Not Implemented')
    }

    createAppointment = (req, res) => {
        res.status(501).send('Not Implemented')
    }

    updateAppointment = (req, res) => {
        res.status(501).send('Not Implemented')
    }

    deleteAppointment = (req, res) => {
        res.status(501).send('Not Implemented')
    }
}

module.exports = ApptEndpoints;