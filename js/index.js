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
    teamName.innerHTML = `${sessionStorage.getItem("username")}'s Team`;
    document.getElementById("memListTop").innerHTML = `${sessionStorage.getItem("username")}`;
    const logoutbtn = document.querySelector(".logout");
    logoutbtn.setAttribute("type","button");
    logoutbtn.onclick = function() {
        alert("Logout successfully");
        sessionStorage.removeItem("username");;
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

/* javascript for managing tasks */

// input elements of "create task" modal
const createBtn = document.getElementById("createBtn");
const projectInput = document.getElementById("select-project");
const summaryInput = document.getElementById("summary");
const descriptionInput = document.getElementById("description");
const dueDateInput = document.getElementById("due");
const assigneeInput = document.getElementById("select-assignee");
const statusInput = document.getElementById("status");
const memInput = document.getElementById("newMem");
const memBtn = document.getElementById("addMem");
const memPlace = document.getElementById("memplace");

// create a task manager instance 
const manager = new TaskManager();


// set click listener for create task button
createBtn.addEventListener("click", event => {
    // validate inputs omitted
    manager.addTask(projectInput.value, summaryInput.value, descriptionInput.value, dueDateInput.value, assigneeInput.value, statusInput.value);
    statusInput.value = "backlog";
    for (const input of [projectInput, summaryInput, descriptionInput, dueDateInput, assigneeInput]) {
        input.value = "";
    }
    console.log(manager.tasks);
});


//set click listener for add member button
memBtn.addEventListener("click", function() {
    alert("Add member successfully");
    manager.addMem(memInput.value);
    memInput.value ="";
    console.log(manager.team);
});


// drag and drop
// set drag and drop handlers for the four task blocks
for (const col of ["backlogCol", "to-doCol", "doingCol", "doneCol"]) {
    const block = document.getElementById(col);

    block.addEventListener("dragover", event => {
        event.preventDefault();  // to allow drop
    });

    block.addEventListener("drop", event => {
        event.preventDefault(); // to allow drop
        
        // if a task is dropped in the task block, the task will be added to the end
        const draggedId = event.dataTransfer.getData("text/id");
        const dragged = document.getElementById(draggedId);
        event.currentTarget.appendChild(dragged);
        
        // change the status class of the dropped task, for styling
        const status = col.replace("Col", "");
        dragged.setAttribute("Class", `card ${status}`);
        
        // update the status of the dropped task object in TaskManager
        const taskId = draggedId.replace("task", "");
        manager.getTaskById(parseInt(taskId)).status = status;
    });
}