/* javascript for managing tasks */


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
        newElement.innerHTML = `<div class="card-body"><div class="row h6 justify-content-between mb-2"><div class="task-title col-11 row flex-wrap">${task.summary}</div><span class="col-1 text-right"><i class="fa-solid fa-xmark"></i></span></div><span class="project-name bg-primary p-1">${task.project}</span><div class="row justify-content-between mt-2"><span class="assignee"><i class="fa-solid fa-circle-user"></i> ${task.assignee}</span><span class="due-date">due: ${task.dueDate}</span></div></div>`
        document.getElementById(`${task.status}Col`).appendChild(newElement);
        
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

    renderMem(mem){
        const newElement = document.createElement("div");
        newElement.setAttribute("class","row mb-2 memList");
        newElement.innerHTML = `<div class="rounded-circle mr-2" style="height: 40px;width: 40px;background-color:${mem.color};"></div>
        <div id="memListTop">${mem.member}</div>
        <div class="col-sm-2 text-center">Editor</div>`;
        memPlace.appendChild(newElement);
    }
}
