class SearchEndpoints {
    #api;

    constructor(api) {
        this.#api = api;
    }

    // can filter by: tutors, subjects, and days
    search = (req, res) => {
        // check that the request contains at least a tutor, subject, or day
        this.#validateRequest(req)
        .then(() => {
            // get the tutors, subjects, and days from the request
            let tutor_id = req.body.tutor_id;
            let subject = req.body.subject;
            let day = req.body.day;

            // search for availabilties where the tutor or subject match,
            // or it contains one of the days
            let query = {};
            if (tutor_id != undefined) query.tutor_id = tutor_id;
            if (subject != undefined) query.subject = subject;
            if (day != undefined) query.days = { $in: [day] };
            console.log("Query: " + JSON.stringify(query));

            // find all availabilities that match the query
            return this.#api.availabilityCollection.find(query);
        })
        .then((availabilities) => {
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
        })
        .catch(err => {
            this.#api.handleError(err, res);
        });
    }

    #validateRequest = (req) => {
        return new Promise((resolve, reject) => {
            // check that the request contains at least a tutor, subject, or day
            if (
                req.body.tutor_id == undefined &&
                req.body.subject == undefined &&
                req.body.day == undefined
            ) reject(400);

            else resolve();
        });
    }
};


module.exports = SearchEndpoints;