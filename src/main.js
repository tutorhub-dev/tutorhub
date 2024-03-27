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
app.post('/api/login', api.authEndpoints.login)
app.post('/api/logout', api.authEndpoints.logout)
app.post('/api/hash', api.authEndpoints.makeHash)

app.put('/api/user', api.userEndpoints.createUser)

/* general user endpoints */
app.get('/api/user', api.userEndpoints.getUser)
app.post('/api/user', api.userEndpoints.updateUser)
app.delete('/api/user', api.userEndpoints.deleteUser)

/* tutor-specific endpoints */
app.get('/api/tutor', api.tutorEndpoints.getTutor)
app.post('/api/tutor', api.tutorEndpoints.updateTutor)
app.delete('/api/tutor', api.tutorEndpoints.deleteTutor)

/* availability endpoints */
app.get('/api/availability', api.availabilityEndpoints.getAvailability)
app.put('/api/availability', api.availabilityEndpoints.createAvailability)
app.post('/api/availability', api.availabilityEndpoints.updateAvailability)
app.delete('/api/availability', api.availabilityEndpoints.deleteAvailability)

/* appointment endpoint */
app.get('/api/appointment', api.apptEndpoints.getAppointment)
app.put('/api/appointment', api.apptEndpoints.createAppointment)
app.post('/api/appointment', api.apptEndpoints.updateAppointment)
app.post('/api/appointment/accept', api.apptEndpoints.acceptAppointment)
app.delete('/api/appointment', api.apptEndpoints.deleteAppointment)

/* search endpoints */
app.post('/api/search', api.searchEndpoints.search)

// serve files from the public directory
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`TutorHub app listening on port ${port}`)
})

