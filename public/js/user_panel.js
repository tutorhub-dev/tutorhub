class UserPanel {
    constructor(domID) {
        this.domID = domID;
    }

    render() {
        const userData = JSON.parse(sessionStorage.getItem("userData"));

        // set the user data
        document.getElementById("profile-username").innerHTML = "@" + userData.username;
        document.getElementById("profile-email").innerHTML = userData.email;
    }
}