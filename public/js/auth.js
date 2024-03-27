function checkLogin() {
    if (!sessionStorage.getItem("userData")) {
        window.location.href = "login.html";
    }
}

// on dom load event
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("logoutButton").addEventListener("click", function () {
        fetch('/api/logout', {
            method: 'POST',
            headers: new Headers({
                'authorization': JSON.parse(sessionStorage.getItem("userData")).token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({})
        })
            .then(response => {
                if (response.ok) {
                    sessionStorage.clear();
                    window.location.href = "index.html";
                } else {
                    throw new Error('Failed to log out');
                }
            })
            .catch(error => console.error('Failed to log out:', error));
    });
});