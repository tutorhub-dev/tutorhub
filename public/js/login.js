// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
  // Select the login form
  const loginForm = document.querySelector(".auth-form");
  // Add event listener for form submission
  loginForm.addEventListener("submit", function(event) {
      event.preventDefault();
      // Get values from input fields
      const emailInput = document.querySelector("#uname");
      const passwordInput = document.querySelector("#password");

      const email = emailInput.value;
      const password = passwordInput.value;

      const formData = {
          email: email,
          password: password
      };

      // Send form data to server for login
      fetch("/api/login", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(formData)
          })
          .then(response => {
              if (!response.ok) {
                // if the error is 401, alert the user that the credentials are invalid
                if (response.status === 401) {
                    Swal.fire({
                        icon: "error",
                        title: "Invalid Credentials",
                        text: "Double check that you've entered your username and password correctly"
                    });
                }

                else throw new Error('Http error ');
              }
              // Parse response body as JSON
              return response.json();
          })
        .then(data => {
            // Store user data in session storage
            sessionStorage.setItem("userData", JSON.stringify(data));
            console.log("Login successful. User data:", data);

            // Redirect to profile page after successful login
            window.location.href = "profile.html";
        })
        .catch(error => {
            console.error('Login failed :', error);

            Swal.fire({
                icon: "error",
                title: "Login Failed",
                text: "Double check that you've entered your email and password correctly"
            });
        });
    });
});