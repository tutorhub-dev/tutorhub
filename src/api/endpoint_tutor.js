class TutorEndpoints {
    #api 
    constructor(api) {
        this.#api = api;
    }

    getTutor = (req, res) => {
        // Extract tutor ID from request parameters
        const tutor_id = req.params.id;

        // Validate tutor ID
        if (!tutor_id) {
            res.status(400).send('Missing tutor ID');
            return;
        }

        // Find the tutor in the database
        this.#api.tutorCollection.findOne({ _id: tutor_id })
        .then(tutor => {
            if (!tutor) {
                res.status(404).send('Tutor not found');
            } else {
                res.status(200).json(tutor);
            }
        })
        .catch(err => {
            console.error("Error fetching tutor:", err);
            res.status(500).send('Error fetching tutor');
        });
    };

    //**discuss with team: is creating a tutor seperate from their subject, hourlyRate, and availability.... user is already made so no need for user validation, creating tutor basically just setting the is_tutor flag to true for the user?? */
    createTutor = (req, res) => {
        // Extract user_id, username, email, and subject from request body
        const { user_id, username, email, subject } = req.body;
    
        // Validate user_id
        if (!user_id) {
            res.status(400).send('Missing user_id');
            return;
        }
    
        // Find user by user_id
        this.#api.userCollection.findOne({ _id: user_id })
            .then(user => {
            if (!user) {
                res.status(404).send('User not found');
                return;
            }

            // Assign is_tutor flag to user
            this.#api.userCollection.updateOne({ _id: user_id }, { $set: { is_tutor: true } })
            .then(() => {
                // Create tutor object
                const tutor = {
                    user_id: user_id,
                    username: username || user.username,
                    email: email || user.email,
                    subject: subject
                };

                // Insert the new tutor into the database
                this.#api.tutorCollection.insertOne(tutor)
                .then(result => {
                    res.status(201).json(result.ops[0]); // Return the created tutor
                })
                .catch(err => {
                    console.error("Error creating tutor:", err);
                    res.status(500).send('Error creating tutor');
                });
            })
            .catch(err => {
                console.error("Error assigning is_tutor flag to user:", err);
                res.status(500).send('Error assigning is_tutor flag to user');
            });
        })
        .catch(err => {
            console.error("Error finding user:", err);
            res.status(500).send('Error finding user');
        });
    };
    //**discuss with team: is subject a part of tutor or will they be handled elsewhere (setting availability/appointment) ****///
    updateTutor = (req, res) => {
        // Extract tutor ID from request parameters
        const tutor_id = req.params.id;
    
        // Extract updated information from request body
        const { username, email } = req.body;
    
        // Validate tutor ID
        if (!tutor_id) {
            res.status(400).send('Missing tutor ID');
            return;
        }
    
        // Construct update object based on provided fields
        const updateFields = {};
        if (username) updateFields.username = username;
        if (email) updateFields.email = email;
    
        // Update tutor information in the database
        this.#api.tutorCollection.findOneAndUpdate(
            { _id: tutor_id },
            { $set: updateFields },
            { returnOriginal: false }
        )
        .then(result => {
            if (!result.value) {
                res.status(404).send('Tutor not found');
            } else {
                res.status(200).json(result.value); // Return the updated tutor
            }
        })
        .catch(err => {
            console.error("Error updating tutor:", err);
            res.status(500).send('Error updating tutor');
        });
    };
    

    deleteTutor = (req, res) => {
        // Extract tutor ID from request parameters
        const tutor_id = req.params.id;
    
        // Validate tutor ID
        if (!tutor_id) {
            res.status(400).send('Missing tutor ID');
            return;
        }
    
        // Update is_tutor flag for the user associated with the tutor
        this.#api.tutorCollection.findOne({ _id: tutor_id })
            .then(tutor => {
                if (!tutor) {
                    res.status(404).send('Tutor not found');
                    return;
                }
    
                // Update is_tutor flag to false for the associated user
                this.#api.userCollection.updateOne({ _id: tutor.user_id }, { $set: { is_tutor: false } })
                    .then(() => {
                        // Delete the tutor from the database
                        this.#api.tutorCollection.deleteOne({ _id: tutor_id })
                            .then(() => {
                                res.status(204).send(); // No content, successful deletion
                            })
                            .catch(err => {
                                console.error("Error deleting tutor:", err);
                                res.status(500).send('Error deleting tutor');
                            });
                    })
                    .catch(err => {
                        console.error("Error updating is_tutor flag for user:", err);
                        res.status(500).send('Error updating is_tutor flag for user');
                    });
            })
            .catch(err => {
                console.error("Error finding tutor:", err);
                res.status(500).send('Error finding tutor');
            });
    };
}

module.exports = TutorEndpoints