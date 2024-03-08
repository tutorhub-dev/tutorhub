document.getElementById("add-availability").addEventListener("click", function() {
    const start = document.getElementById("start").value;
    const end = document.getElementById("end").value;
    const subject = document.getElementById("subject").value;

    addAvailability(start, end, subject);

    document.getElementById("start").value = "";
    document.getElementById("end").value = "";
    document.getElementById("subject").value = "";
});


function addAvailability(start, end, subject) {
    fetch('/tutor/availability', {
        method: 'POST',
        headers: new Headers({
            'Authorization': sessionStorage.getItem("authToken"),
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
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

        const startCell = addRow.insertCell(0);
        const endCell = addRow.insertCell(1);
        const subjectCell = addRow.insertCell(2);

        startCell.textContent = start;
        endCell.textContent = end;
        subjectCell.textContent = subject;

        const deleteCell = addRow.insertCell(3);
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Availability";
        deleteButton.dataset.id = newSlot.id;
        deleteButton.onclick = function() { deleteAvailability(newSlot.id); };
        deleteCell.appendChild(deleteButton);
    })
    .catch(error => console.error('Failed to add your availability:', error));   
}

function deleteAvailability(slotId) {
    fetch('/tutor/availability', { /* Maybe add a slotId feature in the availability API? */
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

function fetchAndDisplayAvailability() {
    fetch('/tutor/availability', {
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

document.addEventListener("DOMContentLoaded", fetchAndDisplayAvailability);

document.getElementById("deleteAccountButton").addEventListener("click", function() {
    if(confirm("Are you sure you want to delete your account?")) {
        fetch('/user', {
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

document.getElementById("logoutButton").addEventListener("click", function() {
    fetch('/auth/logout', {
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