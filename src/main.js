const express = require('express')
const app = express()
const port = 3000

const bodyParser = require('body-parser')
const TutorAPI = require('./api/api.js')

const api = new TutorAPI({})

app.use(bodyParser.json())

/* auth endpoints */
app.post('/login', api.login)
app.post('/logout', api.logout)

/* general user endpoints */
app.get('/user', api.getUser) // get a user's data
app.put('/user', api.createUser) // create a new user
app.post('/user', api.updateUser) // update a user's data
app.delete('/user', api.deleteUser) // delete a user
app.get('/user/appointment', api.getAppointment) // get a users appointments

/* tutor-specific endpoints */
app.get('/tutor', api.getTutor) // get a tutor's data
app.put('/tutor', api.createTutor) // create a new tutor
app.post('/tutor', api.updateTutor) // update a tutor's data
app.delete('/tutor', api.deleteTutor) // delete a tutor

/* appointment endpoint */
app.put('/appointment', api.createAppointment) // create a new appointment
app.post('/appointment', api.updateAppointment) // update an appointment
app.delete('/appointment', api.deleteAppointment) // delete an appointment

/* search endpoints */
app.post('/search', api.search) // search for tutors

// serve files from the public directory
app.use(express.static('public'))

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})