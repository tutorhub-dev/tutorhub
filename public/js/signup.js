document.addEventListener("DOMContentLoaded", function() {
  const signupForm = document.querySelector(".signup-form");

  signupForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const firstNameInput = document.querySelector("#fname");
    const lastNameInput = document.querySelector("#lastname");
    const usernameInput = document.querySelector("#uname1");
    const passwordInput = document.querySelector("#pwd");
    const confirmPasswordInput = document.querySelector("#pwd1");
    const emailInput = document.querySelector("#Email");
    const isTutorInput = document.querySelector("#is-tutor");
   

    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const username = usernameInput.value;
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;
    const email = emailInput.value;
    const isTutor = isTutorInput.checked;
   


    
    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formData = {
      firstName: firstName,
      lastName: lastName,
      username: username,
      password: password,
      email: email,
      isTutor: isTutor,
    
    };

    fetch("/api/user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('HTTP error ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      // Store user data in local storage
      localStorage.setItem("userData", JSON.stringify(data));
      console.log("Signup successful. User data:", data);

      // Redirect based on user selection
      if (isTutor) {
        window.location.href = "profile.html"; // Redirect to tutor dashboard
      } else {
        window.location.href = "index.html"; // Redirect to user dashboard
      }
    })
    .catch(error => {
      console.error('Signup failed:', error);
      alert('Signup failed. Please try again later.');
    });
  });
});
