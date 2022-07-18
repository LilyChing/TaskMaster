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

// main class for task management
class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentId = 0;
        this.projects = [];
        this.team = [];
    }

    addTask(project, summary, description, dueDate, assignee, status) {
        const newTask = {};
        newTask.id = this.currentId;
        newTask.project = project;
        newTask.summary = summary;
        newTask.description = description;
        newTask.dueDate = dueDate;
        newTask.assignee = assignee;
        newTask.status = status;
        this.tasks.push(newTask);
        this.currentId++;
        this.render(newTask);
    }

    render(task) {
        const newElement = document.createElement("div");
        newElement.classList.add("card", `${task.status}`);
        newElement.setAttribute("id", `task${task.id}`);
        newElement.innerHTML = `<div class="card-body"><div class="row h6 justify-content-between mb-2"><div class="task-title col-11 row flex-wrap">${task.summary}</div><span class="col-1 text-right"><i class="fa-solid fa-xmark"></i></span></div><span class="project-name bg-primary p-1">${task.project}</span><div class="row justify-content-between mt-2"><span class="assignee"><i class="fa-solid fa-circle-user"></i> ${task.assignee}</span><span class="due-date">due: ${task.dueDate}</span></div></div>`
        document.querySelector(`.${task.status}Col`).appendChild(newElement);
    }
    addMem(newmem){
        const colorList = ["red","gray","blue","green","pink","Orange","Aqua","Purple"];
        const ranColor = Math.floor(Math.random()*colorList.length);
        const newMemGroup = {};
        newMemGroup.color = colorList[ranColor];
        newMemGroup.member = newmem;
        this.team.push(newMemGroup);
        this.renderMem(newMemGroup);
    }
    renderMem(mem){
            const newElement = document.createElement("div");
            newElement.setAttribute("class","row mb-2 memList");
            newElement.innerHTML = `<div class="rounded-circle mr-2" style="height: 40px;width: 40px;background-color:${mem.color};"></div>
            <div id="memListTop">${mem.member}</div>
            <div class="col-sm-2 text-center">Editor</div>`;
            memPlace.appendChild(newElement);
    }
}


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