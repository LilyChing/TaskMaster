// Variable to count number of attempts.
var attempt = 3; 
var checkUName = "";
var checkPW = "";
const loginform = document.querySelector(".login");
const loginPlace = document.querySelector(".loginplace");
const namePlace = document.querySelector(".nameplace");
const teamPlace = document.querySelector(".teamplace");
const userPlace = document.querySelector(".userplace");
if (!sessionStorage.getItem("username")){
// Below function Executes on submit of login form.
loginform.addEventListener("submit", (event) => {
    event.preventDefault(); // //stop form from submitting
    checkUName = document.getElementById("checkuname").value;
    checkPW = document.getElementById("checkpw").value;
    if (checkPW == "taskmaster") {
        // If user type in their name, use sessionStorage to store username, otherwise, store "Guest"
        if (!checkUName){
            sessionStorage.setItem("username", 'Guest');
        }else{
            sessionStorage.setItem("username", checkUName);
        }
        console.log(sessionStorage.getItem("username"));
        alert("Login successfully");
        logined();
    } else {
        attempt--; // Decrementing by one.
        document.getElementById("warning").innerHTML = "Wrong Username or Password. You have left "+ attempt + " attempt.";
        // Disabling fields after 3 attempts.
        if (attempt == 0) {
            document.getElementById("checkuname").disabled = true;
            document.getElementById("checkpw").disabled = true;
            document.getElementById("loginbutton").disabled = true;
            document.getElementById("warning").innerHTML = "Your account is blocked now. Please refresh the website."
        }
    }
});
}else{
    logined();
}

function logined(){
    loginPlace.style.display = "none";
    $('#loginModal').modal('hide');
    teamPlace.style.display = "block";
    userPlace.style.display = "block";
    const teamName = document.querySelector(".teamname");
    teamName.innerHTML = `${sessionStorage.getItem("username")}'s Team`
    const logoutbtn = document.querySelector(".logout");
    logoutbtn.setAttribute("type","button");
    logoutbtn.onclick = function() {
        alert("Logout successfully");
        sessionStorage.clear();
        location.reload();
    };
}

function genElement(text, messageType, tag="div", location) {
	// generates HTML elements which displays text
	let newElement = document.createElement(tag);
	newElement.innerHTML = text;
	newElement.setAttribute("class",messageType); // add class for styling
	location.appendChild(newElement);
}