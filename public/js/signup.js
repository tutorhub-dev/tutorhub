// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
  const signupForm = document.querySelector(".signup-form");
  // Add event listener for form submission
  signupForm.addEventListener("submit", function(event) {
      // Prevent default form submission behavior
      event.preventDefault();
      // Select form input fields
      const firstNameInput = document.querySelector("#fname");
      const lastNameInput = document.querySelector("#lastname");
      const usernameInput = document.querySelector("#uname1");
      const passwordInput = document.querySelector("#pwd");
      const confirmPasswordInput = document.querySelector("#pwd1");
      const emailInput = document.querySelector("#Email");
      const isTutorInput = document.querySelector("#is-tutor");

      // Get values from input fields
      const firstName = firstNameInput.value;
      const lastName = lastNameInput.value;
      const username = usernameInput.value;
      const password = passwordInput.value;
      const confirmPassword = confirmPasswordInput.value;
      const email = emailInput.value;
      const is_Tutor = isTutorInput.checked;




      // Check if passwords match
      if (password !== confirmPassword) {
          alert("Passwords do not match");
          return;
      }
      // Prepare form data to send
      const formData = {
          first_name: firstName,
          last_name: lastName,
          username: username,
          password: password,
          email: email,
          is_tutor: is_Tutor
      };
      // Send form data to server
      fetch("/api/user", {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json"
              },
              body: JSON.stringify(formData)
          })
          .then(response => {
              if (!response.ok) {
                  if (response.status === 409) {
                      // Conflict error: email already exists
                      console.error('Email already exists');
                      throw new Error('Email already exists');
                  } else {
                      // Other server-side errors
                      throw new Error('HTTP error ' + response.status);
                  }
              }
              return response.json();
          })
          .then(data => {
              // Store user data in local storage
              sessionStorage.setItem("userData", JSON.stringify(data));
              console.log("Signup successful. User data:", data);

              // Redirect based on user selection
              if (is_Tutor) {
                  window.location.href = "profile.html"; // Redirect to tutor dashboard
              } else {
                  window.location.href = "profile.html"; // Redirect to user dashboard
              }
          })
          .catch(error => {
              console.error('Signup failed:', error);
              if (error.message === 'Email already exists') {
                  alert('Email already exists. Please use a different email.');
              } else {
                  alert('Signup failed. Please try again later.');
              }
          });
  });
});