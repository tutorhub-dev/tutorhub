class TutorEndpoints {
    #api 
    constructor(api) {
        this.#api = api;
    }

    getTutor = (req, res) => {
        res.status(501).send('Not Implemented')
    }

    createTutor = (req, res) => {
        res.status(501).send('Not Implemented')
    }

    updateTutor = (req, res) => {
        res.status(501).send('Not Implemented')
    }

    deleteTutor = (req, res) => {
        res.status(501).send('Not Implemented')
    }
}

module.exports = TutorEndpoints