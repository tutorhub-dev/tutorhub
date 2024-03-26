document.addEventListener("DOMContentLoaded", function() {
    // Function to handle editing user profile
    function editUser() {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm-password").value;
        const profilePic = document.getElementById("pfp").files[0];

        // Create form data object to send user data
        const formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confirm-password', confirmPassword);
        formData.append('pfp', profilePic);

        // Retrieve user token from session storage
        let data = sessionStorage.getItem("userData");
        let userData = JSON.parse(data);

        // Send POST request to update user data
        fetch('/user/update', {
            method: 'POST',
            headers: {
                'authorization': userData.token
            },
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Display success message and redirect to profile page
                alert('Your account has been successfully updated!');
                window.location.href = "profile.html";
            } else {
                // Throw error for failed update
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
                    'authorization': userData.token
                }
            })
            .then(response => {
                if (response.ok) {
                    // Display success message and redirect to login page
                    alert('Your account has been successfully deleted!');
                    window.location.href = "login.html";
                } else {
                    // Throw error for failed deletion
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
});
