class TutorEndpoints {
    #api 
    constructor(api) {
        this.#api = api;
    }

    getTutor = (req, res) => {
        // get the user from the auth token
        let token = req.headers['authorization']
        this.#api.account.createAccountHandler(token)
        .then((account) => {
            if (account == null)
                res.status(401).send('Unauthorized')
            else {
                res.status(200).json(account.getDataFiltered())
            }
        }).catch((err) => {
            if (typeof err == 'number') res.status(err).send();
            else {
                console.error(err);
                res.status(500).send('Internal Server Error');
            }
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
        // get the user from the auth token
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
        .catch((err) => {
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
    };

    #markAsTutor = (user_id, is_tutor) => {
        return new Promise((resolve, reject) => {
            this.#api.userCollection.updateOne({ _id: user_id }, { $set: { is_tutor: is_tutor } })
            .then(() => {
                resolve();
            })
            .catch(reject);
        });
    };
}

module.exports = TutorEndpoints