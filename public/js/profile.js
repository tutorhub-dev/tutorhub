/* document.addEventListener('DOMContentLoaded', function() {
    
    const authToken = sessionStorage.getItem("authToken");
    const appointmentRequestForm = document.getElementById("appointmentRequestForm");

    if (!authToken) {
        window.location.href = "login.html";
    } else {
        const headers = new Headers({
            'Content-Type': 'application/json',
            'Authorization': authToken
        });
        fetchUserDetails();
    }

    if (appointmentRequestForm) {
        appointmentRequestForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const tutorId = document.getElementById("tutorSelect").value;
            const date = document.getElementById("appointmentDate").value;
            const startTime = document.getElementById("appointmentStartTime").value;
            const endTime = document.getElementById("appointmentEndTime").value;
            const subject = document.getElementById("subject").value;

            requestAppointment(tutorId, date, startTime, endTime, subject);
        });
    }
    toggleElementVisibility();
    getUserAppointments();
    getTutorAppointments();
    fetchAndDisplayAvailability();
    searchTutorsAndSubjects();
    displayAppointmentsBasedOnRole();
}); */


let availabilityBtn = document.getElementById('availabilityButton');
if (availabilityBtn) {
    availabilityBtn.addEventListener('click', function() {
        window.location.href = "availability.html";
    });
}

let editProfileBtn = document.getElementById('editProfileButton');
if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function() {
        window.location.href = "editProfile.html";
    });
}

let bookingsBtn = document.getElementById('bookingsButton');
if (bookingsBtn) {
    bookingsBtn.addEventListener('click', function() {
        window.location.href = "appointments.html";
    });
}

class Observer {
    update(appointmentId) {
        //
    }
}


class AppointmentSubject {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notifyObservers(appointmentId) {
        this.observers.forEach(observer => observer.update(appointmentId));
    }
}

class RateObserver extends Observer {
    constructor() {
        super();
    }

    update(appointmentId) {
        const listItem = document.getElementById(`appointment-${appointmentId}`);
        if (!listItem) return;

        const selectRating = document.createElement("select");
        for (let i = 1; i <= 5; i++) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = i;
            selectRating.appendChild(option);
        }

        const reviewField = document.createElement("textarea");
        reviewField.placeholder = "Feel free to leave a review!";

        const submitButton = document.createElement("button");
        submitButton.textContent = "Submit Review";

        submitButton.onclick = function() {
            submitRatingAndReview(appointmentId, selectRating.value, reviewField.value);
        }

        selectRating.onchange = () => setRate(appointmentId, selectRating.value);
        listItem.appendChild(selectRating);
        listItem.appendChild(reviewField);
        listItem.appendChild(submitButton);
    }

}

const appointmentSubject = new AppointmentSubject();
const rateObserver = new RateObserver();
appointmentSubject.addObserver(rateObserver);


// Display details functions
function fetchUserDetails(headers) {
    fetch('/api/user', {
        method: 'POST',
        headers: headers ({
            'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
            'Content-Type': 'application/json'
        })
    })

    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch user data');
        return response.json();
    })
    .then(data => {
        document.getElementById("userName").textContent = data.name;
        document.getElementById("pfp").src = data.profilePicture;

        toggleElementVisibility(data.is_tutor);
    })
    .catch(error => console.error('Failed to fetch user data:', error));
}

