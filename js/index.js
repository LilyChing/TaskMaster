// Variable of login model 
var attempt = 3; //count number of attempts.
var checkUName = "";
var checkPW = "";
const loginform = document.querySelector(".login");
const loginPlace = document.querySelector(".loginplace");
const namePlace = document.querySelector(".nameplace");
const teamPlace = document.querySelector(".teamplace");
const userPlace = document.querySelector(".userplace");

// input elements of "create task" and "add memeber" modal
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
const editAssigneeP = document.getElementById("edit-assignee");
const defaultAP = document.getElementById("defaultA");
const teamAP = document.getElementById("teamA");

// variable: overdue color
const overdueColor = "#FF8F8F";

// create a task manager instance 
const manager = new TaskManager();

// Load the tasks from localStorage
manager.load();

//render ALL task get from localStorage
for (let i = 0; i < manager.tasks.length; i++) {
    manager.render(manager.tasks[i]); //this one only render new task
}

//render ALL projects retrieved from localStorage
for (let p = 0; p < manager.projects.length; p++) {
    manager.renderProject(manager.projects[p]);
}

function start() {
    //render only the first team member into "Assign to" option when it's not log in
    manager.renderAssignee(1);
    loginPlace.style.display = "block";
    teamPlace.setAttribute("style", "display:none !important");
    userPlace.style.display = "none";
}
start();

// Start of login function: check if user is logined
if (manager.isLogin == false) {
    // Below function Executes on submit of login form.
    loginform.addEventListener("submit", (event) => {
        event.preventDefault(); // //stop form from submitting
        checkUName = document.getElementById("checkuname");
        checkPW = document.getElementById("checkpw").value;
        //Validation: if username is longer than 18 letters, return
        if (checkUName.value.length > 18) {
            alert(`Your username couldn't longer than 18 letters.`);
            checkUName.value = "";
            checkUName.style.backgroundColor = "LightPink";
            checkUName.addEventListener("click", function () {
                checkUName.style.backgroundColor = "white";
            });
            return;
        }
        if (checkPW == "taskmaster") {
            // If user type in their name, use sessionStorage to store username, otherwise, store "Guest"
            if (!checkUName.value) {
                manager.team[0].member = "Guest";
                manager.save();
            } else {
                manager.team[0].member = checkUName.value;
                manager.save();
            }
            alert("Login successfully");
            logined();
        } else {
            attempt--; // Decrementing by one.
            document.getElementById("warning").innerHTML = "Wrong Username or Password. You have left " + attempt + " attempt.";
            // Disabling fields after 3 attempts.
            if (attempt == 0) {
                document.getElementById("checkuname").disabled = true;
                document.getElementById("checkpw").disabled = true;
                document.getElementById("loginbutton").disabled = true;
                document.getElementById("warning").innerHTML = "Your account is blocked now. Please refresh the website."
            }
        }
    });
} else {
    logined();
}

// after you login successfully, run this
function logined() {
    //update login status to true
    manager.isLogin = "true";
    manager.save();
    //render team member into "Assign to" option using team localStorage
    manager.renderAssignee();
    //render team members from localStorage, i start from 1 because we already set the firt one:myself
    for (let i = 1; i < manager.team.length; i++) {
        manager.renderMem(manager.team[i]);
    }
    $('#loginModal').modal('hide');
    loginPlace.style.display = "none";
    teamPlace.removeAttribute("style", "display:none !important");
    userPlace.style.display = "block";
    const teamName = document.querySelector(".teamname");
    teamName.innerHTML = `${manager.team[0].member}'s Team`;
    document.getElementById("memListTop").innerHTML = `${manager.team[0].member}`;
    const logoutbtn = document.querySelector(".logout");
    logoutbtn.setAttribute("type", "button");
    //this btn control what happen when loged out
    logoutbtn.onclick = function () {
        alert("Logout successfully");
        manager.team[0].member = "You";
        //When it loged out, remove all member except myself in add member modal
        for(let i = 1; i < manager.team.length; i++){
            memPlace.removeChild(memPlace.lastChild);
        }
        manager.isLogin = "false";
        manager.save();
        start();
    };
}


