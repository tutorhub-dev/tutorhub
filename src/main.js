const express = require('express')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const app = express()
const port = process.env.TH_PORT || 3000

const bodyParser = require('body-parser')
const TutorAPI = require('./api/tutor_api.js')

// grab mongodb url from environment variable or use default
const MDB_URL = (process.env.MDB_URL == undefined)
                ? "mongodb://localhost:27017"
                : process.env.MDB_URL 
const api = new TutorAPI({}, MDB_URL + "/tutorhub")

dotenv.config();

app.use(bodyParser.json())

/* account endpoints */
app.post('/api/login', api.authEndpoints.login) // Good
app.post('/api/logout', api.authEndpoints.logout)
app.post('/api/hash', api.authEndpoints.makeHash) // Good

app.put('/api/user', api.userEndpoints.createUser) // Good

/* general user endpoints */
app.get('/api/user', api.userEndpoints.getUser) // Good
app.post('/api/user', api.userEndpoints.updateUser) // Good
app.delete('/api/user', api.userEndpoints.deleteUser) // Good

/* tutor-specific endpoints */
app.get('/api/tutor', api.tutorEndpoints.getTutor) // Good
app.post('/api/tutor', api.tutorEndpoints.updateTutor)
app.delete('/api/tutor', api.tutorEndpoints.deleteTutor) // Good

/* availability endpoints */
app.get('/api/availability', api.availabilityEndpoints.getAvailability)
app.put('/api/availability', api.availabilityEndpoints.createAvailability)
app.post('/api/availability', api.availabilityEndpoints.updateAvailability)
app.delete('/api/availability', api.availabilityEndpoints.deleteAvailability)

/* appointment endpoint */
app.get('/api/appointment', api.apptEndpoints.getAppointment) // Good
app.put('/api/appointment', api.apptEndpoints.createAppointment) // Good
app.post('/api/appointment', api.apptEndpoints.updateAppointment) // Good
app.post('/api/appointment/accept', api.apptEndpoints.acceptAppointment) // Good
app.delete('/api/appointment', api.apptEndpoints.deleteAppointment) // Good

/* search endpoints */
app.post('/api/search', api.searchEndpoints.search) // search for tutors

// serve files from the public directory
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`TutorHub app listening on port ${port}`)
})

