const book_btn_style = "bg-green-500 text-white font-medium rounded-lg px-4 py-2.5 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 w-full";

class SearchPanel {
    constructor(domID) {
        this.domID = domID;
    }

    clear() {
        document.getElementById(this.domID).innerHTML = "";
    }

    render(data) {
        this.clear();

        // if no data, bail
        if (!data || data.length == 0) return;

        let table = document.getElementById(this.domID);
        data.forEach(slot => {
            const row = document.createElement('tr');

            // make the timeslot
            let timeslot = this.#formatTime(slot.start_hour)
                + " - "
                + this.#formatTime(slot.end_hour);

            // captialize the first letter of each day
            slot.days = slot.days.map(day => day.charAt(0).toUpperCase() + day.slice(1));

            // make the row
            row.innerHTML = `
                <td>${slot.days}</td>
                <td>${timeslot}</td>
                <td>${slot.subject}</td>
                <td><button id="${slot.availability_id}" class="${book_btn_style}">Book</button></td>
            `;

            table.appendChild(row);

            // get the button and attatch the click event
            let button = document.getElementById(slot.availability_id);
            button.addEventListener('click', () => this.book(slot));
        });
    }

    search() {
        let tutor = document.getElementById("usernameInput").value;
        let subject = document.getElementById("subjectInput").value;
        let day = document.getElementById("dayInput").value.toLowerCase();

        let query = {};
        if (tutor != "") query.tutor_username = tutor;
        if (subject != "") query.subject = subject;
        if (day != "") query.day = day;

        fetch('/api/search', {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(query)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to search');
            }
        })
        .then(data => {
            // if there were no results, display a message with swal
            if (data.length == 0) {
                Swal.fire({
                    icon: "error",
                    title: "404!",
                    text: "No results were found for your search."
                });
            } else this.render(data)
        })
        .catch(error => {
            // if the status code is 404 alert with swal
            if (error.message == 'Failed to search') {
                Swal.fire({
                    icon: "error",
                    title: "404!",
                    text: "No results were found for your search."
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "An internal error occured."
                });

                console.error('Failed to search:', error);
            }
        });
    }

    validate() {
        // check if all three inputs are blank
        let tutor = document.getElementById("usernameInput").value;
        let subject = document.getElementById("subjectInput").value;
        let day = document.getElementById("dayInput").value;

        let searchbtn = document.getElementById("search-button");
        if (tutor == "" && subject == "" && day == "") {
            searchbtn.disabled = true;
            searchbtn.style.backgroundColor = "gray";
            document.getElementById("form-warning").style.display = "block";
        } else {
            searchbtn.disabled = false;
            searchbtn.style.backgroundColor = ""; // Remove the CSS styling
            document.getElementById("form-warning").style.display = "none";
        }
    }

    #selectDay(appointment, userData) {
        if (appointment.days.length > 1) {
            return Swal.fire({
                title: "Select a day",
                input: "radio",
                inputOptions: appointment.days.reduce((obj, day) => {
                    obj[day] = day;
                    return obj;
                }, {}),
                inputPlaceholder: "Select a day",
                showCancelButton: true,
                confirmButtonText: "Book",
                showLoaderOnConfirm: false
            }).then(result => {
                if (result.isConfirmed)
                    return new Promise((resolve) => resolve(result.value));
                else
                    Promise.reject('User cancelled the prompt');
            });
        } else {
            return new Promise((resolve) => resolve(appointment.days[0]));
        }
    }
    
    book(appointment) {
        let userData = JSON.parse(sessionStorage.getItem("userData"));
        
        // prompt with Swal to ask the user what day they want to book if there are multiple days
        this.#selectDay(appointment, userData)
        .then(day => {
            console.log(day);

            let start_time = this.#getNextDay(day);
            start_time.setHours(appointment.start_hour);

            let end_time = this.#getNextDay(day);
            end_time.setHours(appointment.end_hour);

            let body = {
                tutor_id: appointment.tutor_id,
                user_id: userData._id,
                start_time: start_time.getTime(),
                end_time: end_time.getTime(),
                subject: appointment.subject
            };

            return fetch('/api/appointment', {
                method: 'PUT',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'authorization': userData.token
                }),
                body: JSON.stringify(body)
            })
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to book appointment');
            }
        })
        .then((response) => {
            // show the contact information
            Swal.fire({
                title: "Success, but don't go yet!",
                icon: "success",
                html: `
                    <p>Your appointment was booked successfully! Here are your tutors contact details. <br>For privacy reasons <bold>these are not saved.</bold> Be sure to write them down!</p>
                    <p><strong>Name:</strong> ${response.name}</p>
                    <p><strong>Email:</strong> ${response.email}</p>
                `
            });
        })
        .catch(error => {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "An internal error occured."
            });

            console.error('Failed to book appointment:', error);
        });
    }

    #getNextDay(day) {
        // return a Date() object that matches the next occurence of the specified day
        let days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        let today = new Date();
        let target = days.indexOf(day.toLowerCase());
        let diff = target - today.getDay();

        // if the target day is today, return the next week's day
        if (diff <= 0) diff += 7;

        let nextDay = new Date(today);
        nextDay.setDate(today.getDate() + diff);
        return nextDay;
    }

    #formatTime(time) {
        // convert from decimal to 12-hour time
        let hours = Math.floor(time);
        let minutes = Math.round((time - hours) * 60);

        // convert from 24-hour to 12-hour time
        let suffix = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;

        // handle midnight
        hours = hours ? hours : 12;

        // handle single digit minutes
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return `${hours}:${minutes} ${suffix}`;
    }
}