/* javascript for managing tasks */

// set click listener for create task button
createBtn.addEventListener("click", event => {
    //Validation
    //if there is no input, change bg color to pink and return to white after click
    const inputList = [projectInput, summaryInput, dueDateInput, assigneeInput];
    for (let i = 0; i < inputList.length; i++) {
        if (!inputList[i].value) {
            inputList[i].style.backgroundColor = "LightPink";
            inputList[i].addEventListener("click", function () {
                inputList[i].style.backgroundColor = "white";
            });
        }
    }
    //After the for loop is finished,if no input/summary>50 letters, alert and return
    if (!projectInput.value || !summaryInput.value || !dueDateInput.value || !assigneeInput.value) {
        alert(`You have missing input.`);
        return;
    }
    if (summaryInput.value.length > 50) {
        alert(`Please type in your summary not longer than 50 letters.`);
        summaryInput.value = "";
        summaryInput.style.backgroundColor = "LightPink";
        summaryInput.addEventListener("click", function () {
            summaryInput.style.backgroundColor = "white";
        });
        return;
    }
    //hide modal
    $("#createTask").modal('hide');
    //check if assignee == team member[0], which is myself
    console.log(assigneeInput.value);
    console.log(manager.team[0].member);
    if (assigneeInput.value == manager.team[0].member) {
        manager.addTask(projectInput.value, summaryInput.value, descriptionInput.value, dueDateInput.value, "You", statusInput.value);
    } else {
        // validate inputs omitted
        manager.addTask(projectInput.value, summaryInput.value, descriptionInput.value, dueDateInput.value, assigneeInput.value, statusInput.value);
    }
    manager.save();
    statusInput.value = "backlog";
    for (const input of [projectInput, summaryInput, descriptionInput, dueDateInput, assigneeInput]) {
        input.value = "";
    }
    console.log(manager.tasks);
});


