const btn_style = "bg-gray-800 text-white font-medium rounded-lg px-4 py-2.5 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300";

function setRate(appointmentId, rating, review = null) {
    fetch(`/api/appointment/rate`, {
        method: 'POST',
        headers: new Headers({
            'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({ rating: rating, review: review, appointment_id: appointmentId})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to rate the appointment");
        }
        alert ("You have successfully rated and reviewed the appointment!");
        getUserAppointments();     
    })
    .catch(error => console.error('Failed to rate the appointment:', error));
}

function submitRatingAndReview (appointmentId, rating, review) {
    setRate(appointmentId, rating, review);
}

function editAppointment(appointmentId, newStart, newEnd) {
    const body = JSON.stringify({
        start: newStart,
        end: newEnd,
        appointment_id: appointmentId
    });

    fetch(`/api/appointment/`, {
        method: 'POST',
        headers: new Headers({
            'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
            'Content-Type': 'application/json'
        }),
        body: body
    }) 
    .then(response => {
        if (!response.ok) throw new Error('Failed to edit appointment');
        alert('Your appointment has been successfully edited!');
    })
    .catch(error => console.error('Failed to edit appointment:', error));
}

function cancelAppointment(appointmentId) {
    const body = JSON.stringify({ appointment_id: appointmentId });

    fetch(`/api/appointment/`, {
        method: 'DELETE',
        headers: new Headers({
            'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
            'Content-Type': 'application/json'
        }),
        body: body
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to cancel appointment');
        alert('Your appointment has been cancelled!');
    })
    .catch(error => console.error('Failed to cancel appointment:', error));
}

class AppointmentPanel {
    constructor(domID) {
        this.domID = domID;
    }

    clear() {
        document.getElementById(this.domID).innerHTML = '';
    }

    acceptAppointment(appointmentId) {
        const body = JSON.stringify({ appointment_id: appointmentId });

        fetch(`/api/appointment/accept`, {
            method: 'POST',
            headers: new Headers({
                'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
                'Content-Type': 'application/json'
            }),
            body: body
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to accept appointment');
            alert('You have accepted the appointment!');
            this.render();
        })
        .catch(error => console.error('Failed to accept appointment:', error));
    }

    deleteAppointment(appointmentId) {
        const body = JSON.stringify({ appointment_id: appointmentId });

        fetch(`/api/appointment`, {
            method: 'DELETE',
            headers: new Headers({
                'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
                'Content-Type': 'application/json'
            }),
            body: body
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to decline appointment');
            alert('You have declined/deleted the appointment!');
            this.render();
        })
        .catch(error => console.error('Failed to decline appointment:', error));
    }

    rateAppointment(appointmentId) {
        // prompt for the rating
        let rating = prompt('Please rate the appointment (1-5):');
        if (rating == null) return;

        const body = JSON.stringify({ appointment_id: appointmentId });

        fetch(`/api/appointment/rate`, {
            method: 'POST',
            headers: new Headers({
                'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
                'Content-Type': 'application/json'
            }),
            body: body
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to rate appointment');
            alert('You have rated the appointment!');
            this.render();
        })
        .catch(error => console.error('Failed to rate appointment:', error));
    }

    render() {
        this.clear();

        fetch(`/api/appointment`, {
            method: 'GET',
            headers: new Headers({
                'authorization': JSON.parse(sessionStorage.getItem("userData")).token
            })
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to get appointments');
            return response.json();
        })
        .then(appointments => {
            let table = document.getElementById(this.domID);

            // if there are no appointments show the "no appointments" message
            if (appointments.length == 0)
                document.getElementById("no-appointments").style.display = "block";
            else
                document.getElementById("no-appointments").style.display = "none";

            // render the appointments
            appointments.forEach(appointment => {
                let row = document.createElement("tr");
                let userData = JSON.parse(sessionStorage.getItem("userData"));
                let confirm = 'pending';
               
                if (userData.is_tutor) {
                    if (appointment.is_confirmed)
                        confirm = `
                            <button class="${ btn_style}" onclick="appointmentPanel.deleteAppointment('${appointment.appointment_id }')">Cancel</button>
                        `;
                    else
                        confirm = `
                            <button class="${ btn_style}" onclick="appointmentPanel.acceptAppointment('${appointment.appointment_id }')">Accept</button>
                            <button class="${ btn_style}" onclick="appointmentPanel.deleteAppointment('${appointment.appointment_id }')">Decline</button>
                        `;
                } else {
                    // if it's not rated and the appointment time has passed
                    if (!appointment.is_rated && new Date(appointment.end_time) < new Date())
                        confirm = `<button class="${btn_style}" onclick="appointmentPanel.rateAppointment('${ appointment.appointment_id }')">Rate</button>`;
                    else if (appointment.is_rated)
                        confirm = 'rated';
                }

                console.log(appointment);

                let start_date = new Date(Number(appointment.start_time)).toDateString();
                let end_date = new Date(Number(appointment.end_time)).toDateString();
                row.innerHTML = `
                    <td>${ start_date }</td>
                    <td>${ end_date }</td>
                    <td>${ appointment.subject }</td>
                    <td>${ confirm }</td>
                `;
                table.appendChild(row);
            });
        })
        .catch(error => console.error('Failed to render appointments:', error));
    }
}