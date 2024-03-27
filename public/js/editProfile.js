// Function to handle editing user profile
function editUser() {
    let formData = {};

    const firstname = document.getElementById("first-name").value;
    const lastname = document.getElementById("last-name").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const hourly_rate = document.getElementById("hourly-rate").value;

    // create the form data
    if (firstname !== '') formData.first_name = firstname;
    if (lastname !== '') formData.last_name = lastname;
    if (username !== '') formData.username = username;
    if (email !== '') formData.email = email;
    if (hourly_rate !== '') formData.hourly_rate = hourly_rate;

    // Retrieve user token from session storage
    let data = sessionStorage.getItem("userData");
    let userData = JSON.parse(data);

    // Send POST request to update user data
    let url = '/api/user'
    if (userData.is_tutor) url = '/api/tutor'

    fetch(url, {
        method: 'POST',
        headers: {
            'authorization': userData.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            alert('Your account has been updated!');
            window.location.href = "profile.html";
        } else {
            throw new Error('Failed to update account');
        }
    })
    .catch(error => {
        // Log and alert user for any errors
        console.error('Failed to update account:', error);
        alert('Failed to update account');
    });
}

// Function to handle deleting user account
function deleteUser() {
    if (confirm("Are you sure you want to delete your account?")) {
        // Retrieve user token from session storage
        let data = sessionStorage.getItem("userData");
        let userData = JSON.parse(data);

        // Send DELETE request to delete user account
        fetch('/api/user', {
            method: 'DELETE',
            headers: {
                'authorization': userData.token,
            }
        })
        .then(response => {
            if (response.ok) {
                alert('Your account has been deleted!');
                window.location.href = "login.html";
            }
            else {
                throw new Error('Failed to delete account');
            }
        })
        .catch(error => {
            // Log and alert user for any errors
            console.error('Failed to delete account:', error);
            alert('Failed to delete account');
        });
    }
}

// on page load
document.addEventListener("DOMContentLoaded", function() {
    // Add event listener to edit form for form submission
    const editForm = document.getElementById("edit-form");
    if (editForm) {
        editForm.addEventListener("submit", function(event) {
            event.preventDefault();
            editUser();
        });
    } else {
        console.error('Edit form not found');
    }
     
    // Add event listener to delete account button
    const deleteAccountButton = document.getElementById("deleteAccountButton");
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener("click", function() {
            deleteUser();
        });
    } else {
        console.error('Delete account button not found');
    }

    // get the user data
    let userData = JSON.parse(sessionStorage.getItem("userData"));
    if (!userData) {
        // redirect to login page
        window.location.href = "login.html";
    }

    // populate the form
    document.getElementById("first-name").value = userData.first_name;
    document.getElementById("last-name").value = userData.last_name;
    document.getElementById("username").value = userData.username;
    document.getElementById("email").value = userData.email;
    
    if (userData.is_tutor) {
        document.getElementById("hourlyRateField").style.display = "block";
        document.getElementById("hourly-rate").value = userData.hourly_rate;
    }
});