// set click listener for edit task button
const editBtn = document.getElementById("editBtn");
editBtn.addEventListener("click", event => {
    // validation omitted
    const edited = manager.getTaskById(parseInt(document.getElementById("editId").value));
    const originalStatus = edited.status;
    // edit element in manager array
    edited.project = document.getElementById("edit-project").value;
    edited.summary = document.getElementById("edit-summary").value;
    edited.description = document.getElementById("edit-description").value;
    edited.dueDate = document.getElementById("edit-due").value;
    edited.assignee = document.getElementById("edit-assignee").value;
    edited.status = document.getElementById("edit-status").value;
    
    // re-render and re-position
    const editedElement = document.getElementById(`task${document.getElementById("editId").value}`);
    editedElement.setAttribute("class", `card ${edited.status}`);
    
    // reformat due date from "yyyy-mm-dd" to "dd/mm/yyyy"
    let date = edited.dueDate.split("-");
    [date[0], date[2]] = [date[2], date[0]];
    // intermeditae step: determine whether the task is overdue  //added
    let overdue = false;
    let today = new Date();
    today = today.toLocaleDateString('en-GB').split("/");
    if (parseInt(date[2]) < parseInt(today[2])) {overdue = true;}
    else if (parseInt(date[2]) === parseInt(today[2]) && parseInt(date[1]) < parseInt(today[1])) {overdue = true;}
    else if (parseInt(date[2]) === parseInt(today[2]) && parseInt(date[1]) === parseInt(today[1]) && parseInt(date[0]) < parseInt(today[0])) {overdue = true;}
    // finish reformat
    date = date.join("/");
    
    //get member bg color from this.team
    const memIndex = manager.team.findIndex(object => {
        return object.member === edited.assignee;
    });
    editedElement.innerHTML = `<div class="card-body"><div class="row h6 justify-content-between mb-2"><div class="task-title col-11 row flex-wrap">${edited.summary}</div><span class="col-1 text-center deleteBtn"><i class="fa-solid fa-xmark"></i></span></div><span class="project-name p-1">${edited.project}</span><div class="row justify-content-between mt-2"><span class="assignee"><i class="fa-solid fa-circle-user" style="color:${manager.team[memIndex].color};"></i> ${edited.assignee}</span><span class="due-date"><i class="fa-solid fa-clock"></i> ${date}</span></div></div>`;
    if (edited.status !== originalStatus) {
        document.getElementById(`${edited.status}Col`).appendChild(editedElement);
    }
    
    // determine show/hide when edit under project filter
    if (document.getElementById("currentProjText").innerHTML !== "All Tasks" && document.getElementById("currentProjText").innerHTML !== edited.status) {
        editedElement.style.display = "none";
    }

    // style the due date for overdue tasks
    if (overdue && edited.status !== "done") {
        document.querySelector(`#${editedElement.id} .due-date`).style.color = overdueColor;
    }
    else {document.querySelector(`#${editedElement.id} .due-date`).style.color = "";}
    
    // add delete handler to re-rendered delete button
    const deleteCatcher = document.querySelector(`#${editedElement.id} .card-body`);
    deleteCatcher.addEventListener("click", event => {
        if (event.target === document.querySelector(`#${editedElement.id} .deleteBtn`) || event.target === document.querySelector(`#${editedElement.id} i`)) {
            if (confirm("Are you sure to delete this task?")) {
                // delete task from manager.tasks
                const task = manager.getTaskById(parseInt(editedElement.id.replace("task", "")));
                const taskIndex = manager.tasks.indexOf(task);
                manager.tasks.splice(taskIndex, 1);
                // delete task element from DOM
                document.getElementById(editedElement.id).remove();
            }
            event.stopPropagation();  // the delete click won't bubble up to the task card to trigger edit modal
            manager.save(); // save change to local storage
        }
    });
    
    // save change to local storage
    manager.save();
});


/* add project */
// set click listener for add project button
const projBtn = document.getElementById("addProjBtn");
projBtn.addEventListener("click", event => {
    const newProj = document.getElementById("addProjectInput").value;
    const warning = document.getElementById("addProjWarning");
    // validate new project name, not accept empty or used name
    if (newProj === "") {
        warning.innerHTML = "<i class='fa-solid fa-circle-exclamation'></i> Project name can't be empty";
    }
    else if (manager.projects.includes(newProj)) {
        warning.innerHTML = "<i class='fa-solid fa-circle-exclamation'></i> This name has been used";
    }
    // when validation passed
    else {
        // update manager.projects
        manager.projects.push(newProj);
        // save to local storage
        manager.save();
        // make new elements, add to project dropdown and two modal lists
        const newProjInList = document.createElement("a");
        newProjInList.innerHTML = newProj;
        newProjInList.classList.add("dropdown-item");
        newProjInList.setAttribute("href", "#");
        newProjInList.setAttribute("name", newProj);
        document.getElementById("project-list").appendChild(newProjInList);
        const newProjInCreate = document.createElement("option");
        newProjInCreate.innerHTML = newProj;
        newProjInCreate.setAttribute("value", newProj);
        document.getElementById("select-project").appendChild(newProjInCreate);
        const newProjInEdit = document.createElement("option");
        newProjInEdit.innerHTML = newProj;
        newProjInEdit.setAttribute("value", newProj);
        document.getElementById("edit-project").appendChild(newProjInEdit);
        $('#addProject').modal('hide');
        document.getElementById("addProjectInput").value = "";

        // add click listener to project dropdown items for filtering
        newProjInList.addEventListener("click", event => {
            // get all task elements in DOM
            const allTasks = document.querySelectorAll('[id^="task"]');
            // for each element, check the project name, if not match then display none
            for (const taskElement of allTasks) {
                if (document.querySelector(`#${taskElement.id} .project-name`).innerHTML !== newProj) {
                    taskElement.style.display = "none";
                }
                else {taskElement.style.display = "";}
            }
            document.getElementById("currentProjText").innerHTML = newProj;
        });
        alert("Project successfully added!");
    }
});

