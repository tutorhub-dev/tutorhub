const mongoose = require('mongoose')

const AuthAPI = require('./auth')

const TutorSchemas = require('./schema')

const AuthEndpoints = require('./endpoint_auth')
const UserEndpoints = require('./endpoint_user')
const TutorEndpoints = require('./endpoint_tutor')
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
        
        // set up the endpoints
        this.authEndpoints = new AuthEndpoints(this)
        this.userEndpoints = new UserEndpoints(this)
        this.tutorEndpoints = new TutorEndpoints(this)
        this.apptEndpoints = new ApptEndpoints(this)
        this.searchEndpoints = new SearchEndpoints(this)

        // connect to the database
        mongoose.connect(mongooseEndpoint)
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
}

module.exports = TutorAPI;