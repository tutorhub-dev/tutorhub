class SearchEndpoints {
    #api;

    constructor(api) {
        this.#api = api;
    }
    

    // **discuss with team: want to add a filter by subject and rate as well possibly*** as of rn only filters for overlapping times

    search = (req, res) => {
        const { start_time, end_time } = req.query;

    // Validate start_time and end_time
    if (!start_time || !end_time) {
        res.status(400).send('Missing start_time or end_time parameters');
        return;
    }

    // Find tutors who don't have appointments overlapping with the specified time range
    this.#api.appointmentCollection.find({
        start_time: { $not: { $gte: new Date(end_time) } },
        end_time: { $not: { $lte: new Date(start_time) } }
    }).toArray()
    .then(appointments => {
        // Extract tutor IDs from appointments
        const occupiedTutorIds = appointments.map(appointment => appointment.tutor_id);

        // Fetch all tutors from the database
        this.#api.tutorCollection.find().toArray()
        .then(tutors => {
            // Filter out tutors who are not occupied during the specified time range
            const availableTutors = tutors.filter(tutor => !occupiedTutorIds.includes(tutor._id));

            res.status(200).json(availableTutors);
        })
        .catch(err => {
            console.error("Error fetching tutors:", err);
            res.status(500).send('Error fetching tutors');
        });
    })
    .catch(err => {
        console.error("Error searching for available tutors:", err);
        res.status(500).send('Error searching for available tutors');
    });
}
};


module.exports = SearchEndpoints;