// set click handler to reset project filter
document.getElementById("allProjects").addEventListener("click", event => {
    // get all task elements in DOM
    const allTasks = document.querySelectorAll('[id^="task"]');
    // for each element, check the project name, if not match then display none
    for (const taskElement of allTasks) {
        taskElement.style.display = "";
    }
    document.getElementById("currentProjText").innerHTML = "All Tasks";
});


// set input handler to reset add project warning sentece
const newProjInput = document.getElementById("addProjectInput");
newProjInput.addEventListener("input", event => document.getElementById("addProjWarning").innerHTML = "");


// set click handlers to reset project name input when modal is closed
document.getElementById("cancelAddProj").addEventListener("click", event => {
    document.getElementById("addProjectInput").value = "";
    document.getElementById("addProjWarning").innerHTML = "";
});

document.querySelector("#addProject .close").addEventListener("click", event => {
    document.getElementById("addProjectInput").value = "";
    document.getElementById("addProjWarning").innerHTML = "";
});
/* end of add project */


/* Remove project */
// set click listener to "remove project" modal opener, render the remove list ad hoc
const removeProjOpener = document.querySelector('[data-target = "#removeProject"]');
const removeProjList = document.getElementById("removeProjList");
removeProjOpener.addEventListener("click", event => {
    for (let p = 0; p < manager.projects.length; p++) {
        const proj = document.createElement("option");
        proj.setAttribute("value", manager.projects[p]);
        proj.innerHTML = manager.projects[p];
        removeProjList.appendChild(proj);
    }
});


// set click listener for remove project button
const removeProjBtn = document.getElementById("removeProjBtn");
removeProjBtn.addEventListener("click", event => {
    if (!confirm("All tasks under this project will be deleted, are you sure?")) { return; }
    //remove from manager
    const removed = removeProjList.value;
    const removeIndex = manager.projects.indexOf(removed);
    manager.projects.splice(removeIndex, 1);
    manager.save();
    //remove from remove list, project list, create modal and edit modal
    document.querySelector(`#removeProjList option[value="${removed}"]`).remove();
    document.querySelector(`#select-project option[value="${removed}"]`).remove();
    document.querySelector(`#edit-project option[value="${removed}"]`).remove();
    document.querySelector(`#project-list a[name="${removed}"]`).remove();
    // show success message
    document.getElementById("removeProjSuccess").innerHTML = "Project removed successfully";
    // delete corresponding task elements in the DOM, first get all elements using task id
    const allTasks = document.querySelectorAll('[id^="task"]');
    // for each element, check the project name, if match then delete
    for (const taskElement of allTasks) {
        if (document.querySelector(`#${taskElement.id} .project-name`).innerHTML === removed) {
            taskElement.remove();  // delete DOM element
            const task = manager.getTaskById(parseInt(taskElement.id.replace("task", "")));
            const taskIndex = manager.tasks.indexOf(task);
            manager.tasks.splice(taskIndex, 1);  // delete from manager array
        }
    }
    // save to local storage
    manager.save();
});


// set focus listener on remove list to reset remove success message
removeProjList.addEventListener("focus", event => document.getElementById("removeProjSuccess").innerHTML = "");

// set click listeners to erase project list and remove success message when remove modal is closed
document.getElementById("finishRemove").addEventListener("click", event => {
    removeProjList.innerHTML = "";
    document.getElementById("removeProjSuccess").innerHTML = "";
});
document.querySelector("#removeProject .close").addEventListener("click", event => {
    removeProjList.innerHTML = "";
    document.getElementById("removeProjSuccess").innerHTML = "";
});
/* end of remove project */