function searchTutorsAndSubjects() {
    const searchQuery = document.getElementById('searchBar').value;
    fetch ('/api/search', {
        method: 'POST',
        headers: new Headers({
            'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ query: searchQuery })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to search for tutors');
        return response.json(); // { tutors: [], subjects: []
    })
    .then(data => {
        const availabilityList = document.getElementById("availabilityList");
        availabilityList.innerHTML = "";
        data.forEach(tutor => {
            const tutorListItem = document.createElement("li");
            tutorListItem.textContent = tutor.name;
            tutorListItem.onclick = function() {
                fetchTutorAvailability(tutor.id);
            }
            availabilityList.appendChild(tutorListItem);
        });
    })
    .catch(error => console.error('Failed to search for tutors:', error));
}

/* document.getElementById("searchButton").addEventListener("click", function() {
    searchTutorsAndSubjects();
}); */

function fetchTutorAvailability(tutorId) {
    const body = JSON.stringify({ tutor_id: tutorId });

    fetch (`/api/availability/`, {
        method: 'POST',
        headers: new Headers({
            'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
            'Content-Type': 'application/json'
        }),
        body: body
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch tutor availability');
        return response.json();
    })
    .then(data => {
        const availabilityList = document.getElementById("availabilityList");
        availabilityList.innerHTML = "";
        data.forEach(slot => {
            const slotListItem = document.createElement("li");
            slotListItem.textContent = `${slot.date} - ${slot.start} to ${slot.end} - ${slot.subject}`;
            availabilityList.appendChild(slotListItem);
        });
    })
    .catch(error => console.error('Failed to fetch tutor availability:', error));
}

function getTutorAppointments() {
    fetch('/api/appointment', {
        method: 'POST',
        headers: new Headers({
            'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
            'Content-Type': 'application/json'
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch tutor appointments');
        return response.json();
    })
    .then(data => {
        displayTutorAppointments(data);
    })
    .catch(error => console.error('Failed to fetch tutor appointments:', error));
}

function displayTutorAppointments(appointments) {
    const appointmentList = document.getElementById("appointmentList");
    appointmentList.innerHTML = "";

    appointments.forEach(appointment => {
        const listItem = document.createElement("li");
        listItem.textContent = `${appointment.subject} - ${appointment.date}` - `${appointment.start_time} to ${appointment.end_time}`;

        const acceptButton = document.createElement("button");
        acceptButton.textContent = "Accept";
        acceptButton.onclick = function() {
            acceptAppointment(appointment.id);
        };

        const declineButton = document.createElement("button");
        declineButton.textContent = "Decline";
        declineButton.onclick = function() {
            declineAppointment(appointment.id);
        };

        listItem.appendChild(acceptButton);
        listItem.appendChild(declineButton);
        appointmentList.appendChild(listItem);
    });
}

function displayAppointmentsBasedOnRole() {
    const is_tutor = sessionStorage.getItem("is_tutor") === "true";

    if (is_tutor) {
        getTutorAppointments();
    } else {
        getUserAppointments();
    }
}

function getUserAppointments() {
    fetch('/api/appointment/', {
        method: 'POST',
        headers: new Headers({
            'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
            'Content-Type': 'application/json'
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch user appointments');
        return response.json();
    })
    .then(data => {
        const appointmentList = document.getElementById("appointmentList");
        appointmentList.innerHTML = "";
        
        data.forEach(appointment => {
            const listItem = document.createElement("li");
            listItem.id = `appointment-${appointment.id}`;
            listItem.textContent = `${appointment.subject} - ${appointment.date} - ${appointment.start_time} to ${appointment.end_time}`;

            if (new Date() > new Date(appointment.end_time)) {
                appointmentSubject.notifyObservers(appointment.id);
            } else {
                const cancelButton = document.createElement("button");
                cancelButton.textContent = "Cancel";
                cancelButton.onclick = function() {
                    if (confirm("Are you sure you want to cancel this appointment?")) {
                        cancelAppointment(appointment.id);
                    }
                }
                const editButton = document.createElement("button");
                editButton.textContent = "Edit Appointment";
                editButton.onclick = function() {
                    const newStart = prompt("Enter the new start time:");
                    const newEnd = prompt("Enter the new end time:");
                    editAppointment(appointment.id, newStart, newEnd);
                };
                listItem.appendChild(cancelButton);
            }
            appointmentList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Failed to fetch user appointments:', error));
}

function toggleElementVisibility(is_tutor) {
    const tutorElements = document.querySelectorAll(".tutor-class");
    const userElements = document.querySelectorAll(".user-class");

    tutorElements.forEach(element => element.style.display = is_tutor ? "block" : "none");
    userElements.forEach(element => element.style.display = is_tutor ? "none" : "block");
}

// Availability functions
document.getElementById("add-availability").addEventListener("click", function() {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    const subject = document.getElementById("subject").value;
    const tutor_id = JSON.parse(sessionStorage.userData).token;
    const dateInput = document.getElementById("date").value;

    let date = dateInput.split(","); // split at commas
    date = date.map(day => day.trim()); // remove whitespace

    availabilityPanel.createAvailability(date, start, end, subject);

    document.getElementById("date").value = "";
    document.getElementById("start").value = "";
    document.getElementById("end").value = "";
    document.getElementById("subject").value = "";
});

// function fetchAndDisplayAvailability() {
//     fetch('/api/tutor/', {
//         method: 'POST',
//         headers: new Headers({
//             'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
//             'Content-Type': 'application/json'
//         })
//     })
//     .then(response => {
//         if (!response.ok) throw new Error('Failed to fetch availability');
//         return response.json();
//     })
//     .then (data => {
//         const tableBody = document.getElementById("availabilityTable").getElementsByTagName("tbody")[0];
//         tableBody.innerHTML = "";

//         data.forEach(slot => {
//             const addRow = tableBody.insertRow();

//             const dateCell = addRow.insertCell(0);
//             const startCell = addRow.insertCell(1);
//             const endCell = addRow.insertCell(2);
//             const subjectCell = addRow.insertCell(3);

//             dateCell.textContent = slot.date;
//             startCell.textContent = slot.start;
//             endCell.textContent = slot.end;
//             subjectCell.textContent = slot.subject;

//             const deleteCell = addRow.insertCell(4);
//             const deleteButton = document.createElement("button");
//             deleteButton.textContent = "Delete Availability";
//             deleteButton.dataset.id = slot.id;
//             deleteButton.onclick = function() { deleteAvailability(slot.id); };
//             deleteCell.appendChild(deleteButton);
//         });
//     })
//     .catch(error => conso313le.error('Failed to fetch availability:', error));
// }

function getUserToken() {
   return JSON.parse(sessionStorage.getItem("userData")).token;
}


function formatHour(decimalHour) {
    const hour = Math.floor(decimalHour);
    const minute = Math.round((decimalHour - hour) * 60);
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

// Appointment functions
function requestAppointment(tutorId, date, start, end, subject) {
    const body = JSON.stringify({
        tutor_id: tutorId,
        date: date,
        start: start,
        end: end,
        subject: subject
    });
    fetch('/api/appointment', {
        method: 'POST',
        headers: new Headers({
            'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
            'Content-Type': 'application/json'
        }),
        body: body
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to request appointment');
        else alert('Your appointment request has been sent!');
    })
    .catch(error => console.error('Failed to request appointment:', error));
}

// Button functions
document.getElementById("logoutButton").addEventListener("click", function() {
    fetch('/api/logout', {
        method: 'POST',
        headers: new Headers({
            'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({}) 
    })
    .then(response => {
        if(response.ok) {
            sessionStorage.clear();
            window.location.href = "login.html";
        } else {
            throw new Error('Failed to log out');
        } 
    })
    .catch(error => console.error('Failed to log out:', error));
});

// document.getElementById("rateButton").addEventListener("click", function() {
//     const selectedRating = document.getElementById("rating").value;

//     setRate(selectedRating);
// });

function checkLogin() {
    if (!sessionStorage.getItem("userData")) {
        window.location.href = "login.html";
    }
}

// on page load
let availabilityPanel;
let appointmentPanel;
document.addEventListener('DOMContentLoaded', () => {
    // if we are not signed in redirect to login
    checkLogin();

    // load the user panel
    userPanel = new UserPanel("user-section");
    userPanel.render();

    // load the appointment panel
    appointmentPanel = new AppointmentPanel("appointment-entries");
    appointmentPanel.render();

    // load tutor specific things
    let is_tutor = JSON.parse(sessionStorage.getItem("userData")).is_tutor;

    if (is_tutor) {
        // update the dashboard label
        document.getElementById("dashboard-label").textContent = "Tutor Dashboard";

        // create the availability panel
        availabilityPanel = new AvailabilityPanel("availability-entries");
        availabilityPanel.show();
        availabilityPanel.render();
    }
});

