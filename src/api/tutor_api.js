const Authentication = require('./auth')

const AuthEndpoints = require('./endpoint_auth')
const UserEndpoints = require('./endpoint_user')
const TutorEndpoints = require('./endpoint_tutor')
const ApptEndpoints = require('./endpoint_appt')
const SearchEndpoints = require('./endpoint_search')

class TutorAPI
{
    constructor(apiConfig)
    {
        this.apiConfig = apiConfig
        this.auth = new Authentication()

        this.authEndpoints = new AuthEndpoints()
        this.userEndpoints = new UserEndpoints()
        this.tutorEndpoints = new TutorEndpoints()
        this.apptEndpoints = new ApptEndpoints()
        this.searchEndpoints = new SearchEndpoints()
    }
}

module.exports = TutorAPI;