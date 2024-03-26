document.addEventListener("DOMContentLoaded", function() {
  const loginForm = document.querySelector(".auth-form");

  loginForm.addEventListener("submit", function(event) {
    event.preventDefault(); // 

    const emailInput = document.querySelector("#uname");
    const passwordInput = document.querySelector("#password");

    const email = emailInput.value;
    const password = passwordInput.value;

    const formData = {
      email: email,
      password: password
    };

   
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => {
      if (!response.ok) {
       
        throw new Error('Http error ');
      }
       return response.json();
    })
    .then(data => {
  
     sessionStorage.setItem("userData", JSON.stringify(data));
      console.log("Login successful. User data:", data);
 window.location.href = "profile.html"; 
    })
    .catch(error => {
      
      console.error('Login failed :', error);
      alert('Invalid Username or password ');
    });
  });
});
