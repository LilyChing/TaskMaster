
// main class for task management
class TaskManager {
    constructor() {
        this.tasks = [];
        this.currentId = 0;
        this.projects = [];
        this.team = [{member:"You",color:"#33b5e5"}];
        this.isLogin = false;
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

    // a method to retrieve a task object, given the id
    getTaskById(id) {
        for (const task of this.tasks) {
            if (task.id === id) {
                return task;
            }
        }
        return null;
    }

    // display a task object on html
    render(task) {
        const newElement = document.createElement("div");
        newElement.classList.add("card", `${task.status}`);
        newElement.setAttribute("id", `task${task.id}`);
        newElement.setAttribute("draggable", "true");
        newElement.setAttribute("data-toggle", "modal");
        newElement.setAttribute("data-target", "#editTask");
        //check if member is "You", which is myself
        //get member bg color from this.team
        const memIndex = this.team.findIndex(object => {
            return object.member === task.assignee;
        });
        if(memIndex < 0){
            newElement.innerHTML = `<div class="card-body"><div class="row h6 justify-content-between mb-2"><div class="task-title col-11 row flex-wrap">${task.summary}</div><span class="col-1 text-right"><i class="fa-solid fa-xmark"></i></span></div><span class="project-name bg-primary p-1">${task.project}</span><div class="row justify-content-between mt-2"><span class="assignee"><i class="fa-solid fa-circle-user" style="color:#33b5e5;"></i> You</span><span class="due-date">due: ${task.dueDate}</span></div></div>`
            document.getElementById(`${task.status}Col`).appendChild(newElement);
        }else{
            console.log(memIndex);
            console.log(task.assignee);
            console.log(typeof(task.assignee));
            console.log(this.team);
            console.log(this.team[memIndex].color);
            newElement.innerHTML = `<div class="card-body"><div class="row h6 justify-content-between mb-2"><div class="task-title col-11 row flex-wrap">${task.summary}</div><span class="col-1 text-right"><i class="fa-solid fa-xmark"></i></span></div><span class="project-name bg-primary p-1">${task.project}</span><div class="row justify-content-between mt-2"><span class="assignee"><i class="fa-solid fa-circle-user" style="color:${this.team[memIndex].color};"></i> ${task.assignee}</span><span class="due-date">due: ${task.dueDate}</span></div></div>`
            document.getElementById(`${task.status}Col`).appendChild(newElement);
        }

        // add click handler to set edit modal values
        newElement.addEventListener("click", event => {
            const task = manager.getTaskById(parseInt(event.currentTarget.id.replace("task", "")));
            document.getElementById("edit-project").value = task.project;
            document.getElementById("edit-summary").value = task.summary;
            document.getElementById("edit-description").value = task.description;
            document.getElementById("edit-due").value = task.dueDate;
            document.getElementById("edit-assignee").value = task.assignee;
            document.getElementById("edit-status").value = task.status;
            document.getElementById("editId").value = task.id;
        });
        
        // add drag handler
        newElement.addEventListener("dragstart", event => {
            event.dataTransfer.setData("text/id", event.currentTarget.id);
        });

        // add drop handlers
        newElement.addEventListener("drop", event => {
            event.preventDefault();  // to allow drop
            
            // if another task is dropped on this task, the dropped task will be inserted above this task
            const draggedId = event.dataTransfer.getData("text/id");
            const dragged = document.getElementById(draggedId);
            const parent = event.currentTarget.parentNode;
            parent.insertBefore(dragged, event.currentTarget);
            
            // change the status class of the dropped task, for styling
            const status = parent.getAttribute("id").replace("Col", "");
            dragged.setAttribute("Class", `card ${status}`);
            
            // update the status of the dropped task object in TaskManager
            const taskId = draggedId.replace("task", "");
            manager.getTaskById(parseInt(taskId)).status = status;

            event.stopPropagation();  // prevent the drop event to bubble up to the parent task block
            // otherwise, the dropped task will be appended to the end, meaning the insertion is overridden 
        });
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
    //render team member into "Add Team member" option using team localStorage
    renderMem(mem){
        const newElement = document.createElement("div");
        newElement.setAttribute("class","row mb-2 memList");
        newElement.innerHTML = `<div class="rounded-circle bg-white mr-2" style="height: 40px;width: 40px;">
        <i class="fa-solid fa-circle-user" style="color:${mem.color};font-size: 40px;"></i>
        </div>
        <div id="memListTop">${mem.member}</div>
        <div class="col-sm-2 text-center">Editor</div>`;
        memPlace.appendChild(newElement);
    }

    //render team member into "Assign to" option using team localStorage
    renderAssignee(index){
        // I set parameter to control the number of team members to render
        //When user is loged out, it will only render the first member in team, which is myself
        if(!index){
            index = this.team.length;
        }
        //clear all child before adding
        assigneeInput.innerHTML = '';
        for(let i=0; i<index;i++){
            const newElement = document.createElement("option");
            newElement.setAttribute("value",`${this.team[i].member}`);
            newElement.innerHTML = this.team[i].member;
            assigneeInput.appendChild(newElement);
        }
    }
    

    save(){
        // Store the task JSON string in localStorage
        localStorage.setItem('tasks', JSON.stringify(this.tasks));

        // Store the team member JSON string in localStorage
        localStorage.setItem('team', JSON.stringify(this.team));

        // Convert the currentId to a string;
        const currentId = String(this.currentId);

        // Store the currentId in localStorage
        localStorage.setItem('currentId', currentId);

        // Store the login status in localStorage
        localStorage.setItem('isLogin', String(this.isLogin));
    }

    load() {
        // Check if any tasks are saved in localStorage
        if (localStorage.getItem('tasks')) {
            // Get the JSON string of tasks in localStorage
            const tasksJson = localStorage.getItem('tasks');

            // Convert it to an array and store it in our TaskManager
            this.tasks = JSON.parse(tasksJson);
        }
        // Check if any team are saved in localStorage
        if (localStorage.getItem('team')) {
            // Get the JSON string of tasks in localStorage
            const teamJson = localStorage.getItem('team');

            // Convert it to an array and store it in our TaskManager
            this.team = JSON.parse(teamJson);
        }
        // Check if the currentId is saved in localStorage
        if (localStorage.getItem('currentId')) {
            // Get the currentId string in localStorage
            const currentId = localStorage.getItem('currentId');

            // Convert the currentId to a number and store it in our TaskManager
            this.currentId = Number(currentId);
        }
        // Check if the login status is saved in localStorage
        if (localStorage.getItem('isLogin')) {
            // Get the login status string in localStorage
            this.isLogin = JSON.parse(localStorage.getItem('isLogin'));
        }
    }
}
