class AvailabilityEndpoints {
    #api;

    constructor(api) {
        this.#api = api;
    }

    getAvailability = (req, res) => {
        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null) {
                res.status(401).send('Unauthorized');
                return;
            }
            
            // ensure the user is a tutor
            if (!account.isTutor()) {
                res.status(401).send('Unauthorized');
                return;
            }

            // get all the availabilities for the user
            let query = { tutor_id: account.getID() }

            // find all availabilities for the user
            return this.#api.availabilityCollection.find(query)
        }).then((availabilities) => {
            // return the availabilities
            if (!availabilities)
                res.status(404).json([])
            else {
                // filter out sensitive information from the availabilities
                let filteredAvailabilities = availabilities.map((availability) => {
                    return {
                        availability_id: availability._id,
                        tutor_id: availability.tutor_id,
                        days: availability.days,
                        start_hour: availability.start_hour,
                        end_hour: availability.end_hour,
                        subject: availability.subject
                    }
                });

                res.status(200).json(filteredAvailabilities);
            }
        }).catch((err) => {
            this.#api.handleError(err, res);
        });
    }

    createAvailability = (req, res) => {
        // validate the request
        if (this.#api.validateRequest(
            req, res, [ 'tutor_id', 'days', 'start_hour', 'end_hour', 'subject' ]
        ) == false) return;

        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                // Extract availability details from request body
                const tutor_id = req.body.tutor_id;
                const days = req.body.days;
                const start_hour = req.body.start_hour;
                const end_hour = req.body.end_hour;
                const subject = req.body.subject;

                // Create new availability object
                const availability = this.#api.availabilityCollection({
                    tutor_id: tutor_id,
                    days: days,
                    start_hour: start_hour,
                    end_hour: end_hour,
                    subject: subject
                });

                // Save availability to the database
                return availability.save()
            }
        })
        .then((result) => {
            if (!result) res.status(500).send();
            else res.status(201).json({
                availability_id: result._id
            });
        })
        .catch((err) => {
            this.#api.handleError(err, res);
        });
    }

    updateAvailability = (req, res) => {
        // validate the request
        if (this.#api.validateRequest(
            req, res, [ 'availability_id' ]
        ) == false) return;

        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                // Extract updated information from request body
                const availability_id = req.body.availability_id;
                const days = req.body.days;
                const start_time = req.body.start_time;
                const end_time = req.body.end_time;
                const subject = req.body.subject;

                // Construct update object based on provided fields
                const updateFields = {};
                updateFields._id = availability_id;
                if (days) updateFields.days = days;
                if (start_time) updateFields.start_time = start_hour;
                if (end_time) updateFields.end_time = end_hour;
                if (subject) updateFields.subject = subject;

                // Update availability in the database
                this.#api.availabilityCollection.findOneAndUpdate(
                    { _id: availability_id }, updateFields, { new: true }
                )
                .then(result => {
                    if (!result)
                        res.status(400).send();
                    else
                        // Return the updated availability
                        res.status(200).json({
                            availability_id: result._id,
                            tutor_id: result.tutor_id,
                            days: result.days,
                            start_hour: result.start_hour,
                            end_hour: result.end_hour,
                            subject: result.subject
                        }); 
                })
                .catch(err => {
                    this.#api.handleError(err, res);
                });
            }
        }).catch(err => {
            this.#api.handleError(err, res);
        });
    }

    deleteAvailability = (req, res) => {
        // validate the request
        if (this.#api.validateRequest(
            req, res, ['availability_id']
        ) == false) return;

        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                // Extract availability ID from request parameters
                const availability_id = req.body.availability_id;

                // get the availability with the given ID
                this.#api.availabilityCollection.findById(availability_id)
                .then((availability) => {
                    if (!availability) {
                        res.status(404).send('Availability not found');
                    } else {
                        // check that the account is the tutor for the availability
                        if (
                            account.getID() == availability.tutor_id
                        ) {
                            // delete the availability
                            this.#api.availabilityCollection.deleteOne({ _id: availability_id })
                            .then(() => {
                                res.status(204).send();
                            })
                            .catch(err => {
                                this.#api.handleError(err, res);
                            });
                        } else {
                            res.status(401).send('Unauthorized');
                        }
                    }
                }).catch(err => {
                    this.#api.handleError(err, res);
                });
            }
        }).catch(err => {
            this.#api.handleError(err, res);
        });
    }
}

module.exports = AvailabilityEndpoints;