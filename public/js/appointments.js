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

function acceptAppointment(appointmentId) {
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
        getTutorAppointments();
    })
    .catch(error => console.error('Failed to accept appointment:', error));
} 

function declineAppointment(appointmentId) {
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
        alert('You have declined the appointment!');
        getTutorAppointments();
    })
    .catch(error => console.error('Failed to decline appointment:', error));
}
