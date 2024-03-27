
class AvailabilityPanel {

    constructor(domID) {
        this.domID = domID;
    }

    show() {
        // set the display style to block
        document.getElementById("availability-panel").style.display = 'block';
    }

    clear() {
        document.getElementById(this.domID).innerHTML = '';
    }

    clearInputs() {
        document.getElementById('date').value = '';
        document.getElementById('start').value = '';
        document.getElementById('end').value = '';
        document.getElementById('subject').value = '';
    }

    render() {
        this.clear();

        return fetch(`/api/availability`, {
            method: 'GET',
            headers: {
                'authorization': JSON.parse(sessionStorage.getItem("userData")).token
            }
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch availability');
            return response.json();
        })
        .then(data => {
            let table = document.getElementById(this.domID);
            data.forEach(slot => {
                const row = document.createElement('tr');
                const days = slot.days.join(', ');
                const id = slot.availability_id;
                row.innerHTML = `
                    <td>${days}</td>
                    <td>${slot.start_hour}</td>
                    <td>${slot.end_hour}</td>
                    <td>${slot.subject}</td>
                    <td><button data-id="${id}" onclick="availabilityPanel.deleteAvailability('${id}')">Delete</button></td>
                `;
                table.appendChild(row);
            });

            document.getElementById(this.domID).appendChild(table);
        })
        .catch(error => console.error('Failed to render availability:', error));
    }

    createAvailability(days, start_hour, end_hour, subject) {
        let userData = JSON.parse(sessionStorage.getItem("userData"));
        const body = JSON.stringify({
            tutor_id: userData._id,
            days: days,
            start_hour: start_hour,
            end_hour: end_hour,
            subject: subject
        });

        return fetch('/api/availability', {
            method: 'PUT',
            headers: new Headers({
                'authorization': getUserToken(),
                'Content-Type': 'application/json'
            }),
            body: body
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to add your availability');
            return response.json();
        })
        .then(newSlot => {
            return this.render()
        })
        .then(() => {
            console.log('Availability added successfully')
            this.clearInputs();
        })
        .catch(error => console.error('Failed to add your availability:', error));
    }

    deleteAvailability(availability_id) {
        const body = JSON.stringify({ availability_id: availability_id });

        fetch(`/api/availability`, {
            method: 'DELETE',
            headers: new Headers({
                'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
                'Content-Type': 'application/json'
            }),
            body: body
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to delete availability');
            document.querySelector(`button[data-id="${availability_id}"]`).closest("tr").remove();
            this.render();
        })
        .catch(error => console.error('Failed to delete availability:', error));
    }
}