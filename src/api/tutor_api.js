const mongoose = require('mongoose')

const AuthAPI = require('./auth')
const Account = require('./account')

const TutorSchemas = require('./schema')

const AuthEndpoints = require('./endpoint_auth')
const UserEndpoints = require('./endpoint_user')
const TutorEndpoints = require('./endpoint_tutor')
const AvailabilityEndpoints = require('./endpoint_availability')
const ApptEndpoints = require('./endpoint_appt')
const SearchEndpoints = require('./endpoint_search')

class TutorAPI {
    #apiConfig;

    authTokenCollection;
    userCollection;
    tutorCollection;
    appointmentCollection;

    constructor(apiConfig, mongooseEndpoint) {
        this.#apiConfig = apiConfig
        this.auth = new AuthAPI(this)
        this.account = new Account(this)
        
        // set up the endpoints
        this.authEndpoints = new AuthEndpoints(this)
        this.userEndpoints = new UserEndpoints(this)
        this.tutorEndpoints = new TutorEndpoints(this)
        this.availabilityEndpoints = new AvailabilityEndpoints(this)
        this.apptEndpoints = new ApptEndpoints(this)
        this.searchEndpoints = new SearchEndpoints(this)

        // connect to the database
        mongoose.connect(mongooseEndpoint)

        const db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function (callback) {
            console.log("connection to db open")
        });

        console.log("Database registered at " + mongooseEndpoint)

        // create the collections (tables) by specifying thier models
        this.authTokenCollection = mongoose.model(
            'authtoken', new mongoose.Schema(TutorSchemas.authTokenSchema)
        )
        this.userCollection = mongoose.model(
            'user', new mongoose.Schema(TutorSchemas.userSchema)
        )
        this.tutorCollection = mongoose.model(
            'tutor', new mongoose.Schema(TutorSchemas.tutorSchema)
        )
        this.appointmentCollection = mongoose.model(
            'appointment', new mongoose.Schema(TutorSchemas.appointmentSchema)
        )
        this.availabilityCollection = mongoose.model(
            'availability', new mongoose.Schema(TutorSchemas.availabilitySchema)
        )
    }

    validateRequest(req, res, requiredParams) {
        // check if all the required parameters are present
        for (let i = 0; i < requiredParams.length; i++) {
            if (req.body[requiredParams[i]] == undefined) {
                res.status(400).send('Bad Request')
                return false
            }
        }
        return true
    }

    handleError = (err, res) => {
        if (typeof err == 'number')
            res.status(err).send();
        else {
            console.error(err);
            res.status(500).send();
        }
    }
}

module.exports = TutorAPI;