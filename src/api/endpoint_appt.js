class ApptEndpoints {
    #api;

    constructor(api) {
        this.#api = api;
    }

    getAppointment = (req, res) => {
        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                // get all the appointments for the user
                let query;
                if (account.isTutor()) query = { tutor_id: account.getID() }
                else query = { user_id: account.getID() }

                // find all appointments for the user
                this.#api.appointmentCollection.find(query)
                .then((appts) => {
                    // return the appointments
                    if (!appts) res.status(404).json([])
                    else {
                        // filter out sensitive information from the appointments
                        let filteredAppts = appts.map((appt) => {
                            return {
                                appointment_id: appt._id,
                                tutor_id: appt.tutor_id,
                                user_id: appt.user_id,
                                start_time: appt.start_time,
                                end_time: appt.end_time,
                                subject: appt.subject,
                                is_confirmed: appt.is_confirmed,
                                is_rated: appt.is_rated
                            }
                        });

                        res.status(200).json(filteredAppts);
                    }
                }).catch(err => {
                    this.#api.handleError(err, res);
                });
            }
        }).catch(err => {
            this.#api.handleError(err, res);
        });
    }

    createAppointment = (req, res) => {
        // validate the request
        if (this.#api.validateRequest(
            req, res, [ 'tutor_id', 'user_id', 'start_time', 'end_time', 'subject' ]
        ) == false) return;

        // get the user from the auth token
        let token = req.headers['authorization']
        let tutorData;
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                // Get the tutor's email from the provided ID
                return this.#api.tutorCollection.findById(
                    req.body.tutor_id
                );
            }
        })
        .then((tutor) => {
            if (!tutor) {
                res.status(404).send('Tutor not found');
            }
            else
            {
                tutorData = tutor;

                // Extract appointment details from request body
                const tutor_id = req.body.tutor_id;
                const user_id = req.body.user_id;
                const start_time = req.body.start_time;
                const end_time = req.body.end_time;
                const subject = req.body.subject;

                // Create new appointment object
                const appointment = this.#api.appointmentCollection({
                    tutor_id: tutor_id,
                    user_id: user_id,
                    start_time: start_time,
                    end_time: end_time,
                    subject: subject
                });

                // Save appointment to the database
                return appointment.save();
            }
        })
        .then((result) => {
            if (!result) res.status(500).send();
            else res.status(201).json({
                appointment_id: result._id,
                email: tutorData.email,
                name: tutorData.first_name + ' ' + tutorData.last_name
            });
        })
        .catch((err) => {
            this.#api.handleError(err, res);
        });
    }

    updateAppointment = (req, res) => {
        // validate the request
        if (this.#api.validateRequest(
            req, res, [ 'appointment_id' ]
        ) == false) return;

        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                // Extract updated information from request body
                const appointment_id = req.body.appointment_id;
                const start_time = req.body.start_time;
                const end_time = req.body.end_time;

                // Construct update object based on provided fields
                const updateFields = {};
                updateFields._id = appointment_id;
                if (start_time) updateFields.start_time = start_time;
                if (end_time) updateFields.end_time = end_time;

                // Update appointment in the database
                this.#api.appointmentCollection.findOneAndUpdate(
                    { _id: appointment_id }, updateFields, { new: true }
                )
                .then(result => {
                    if (!result)
                        res.status(400).send();
                    else
                        // Return the updated appointment
                        res.status(200).json(result); 
                })
                .catch(err => {
                    console.error("Error updating appointment:", err);
                    res.status(500).send('Error updating appointment');
                });
            }
        }).catch(err => {
            this.#api.handleError(err, res);
        });
    }

    acceptAppointment = (req, res) => {
        // validate the request
        if (this.#api.validateRequest(
            req, res, ['appointment_id']
        ) == false) return;

        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                // Extract appointment ID from request parameters
                const appointment_id = req.body.appointment_id;

                // Update the appointment to accepted
                this.#api.appointmentCollection.findOneAndUpdate(
                    { _id: appointment_id }, { is_confirmed: true }, { new: true }
                )
                .then(result => {
                    if (!result)
                        res.status(404).send();
                    else
                        res.status(200).json(result);
                })
                .catch(err => {
                    console.error("Error accepting appointment:", err);
                    res.status(500).send();
                });
            }
        }).catch(err => {
            this.#api.handleError(err, res);
        });
    }

    rateAppointment = (req, res) => {
        // validate the request
        if (this.#api.validateRequest(
            req, res, ['appointment_id', 'rating']
        ) == false) return;

        // ensure the rating is between 1 and 5
        if (req.body.rating < 1 || req.body.rating > 5)
        {
            res.status(400).send('Rating must be between 1 and 5');
            return;
        }

        // variables to store the user and appointment
        let userAccount, targetAppointment;

        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                return Promise.reject(401);
            else {
                userAccount = account;

                // Extract appointment ID from request parameters
                const appointment_id = req.body.appointment_id;

                // get the appointment with the given ID
                return this.#api.appointmentCollection.findById(appointment_id)
            }
        })
        .then((appointment) => {
            if (!appointment) {
                res.status(404).send('Appointment not found');
            } else {
                // check that the account is the student
                if (userAccount.getID() != appointment.user_id) {
                    return Promise.reject(401);
                }
                
                // check that the appointment is not already rated
                else if (appointment.is_rated) {
                    console.log("error: Appointment is already rated")
                    return Promise.reject(400);
                }

                // check that appointment was confirmed
                else if (!appointment.is_confirmed) {
                    console.log("error: Appointment is not confirmed")
                    return Promise.reject(400);
                }

                // get the tutor with the given ID
                else {
                    targetAppointment = appointment;
                    return this.#api.tutorCollection.findById(appointment.tutor_id)
                }
            }
        })
        .then((tutor) => {
            if (!tutor)
                res.status(404).send('Tutor not found');
            else {
                // calculate the new rating
                let updateFields = {
                    ratingCount: tutor.get('ratingCount') + 1,
                    ratingSum: tutor.get('ratingSum') + Number(req.body.rating)
                }

                return this.#api.tutorCollection.findOneAndUpdate(
                    { _id: targetAppointment.tutor_id }, updateFields, { new: true }
                )
            }
        })
        .then((result) => {
            if (!result)
                res.status(404).send();
            else
                // update the appointment to rated
                return this.#api.appointmentCollection.findOneAndUpdate(
                    { _id: req.body.appointment_id }, { is_rated: true }, { new: true }
                )
        })
        .then((result) => {
            if (!result)
                res.status(404).send();
            else
                res.status(200).json(result);
        })
        .catch(err => {
            this.#api.handleError(err, res);
        });
    }

    deleteAppointment = (req, res) => {
        // validate the request
        if (this.#api.validateRequest(
            req, res, ['appointment_id']
        ) == false) return;

        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                // Extract appointment ID from request parameters
                const appointment_id = req.body.appointment_id;

                // get the appointment with the given ID
                this.#api.appointmentCollection.findById(appointment_id)
                .then((appointment) => {
                    if (!appointment) {
                        res.status(404).send('Appointment not found');
                    } else {
                        // check that the account is either the tutor or the student
                        if (
                            account.getID() == appointment.tutor_id ||
                            account.getID() == appointment.student_id
                        ) {
                            // delete the appointment
                            this.#api.appointmentCollection.deleteOne({ _id: appointment_id })
                            .then(() => {
                                res.status(204).send();
                            })
                            .catch(err => {
                                console.error("Error deleting appointment:", err);
                                res.status(500).send();
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

module.exports = ApptEndpoints;