const express = require('express')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express()
const port = 3000

const bodyParser = require('body-parser')
const TutorAPI = require('./api/tutor_api.js')

const api = new TutorAPI({})

dotenv.config();

app.use(bodyParser.json())

/* auth endpoints */
app.post('/api/login', api.authEndpoints.login)
app.post('/api/logout', api.authEndpoints.logout)
app.post('/register', api.authEndpoints.register)

/* general user endpoints */
app.route('/user')
    .get(api.userEndpoints.getUser)
    .put(api.userEndpoints.createUser)
    .post(api.userEndpoints.updateUser)
    .delete(api.userEndpoints.deleteUser)

app.get('/user/appointment', api.getAppointment) // get a users appointments

/* tutor-specific endpoints */
app.route('/tutor')
    .get(api.tutorEndpoints.getTutor)
    .put(api.tutorEndpoints.createTutor)
    .post(api.tutorEndpoints.updateTutor)
    .delete(api.tutorEndpoints.deleteTutor)

/* appointment endpoint */
app.route('/appointment')
    .get(api.getAppointment) // get an appointment
    .post(api.updateAppointment) // update an appointment
    .delete(api.deleteAppointment) // delete an appointment
    
/* search endpoints */
app.post('/search', api.searchEndpoints.search) // search for tutors

// serve files from the public directory
app.use(express.static('public'))

// connect to the database
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MDB_URL);
        console.log("Database Connected");
    } catch (error) {
        console.error(`Error: ${error.message}`);
        Process.exit(1);
    }
}

connectDB();

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

