class TutorEndpoints {
    #api 
    constructor(api) {
        this.#api = api;
    }

    getTutor = (req, res) => {
        // get the tutor from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                res.status(200).json(account.getDataFiltered())
            }
        }).catch(err => {
            this.#api.handleError(err, res);
        });
    };

    updateTutor = (req, res) => {
        // get the tutor from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                // update the tutor
                return this.#api.tutorCollection.findOneAndUpdate(
                    { _id: account.getID() }, req.body, { new: true }
                );
            }
        })
        .then((tutor) => {
            if (tutor == null)
                res.status(404).send();
            else
                res.status(200).json({
                    first_name: tutor.first_name,
                    last_name: tutor.last_name,
                    email: tutor.email,
                    username: tutor.username,
                    hourly_rate: tutor.hourly_rate,
                    rating: tutor.rating,
                    is_tutor: true
                });
        })
        .catch((err) => {
            this.#api.handleError(err, res);
        });
    };

    deleteTutor = (req, res) => {
        // get the tutor from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                return account.deleteAccount();
            }
        })
        .then(() => {
            res.status(204).send();
        })
        .catch(err => {
            this.#api.handleError(err, res);
        });
    };
}

module.exports = TutorEndpoints