/** User Interface **/
let txtUser = document.getElementById("txtUser");
let txtEmail = document.getElementById("txtEmail");
let txtPassword = document.getElementById("txtPassword");
let txtConfirm = document.getElementById("txtConfirm");
const emailRegex = /^\w+@[a-zA-Z_]+?.[a-zA-Z]{2,3}$/;
let logUser = document.getElementById("logUser");
let logPassword = document.getElementById("logPassword");

/* Utilizing JQuery */
/* Show/Hide the Login form */
$(document).ready(function () {
    /* Show/Hide the Login form */
    $(".btnLogin").click(function () {
        $("#container_login").fadeIn(300).css("display", "flex");  
        $("#container_register, #btn_user").fadeOut(300);
    });

    /* Show/Hide the Registration form */
    $(".btnRegister").click(function () {
        $("#container_register").fadeIn(300).css("display", "flex");  
        $("#container_login, #btn_user").fadeOut(300);
    });
});

/* Hide Forms */
function hideForm() {
    // Hide Login & Register
    $("#container_register, #container_login").fadeOut(300);

    // Show User button
    $("#btn_user").fadeIn(300).css("display", "flex");
}

// Select class name then run event when clicked
document.querySelectorAll(".btnReturn").forEach(function(button) {
    button.addEventListener("click", hideForm);
    button.addEventListener("click", clearForm);
});

/* Register Functions */
// Add User
const formRegister = document.getElementById("container_register");

formRegister.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent Form Submission

    validateForm(); // Validate Form
});

// Validate Form
function validateForm() {
    // Check if field are empty
    if(txtUser.value == "" || txtEmail.value == "" || txtPassword == "" || txtConfirm == "") {
        alert("Please fill out the field.")
        return false;
    }

    // Check valid email
    if(!emailRegex.test(txtEmail.value)) {
        alert("Invalid Email Address")
        txtEmail.focus();
        return false;
    }

    // Check valid password
    if(txtPassword.value.length < 8) {
        alert("Password must be at least 8 characters long")
        txtPassword.focus();
        txtPassword.style.border = "1px solid crimson";
        txtPassword.style.boxShadow = "0 0 0 1px black";
        return false;
    } else {
        txtPassword.style.border = "1px solid #ccc";
        txtPassword.style.boxShadow = "0 0 0 1px black";
    }

    // Check if Password is the same
    if (txtPassword.value !== txtConfirm.value) {
        alert("Please make sure the password you enter is the same!")
        txtConfirm.value = "";
        txtConfirm.focus();
        txtConfirm.style.border = "1px solid crimson";
        txtConfirm.style.boxShadow = "0 0 0 1px black";
        return false;
    } else {
        txtConfirm.style.border = "1px solid #ccc";
        txtConfirm.style.boxShadow = "0 0 0 1px black";
    }

    // Retrieve existing users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if User already exists
    if (users.some(user => user.user === txtUser.value)) {
        alert("Username already exists!");
        txtUser.value = "";
        txtUser.focus();
        txtUser.style.border = "1px solid crimson";
        txtUser.style.boxShadow = "0 0 0 1px black";
        return;
    } else {
        txtUser.style.border = "1px solid #ccc";
        txtUser.style.boxShadow = "0 0 0 1px black";
    }

    // Check if Email already exists
    if (users.some(email => email.email === txtEmail.value)) {
        alert("Email already exists!");
        txtEmail.value = "";
        txtEmail.focus();
        txtEmail.style.border = "1px solid crimson";
        txtEmail.style.boxShadow = "0 0 0 1px black";
        return;
    } else {
        txtUser.style.border = "1px solid #ccc";
        txtUser.style.boxShadow = "0 0 0 1px black";
    }

    // Store new User in localStorage
    let newUser = new User(txtUser.value, txtEmail.value, txtPassword.value);
    users.push({user: newUser.getUser(), email: newUser.getEmail(), password: newUser.getPassword()});
    localStorage.setItem("users", JSON.stringify(users));

    // After completing Registration
    alert("Registration Successful!");

    // Fade effect after the alert
    $("body").fadeOut(300).fadeIn(300);

    // Clear User inputs
    clearForm();
    hideForm();

    return true;
}

// Clear Form & Border
function clearForm() {
    txtUser.focus();
    txtUser.value = "";
    txtEmail.value = "";
    txtPassword.value = "";
    txtConfirm.value = "";
    txtUser.style.border = "1px solid #ccc";
    txtUser.style.boxShadow = "none";
    txtEmail.style.border = "1px solid #ccc";
    txtEmail.style.boxShadow = "none";
    txtPassword.style.border = "1px solid #ccc";
    txtPassword.style.boxShadow = "none";
    txtConfirm.style.border = "1px solid #ccc";
    txtConfirm.style.boxShadow = "none";
    logUser.value = "";
    logPassword.value = "";
    logUser.style.border = "1px solid #ccc";
    logUser.style.boxShadow = "none";
    logPassword.style.border = "1px solid #ccc";
    logPassword.style.boxShadow = "none";
}
// Select class name then run event when clicked
document.querySelector(".btnClear").addEventListener("click", clearForm);

/* Log In Functions */
const formLogin = document.getElementById("container_login");

formLogin.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent Form Submission

    // Retrieve users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Check if user exists
    let validUser = users.find(user => user.user === logUser.value && user.password === logPassword.value);

    // Login Result
    if (validUser) {
        alert("Login Successful!"); 
        clearForm();

        // Store Logged User in localStorage
        localStorage.setItem("loginUser", JSON.stringify(validUser));
        
        // Move to Online Booking Interface
        $("body").fadeOut(500, function () {
            window.location.href = "online_booking.html";
        });
    } else {
        alert("Invalid Username or Password!");
        logUser.focus();
        logUser.style.border = "1px solid crimson";
        logUser.style.boxShadow = "0 0 0 1px black";
        logPassword.style.border = "1px solid crimson";
        logPassword.style.boxShadow = "0 0 0 1px black";
    }
});