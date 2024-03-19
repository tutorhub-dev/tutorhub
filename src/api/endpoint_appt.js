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
        // get the user from the auth token
        let token = req.headers['authorization']
        let user = this.auth.fetchUserByToken(token)
        if (user == null) {
            res.status(401).send('Unauthorized')
            return
        }
    
        // Extract appointment details from request body
        const { tutor_id, student_id, startTime, time } = req.body;
    
        // Validate appointment details
        if (!tutor_id || !student_id || !date || !time) {
            res.status(400).send('Missing required parameters')
            return;
        }
    
        // Create appointment object
        const appointment = {
            tutor_id: tutor_id,
            student_id: student_id,
            start_time: start_time,
            end_time: end_time,
        };
    
        // Save appointment to the database
        this.#api.appointmentCollection.insertOne(appointment)
        .then(result => {
            res.status(201).json(result.ops[0]); // Return the created appointment
        })
        .catch(err => {
            console.error("Error creating appointment:", err);
            res.status(500).send('Error creating appointment');
        });
    }
    

    updateAppointment = (req, res) => {
        // get the user from the auth token
        let token = req.headers['authorization']
        let user = this.auth.fetchUserByToken(token)
        if (user == null) {
            res.status(401).send('Unauthorized')
            return
        }
    
        // Extract appointment ID and update details from request body
        const appointment_id = req.params.id;
        const { tutor_id, student_id, start_time, end_time } = req.body;
    
        // Validate appointment ID and update details
        if (!appointment_id || (!tutor_id && !student_id && !start_time && !end_time)) {
            res.status(400).send('Missing required parameters');
            return;
        }
    
        // Construct update object based on provided fields
        const updateFields = {};
        if (tutor_id) updateFields.tutor_id = tutor_id;
        if (student_id) updateFields.student_id = student_id;
        if (start_time) updateFields.start_time = start_time;
        if (end_time) updateFields.end_time = end_time;
    
        // Update appointment in the database
        this.#api.appointmentCollection.findOneAndUpdate(
            { _id: appointment_id },
            { $set: updateFields },
            { returnOriginal: false }
        )
        .then(result => {
            if (!result.value) {
                res.status(404).send('Appointment not found');
            } else {
                res.status(200).json(result.value); // Return the updated appointment
            }
        })
        .catch(err => {
            console.error("Error updating appointment:", err);
            res.status(500).send('Error updating appointment');
        });
    }
    

    deleteAppointment = (req, res) => {
        // get the user from the auth token
        let token = req.headers['authorization'];
        let user = this.auth.fetchUserByToken(token);
        if (user == null) {
            res.status(401).send('Unauthorized');
            return;
        }
    
        // Extract appointment ID from request parameters
        const appointment_id = req.params.id;
    
        // Validate appointment ID
        if (!appointment_id) {
            res.status(400).send('Missing appointment ID');
            return;
        }
    
        // Delete appointment from the database
        this.#api.appointmentCollection.deleteOne({ _id: appointment_id })
            .then(result => {
                if (result.deletedCount === 0) {
                    res.status(404).send('Appointment not found');
                } else {
                    res.status(204).send(); // No content, successful deletion
                }
            })
            .catch(err => {
                console.error("Error deleting appointment:", err);
                res.status(500).send('Error deleting appointment');
            });
    };
    
}

module.exports = ApptEndpoints;