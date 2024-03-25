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
            const time = document.getElementById("appointmentTime").value;
            const subject = document.getElementById("subject").value;

            requestAppointment(tutorId, `${date}T${time}`, subject);
        });
    }
}); */

// Display details functions
function fetchUserDetails(headers) {
    fetch('/src/api/user', {
        method: 'POST',
        headers: headers,
    })

    .then(response => {
        if (!response.ok) throw new Error('Failed to fetch user data');
        return response.json();
    })
    .then(data => {
        document.getElementById("userName").textContent = data.name;
        document.getElementById("pfp").src = data.profilePicture;

        toggleElementVisibility(data.userIsTutor);
    })
    .catch(error => console.error('Failed to fetch user data:', error));
}

function fetchAndDisplayAvailability() {
    fetch('/src/api/tutor/availability', {
        method: 'GET',
        headers: new Headers({
            'Authorization': sessionStorage.getItem("authToken"),
            'Content-Type': 'application/json'
        })
    })
    .then(response => response.json())
    .then(availabilitySlots => {
        availabilitySlots.forEach(slot => {
            addAvailability(slot.start, slot.end, slot.subject, slot.id);
        });
    })
    .catch(error => console.error('Failed to fetch availability:', error));
}

function getTutorAppointments() {
    fetch('/src/api/tutor/appointments/requests', {
        method: 'POST',
        headers: new Headers({
            'Authorization': sessionStorage.getItem("authToken"),
            'Content-Type': 'application/json'
        })
    })
    .then(response => response.json())
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
        listItem.textContent = `${appointment.subject} - ${appointment.date}`;

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


function getUserAppointments() {
    fetch('/src/api/user/appointments', {
        method: 'POST',
        headers: new Headers({
            'Authorization': sessionStorage.getItem("authToken"),
            'Content-Type': 'application/json'
        })
    })
    .then(response => response.json())
    .then(data => {
        const appointmentList = document.getElementById("appointmentList");

        appointmentList.innerHTML = "";
        
        data.forEach(appointment => {
            const listItem = document.createElement("li");
            listItem.textContent = `${appointment.subject} - ${appointment.date}`;

            const selectRating = document.createElement("select");
            for (let i = 1; i <= 5; i++) {
                const option = document.createElement("option");
                option.value = i;
                option.textContent = i;
                selectRating.appendChild(option);
            }
            selectRating.onchange = () => setRate(appointment.id, selectRating.value);

            const cancelButton = document.createElement("button");
            cancelButton.textContent = "Cancel";
            cancelButton.onclick = function() {
                if (confirm("Are you sure you want to cancel this appointment?")) {
                    cancelAppointment(appointment.id);
                }
            };

            listItem.appendChild(selectRating);
            appointmentList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Failed to fetch user appointments:', error));
}

function toggleElementVisibility(userIsTutor) {
    const tutorElements = document.querySelectorAll(".tutor-class");
    const userElements = document.querySelectorAll(".user-class");

    tutorElements.forEach(element => element.style.display = userIsTutor ? "block" : "none");
    userElements.forEach(element => element.style.display = userIsTutor ? "none" : "block");

    if (userIsTutor) {
        fetchAndDisplayAvailability();
        getTutorAppointments();
    } else {
        getUserAppointments();
    }
}

// Availability functions
document.getElementById("add-availability").addEventListener("click", function() {
    const date = document.getElementById("date").value;
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    const subject = document.getElementById("subject").value;

    createAvailability(date, start, end, subject);

    document.getElementById("date").value = "";
    document.getElementById("start").value = "";
    document.getElementById("end").value = "";
    document.getElementById("subject").value = "";
});

function createAvailability(date, start, end, subject) {
    fetch('/src/api/tutor/availability', {
        method: 'POST',
        headers: new Headers({
            'Authorization': sessionStorage.getItem("authToken"),
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            date: date,
            start: start,
            end: end,
            subject: subject
            })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to add your availability');
        return response.json();
    })
    .then(newSlot => {
        const tableBody = document.getElementById("availabilityTable").getElementsByTagName("tbody")[0];
        const addRow = tableBody.insertRow();

        const dateCell = addRow.insertCell(0);
        const startCell = addRow.insertCell(1);
        const endCell = addRow.insertCell(2);
        const subjectCell = addRow.insertCell(3);

        dateCell.textContent = newSlot.date;
        startCell.textContent = start;
        endCell.textContent = end;
        subjectCell.textContent = subject;

        const deleteCell = addRow.insertCell(3);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Availability";
        deleteButton.dataset.id = newSlot.id;
        deleteButton.onclick = function() { deleteAvailability(newSlot.id); };
        deleteCell.appendChild(deleteButton);

        if (userIsTutor) {
            fetchAndDisplayAvailability();
        } else {
            getUserAppointments();
        }
    })
    .catch(error => console.error('Failed to add your availability:', error));   
}

function deleteAvailability(slotId) {
    fetch(`/src/api/tutor/availability/${slotId}`, { /* Maybe add a slotId feature in the availability API? */
        method: 'DELETE',
        headers: new Headers({
            'Authorization': sessionStorage.getItem("authToken"),
            'Content-Type': 'application/json'
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to delete availability');
        document.querySelector(`button[data-id="${slotId}"]`).closest("tr").remove();
    })
    .catch(error => console.error('Failed to delete availability:', error));
}

// Appointment functions
function requestAppointment(tutorId, date, start, end, subject) {
    fetch('/src/api/user/appointments', {
        method: 'POST',
        headers: new Headers({
            'Authorization': sessionStorage.getItem("authToken"),
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            tutorId: tutorId,
            date: date,
            start: start,
            end: end,
            subject: subject
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to request appointment');
        alert('Your appointment request has been sent!');
    })
    .catch(error => console.error('Failed to request appointment:', error));
}

function cancelAppointment(appointmentId) {
    fetch(`/src/api/user/appointments/${appointmentId}`, {
        method: 'DELETE',
        headers: new Headers({
            'Authorization': sessionStorage.getItem("authToken"),
            'Content-Type': 'application/json'
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to cancel appointment');
        alert('Your appointment has been cancelled!');
    })
    .catch(error => console.error('Failed to cancel appointment:', error));
}

function acceptAppointment(appointmentId) {
    fetch(`/src/api/tutor/appointments/${appointmentId}/accept`, {
        method: 'POST',
        headers: new Headers({
            'Authorization': sessionStorage.getItem("authToken"),
            'Content-Type': 'application/json'
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to accept appointment');
        alert('You have accepted the appointment!');
        getTutorAppointments();
    })
    .catch(error => console.error('Failed to accept appointment:', error));
} 

function declineAppointment(appointmentId) {
    fetch(`/src/api/tutor/appointments/${appointmentId}/decline`, {
        method: 'POST',
        headers: new Headers({
            'Authorization': sessionStorage.getItem("authToken"),
            'Content-Type': 'application/json'
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to decline appointment');
        alert('You have declined the appointment!');
        getTutorAppointments();
    })
    .catch(error => console.error('Failed to decline appointment:', error));
}

function setRate(appointmentId, rating) {
    fetch(`/src/api/user/appointments/${appointmentId}/rate`, {
        method: 'POST',
        headers: new Headers({
            'Authorization': sessionStorage.getItem("authToken"),
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ rating: rating })
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to rate the appointment");
        alert ("You have successfully rated the appointment!");
        getUserAppointments();     
    })
    .catch(error => console.error('Failed to rate the appointment:', error));
}


// Button functions
document.getElementById("logoutButton").addEventListener("click", function() {
    fetch('/src/api/auth/logout', {
        method: 'POST',
        headers: new Headers({
            'Authorization': sessionStorage.getItem("authToken")
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

document.getElementById("deleteAccountButton").addEventListener("click", function() {
    if(confirm("Are you sure you want to delete your account?")) {
        fetch('/src/api/user', {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': sessionStorage.getItem("authToken"),
                'Content-Type': 'application/json'
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete account');
            alert('Your account has been successfully deleted!');
            sessionStorage.clear();
            window.location.href = "login.html";
        })
        .catch(error => {
            console.error('Failed to delete account:', error);
            alert('Failed to delete account');
        });
    }
});

document.getElementById("rateButton").addEventListener("click", function() {
    const selectedRating = document.getElementById("rating").value;
    setRate(selectedRating);
});

fetchUserDetails();