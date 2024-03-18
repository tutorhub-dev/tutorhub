document.getElementById("editAccountButton").addEventListener("click", function() {
    window.location.href = "editProfile.html";
})

function editUser() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const profilePic = document.getElementById("pfp").files[0];

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('confirm-password', confirmPassword);
    formData.append('pfp', profilePic);

    fetch('/user/update', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + sessionStorage.getItem("authToken")
        },
        body: formData
    })
    .then(response => {
        if(response.ok) {
            alert('Your account has been successfully updated!');
            window.location.href = "profile.html";
        } else {
            throw new Error('Failed to update account');
        }
    })
    .catch(error => {
        console.error('Failed to update account:', error);
        alert('Failed to update account');
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const editForm = document.getElementById("edit-form");
    if(editForm) {
        editForm.addEventListener("submit", function(event) {
            event.preventDefault();
            editUser();
        });
    } else {
        console.error('Edit form not found');
    }
});