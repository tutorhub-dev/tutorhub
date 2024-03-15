const express = require('express')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express()
const port = 3000

const bodyParser = require('body-parser')
const TutorAPI = require('./api/tutor_api.js')

// grab mongodb url from environment variable or use default
const MDB_URL = (process.env.MDB_URL == undefined)
                ? "mongodb://localhost:27017"
                : process.env.MDB_URL 
const api = new TutorAPI({}, MDB_URL + "/tutorhub")

dotenv.config();

app.use(bodyParser.json())

/* auth endpoints */
app.post('/api/login', api.authEndpoints.login)
app.post('/api/logout', api.authEndpoints.logout)
app.post('/api/register', api.authEndpoints.register)

/* general user endpoints */
app.get('/api/user', api.userEndpoints.getUser)
app.put('/api/user', api.userEndpoints.createUser)
app.post('/api/user', api.userEndpoints.updateUser) // dont do
app.delete('/api/user', api.userEndpoints.deleteUser)

app.get('/api/user/appointment', api.userEndpoints.getAppointments) // get a users appointments

/* tutor-specific endpoints */
app.get('/api/tutor', api.tutorEndpoints.getTutor)
app.put('/api/tutor', api.tutorEndpoints.createTutor)
app.post('/api/tutor', api.tutorEndpoints.updateTutor) // dont do
app.delete('/api/tutor', api.tutorEndpoints.deleteTutor)

/* appointment endpoint */
app.get('/api/appointment', api.apptEndpoints.getAppointment) // get an appointment
app.put('/api/appointment', api.apptEndpoints.createAppointment) // create an appointment
app.post('/api/appointment', api.apptEndpoints.updateAppointment) // update an appointment
app.delete('/api/appointment', api.apptEndpoints.deleteAppointment) // delete an appointment

/* search endpoints */
app.post('/api/search', api.searchEndpoints.search) // search for tutors

// serve files from the public directory
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`TutorHub app listening on port ${port}`)
})

