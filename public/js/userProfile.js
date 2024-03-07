document.addEventListener('DOMContentLoaded', function() {
    // Placeholder data for the user profile
    const studentProfile = {
        name: "Winston Nguyen",
        profilePicture: "path/to/student-profile-picture.jpg",
        appointments: [
            { subject: "Math", date: "YYYY-MM-DD HH:MM" },
            { subject: "Science", date: "YYYY-MM-DD HH:MM" },
        ]
    };

        document.getElementById("userName").textContent = studentProfile.name;
        document.getElementById("pfp").src = studentProfile.profilePicture; 

        const appointmentList = document.getElementById("appointmentList");
        studentProfile.appointments.forEach(appointment => {
            const listItem = document.createElement("li");
            listItem.textContent = `${appointment.subject} - ${appointment.date}`;
            appointmentList.appendChild(listItem);
        }); 


        document.getElementById("logoutButton").addEventListener("click", function() {
            // Placeholder code for logging out
            console.log("Logging out...");

            sessionStorage.clear();
            window.location.href = "whateverIbrahimNamesTheLoginPage.html";
        });
});