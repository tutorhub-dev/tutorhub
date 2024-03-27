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

    const isTutor = sessionStorage.getItem("isTutor") === "true";
    const hourlyRateField = document.getElementById("hourlyRateField");

    if (isTutor && hourlyRateField) {
        hourlyRateField.style.display = "block";
    }

    function validateUsername(username) {
        const usernameRegex = /^[a-zA-Z0-9]{4,}$/;
        return usernameRegex.test(username);
    }

    function validateEmail(email) {
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    function notEmpty(value) {
        return value.trim() !== "";
    }


    // Function to handle editing user profile
    function editUser() {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const hourlyRate = isTutor ? document.getElementById("hourlyRate").value : null;
        
        document.querySelectorAll('.error-message').forEach(e => e.textContent = '');

        let isValid = true;

        if (!validateEmail(email)) {
            document.getElementById("email-error").textContent = "Invalid email";
            isValid = false;
        }

        if (!validateUsername(username)) {
            document.getElementById("username-error").textContent = "Invalid username";
            isValid = false;
        }

        if (!validatePassword(password)) {
            document.getElementById("password-error").textContent = "Password must be at least 8 characters long and contain at least one letter and one number";
            isValid = false;
        }

        if (password !== confirmPassword) {
            document.getElementById("confirm-password-error").textContent = "Passwords do not match";
            isValid = false;
        }

        if (!notEmpty(username) || !notEmpty(email) || !notEmpty(password) || !notEmpty(confirmPassword)) {
            alert('Please fill out all fields');
            isValid = false;
        }

        if (!isValid) return;

        // Create form data object to send user data
        const formData = {
            username: username,
            password: password,
            email: email,
            hourlyRate: hourlyRate,
          };
        // Retrieve user token from session storage
        let data = sessionStorage.getItem("userData");
        let userData = JSON.parse(data);

        const apiEndpoint = isTutor ? '/api/tutor' : '/api/user';

        // Send POST request to update user data
        fetch(apiEndpoint, {
            method: 'POST',
            headers: {
                'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json()) 
        .then(data => {
            alert('Your account has been successfully updated!');
            window.location.href = "profile.html";
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
                    'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) throw new Error('Failed to delete account');
                alert('Your account has been deleted!');
                sessionStorage.clear();
                window.location.href = "index.html";
            })
            .catch(error => {
                // Log and alert user for any errors
                console.error('Failed to delete account:', error);
                alert('Failed to delete account');
            });
        }
    }
});

