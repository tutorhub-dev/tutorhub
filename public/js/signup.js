function validateForm(){
   
   
    var EmailRegx = /\S+@\S+\.\S+/;
    var email= document.getElementById("uname").value;
   var passwordRegx=/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
   var Password=document.getElementById("password").value;
   if(!EmailRegx.test(email)) {
      alert("You have entered a invalid email address!");
      
       return false;
   }
   if(!passwordRegx.test(Password)){
    alert("Invalid password")
    return false;
   }
   return true;
}


 function SubmitFunction() {
  
    if(!validateForm()) {
        event.preventDefault()
      
    }
    else{
    document.forms["auth-form"].submit();
}

 }

 function validateSignup() {


 

    var emailInput = document.getElementById("Email");
    var emailValue = emailInput.value;
    var emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(emailValue)) {
      alert("Please enter a valid email address.");
      return false;
    }
 

    var passwordInput = document.getElementById("pwd");
    var confirmPasswordInput = document.getElementById("pwd1");
    var passwordValue = passwordInput.value;
    var confirmPasswordValue = confirmPasswordInput.value;
    if (passwordValue.length < 6) {
      alert("Password must be at least 6 characters long.");
      return false;
    }
 
    if (passwordValue != confirmPasswordValue) {
      alert("Passwords do not match.");
      return false;
    }
    


    var usernameInput = document.getElementById("uname1");
    var usernameValue = usernameInput.value;
    var usernameRegex = /^[a-zA-Z]+$/;
    if (!usernameRegex.test(usernameValue)) {
      alert("Username can only contain alpha characters and no spaces.");
      return false;
    }
  

    return true;
  }
  



  