//set click listener for add member button
memBtn.addEventListener("click", function () {
    if (!memInput.value) {
        alert(`Please input new member's name.`);
        memInput.style.backgroundColor = "LightPink";
        memInput.addEventListener("click", function () {
            memInput.style.backgroundColor = "white";
        });
        return;
    }
    alert("Add member successfully");
    manager.addMem(memInput.value);
    manager.save();
    manager.renderAssignee();
    memInput.value = "";
    console.log(manager.team);
});


// set drag and drop handlers for the four task columns
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

        // check whether task is overdue and apply style
        let overdue = false;
        let date = document.querySelector(`#${draggedId} .due-date`).innerHTML.replace('<i class="fa-solid fa-clock"></i> ', "").split("/");
        let today = new Date();
        today = today.toLocaleDateString('en-GB').split("/");
        if (parseInt(date[2]) < parseInt(today[2])) {overdue = true;}
        else if (parseInt(date[2]) === parseInt(today[2]) && parseInt(date[1]) < parseInt(today[1])) {overdue = true;}
        else if (parseInt(date[2]) === parseInt(today[2]) && parseInt(date[1]) === parseInt(today[1]) && parseInt(date[0]) < parseInt(today[0])) {overdue = true;}
        if (overdue && status !== "done") {
            document.querySelector(`#${draggedId} .due-date`).style.color = overdueColor;
        }
        else {document.querySelector(`#${draggedId} .due-date`).style.color = "";}

        // update the status of the dropped task object in TaskManager
        const taskId = draggedId.replace("task", "");
        manager.getTaskById(parseInt(taskId)).status = status;
        manager.save();
    });
}


/* mobile tab interface */
// a list of the four tab buttons
const tabList = [document.getElementById("backlogTab"), document.getElementById("to-doTab"), document.getElementById("doingTab"), document.getElementById("doneTab")];
// class strings for showing/hiding task columns
const showClasses = "col-md-3 flex-column d-flex align-items-center px-md-3";
const hideClasses = "col-md-3 flex-column d-none d-md-flex align-items-center px-md-3";
// inititalie one tab to be active
document.getElementById("backlogTab").style.padding = "5px 0";
document.getElementById("backlogTab").style.backgroundColor = "#A8A6FF";
document.getElementById("backlogTabContent").setAttribute("class", showClasses);
// add click handler to switch tabs
for (const tab of tabList) {
    tab.addEventListener("click", event => {
        // set colours, size and classes for current tab
        tab.style.backgroundColor = "#A8A6FF";
        tab.style.padding = "5px 0";
        document.getElementById(`${tab.id}Content`).setAttribute("class", showClasses);
        // set colours, size and classes for the three inactive tabs
        for (const otherTab of tabList.filter(t => t !== tab)) {
            otherTab.style.backgroundColor = "#7F6C9D";
            otherTab.style.padding = "";
            document.getElementById(`${otherTab.id}Content`).setAttribute("class", hideClasses);
        }
    });
}
/* end of mobile tab interface */

//testing
var words = new Array();
words[0] = "[Cease to struggle and you cease to live. --Thomas Carlyle]";
words[1] = "[Behind every successful man there is a lot unsuccessful years. --Bob Brown]";
words[2] = "[Genius is one percent inspiration, ninety-nine percent perspiration. --Thomas A. Edison]";
words[3] = "[You must be the change you wish to see in the world. --Mohandas Gandhi]";
words[4] = "[We shall show mercy, but we shall not ask for it. --Winston Churchill]";
words[5] = "[Life is like riding a bicycle. To keep your balance, you must keep moving. --Albert Einstein]";
words[6] = "[You???ll never find a rainbow if you???re looking down. --Charlie Chaplin]";
words[7] = "[You???ve got to find what you love. --Steve Jobs]";
words[8] = "[The only true wisdom is in knowing you know nothing. --Socrates]";
words[9] = "[Be kind, for everyone you meet is fighting a hard battle. --Plato]";

function changeWord() {
    var num = Math.floor(Math.random() * 10);
    document.getElementById("word").innerHTML = words[num];;
}