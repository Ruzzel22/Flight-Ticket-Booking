/* Online Booking JS */
/* Content Show */
$(document).ready(function () {
    let sections = ["#events", "#available_tickets", "#electronic_ticket", "#payment", "#booking", "#cancelRefund"];

    $(".sidebar ul li a").each(function (index) {
        $(this).click(function () {
            // Hide current section
            $(sections.join(", ")).fadeOut(10, function () {
                // Fade in only the selected section after the fade out completes
                $(sections[index]).fadeIn(500);
            });
        });
    });
});

/* Logo */
const logo = document.getElementById("logo");
logo.src = "assets/Logo.png";
logo.style.maxWidth = "100%";
logo.style.height = "150px";

/* Light/Dark Mode */
const themeToggle = document.getElementById("themeToggle");
const bgImage = document.querySelector('body');

// Check if Dark Mode is enable
if(localStorage.getItem("darkMode") === "enable") {
    document.body.classList.add("dark-theme");
    themeToggle.src = "assets/Dark Mode.png";

    // Background Image
    bgImage.style.backgroundImage = "url('https://wallpapercave.com/wp/wp11946471.jpg')"; 
    bgImage.style.backgroundSize = 'cover';
    bgImage.style.backgroundPosition = 'center';
} else {
    themeToggle.src = "assets/Light Mode.png";

    // Background Image
    bgImage.style.backgroundImage = "url('https://wallpapers.com/images/hd/plane-desktop-smcu2q56yh5cny40.jpg')";
    bgImage.style.backgroundSize = 'cover';
    bgImage.style.backgroundPosition = 'center';
}

// Toggle the Image when Click, LocalStorage for when Page is refreshed
themeToggle.addEventListener("click", function() {
    if(themeToggle.getAttribute("src").includes("Light Mode.png")) {  
        themeToggle.src = "assets/Dark Mode.png";
        document.body.classList.add("dark-theme");
        localStorage.setItem("darkMode", "enable");

        // Background Image for Dark Mode
        bgImage.style.backgroundImage = "url('https://wallpapercave.com/wp/wp11946471.jpg')";        
    } else {
        themeToggle.src = "assets/Light Mode.png";
        document.body.classList.remove("dark-theme");
        localStorage.setItem("darkMode", "disable");
        
        // Background Image for Light Mode
        bgImage.style.backgroundImage = "url('https://wallpapers.com/images/hd/plane-desktop-smcu2q56yh5cny40.jpg')";
    }
});

/* User Info */
// Retrieve users from localStorage
let loginUser = JSON.parse(localStorage.getItem("loginUser"));

// Create element & text
let user_info = document.getElementById("user_info");
let newSpan = document.createElement("span");
let txtSpan = document.createTextNode(`Welcome, ${loginUser.user}!`);
let newLogout = document.createElement("a")
let txtLogout = document.createTextNode("Logout");
newLogout.classList.add("logout");

// Append element & text
user_info.appendChild(newSpan);
user_info.appendChild(newLogout);
newSpan.appendChild(txtSpan);
newLogout.appendChild(txtLogout);

// Logout
document.querySelector(".logout").addEventListener("click", function() {
    // Confirm User when logging out
    let logOut = confirm("Do you want to logout?")
    if(logOut) {
        alert(`${loginUser.user} is logging out!`);     
    } else {
        return;
    }
    
    // Remove login User from localStorage
    localStorage.removeItem("loginUser");
   
    // Move to User Interface
    $("body").fadeOut(500, function () {
        window.location.href = "index.html";
    });
    
});