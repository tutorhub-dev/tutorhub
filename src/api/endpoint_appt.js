class ApptEndpoints {
    #api;

    constructor(api) {
        this.#api = api;
    }

    getAppointment = (req, res) => {
        // get the user from the auth token
        let token = req.headers['authorization']
        let user = this.auth.fetchUserByToken(token)
        if (user == null) {
            res.status(401).send('Unauthorized')
            return
        }

        // get all the appointments for the user
        let query;
        if (user.is_student) query = { student_id: user.user_id}
        else query = { tutor_id: user.user_id }

        this.#api.appointmentCollection.find(query).then((appts) => {
            // return the appointments
            if (!appts) res.status(404).json([])
            else res.status(200).json(appts)
        })
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