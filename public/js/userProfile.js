document.addEventListener('DOMContentLoaded', function() {
    
    const authToken = sessionStorage.getItem("authToken");
    if (!authToken) {
        window.location.href = "login.html";
        return;
    }

    const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': authToken
    });

    fetch('/user', {
        method: 'POST',
        headers: headers,
    })

    .then(response => response.json())
    .then(data => {
        document.getElementById("userName").textContent = data.name;
        document.getElementById("pfp").src = data.profilePicture;
    })

    .catch(error => console.error('Failed to fetch user data:', error));

    fetch('/user/appointments', {
        method: 'POST',
        headers: headers,
    })
    .then(response => response.json())
    .then(data => {
        const appointmentList = document.getElementById("appointmentList");
        data.forEach(appointment => {
            const listItem = document.createElement("li");
            listItem.textContent = `${appointment.subject} - ${appointment.date}`;
            appointmentList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Failed to fetch user appointments:', error));

});

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