var formEl = document.querySelector('#task-form');
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed")

var taskFormHandler = function(event) {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value; 
    
    //Check if Input values are empty strings
    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false;
    }
    formEl.reset();
    
    var isEdit = formEl.hasAttribute("data-task-id");
    
    // has data attribute, so get task id and call function to complete edit process

    if(isEdit) {
       var taskId = formEl.getAttribute("data-task-id");
       completeEditTask(taskNameInput, taskTypeInput, taskId); 
    } else {
        //Package up data as an object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    //Send it as an argument to createTaskEl
    createTaskEl(taskDataObj);

    };

    
};

var createTaskEl = function (taskDataObj) {
        //Create List Item
        var listItemEl = document.createElement('li'); 
        listItemEl.className = "task-item";

        //Add task id as a custom attribute
        listItemEl.setAttribute("data-task-id", taskIdCounter)
        listItemEl.setAttribute("draggable", "true");
    
        //create div to hold task info and add to list item
        var taskInfoEl = document.createElement("div");
    
        //Give it a class name
        taskInfoEl.className = "task-info";
    
        // add HTML content to div
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "<h3><span class='task-type'>" + taskDataObj.type + "</span";

        
        listItemEl.appendChild(taskInfoEl);

        var taskActionsEl = createTaskActions(taskIdCounter);         
        listItemEl.appendChild(taskActionsEl);
           
        //Add entire list item to list
        tasksToDoEl.appendChild(listItemEl);

        //Increase task counter for next unique id
        taskIdCounter++;
};



var createTaskActions = function(taskId) { 
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    // create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit"
    editButtonEl.className = "btn edit-btn"
    editButtonEl.setAttribute("data-task-id", taskId)

    actionContainerEl.appendChild(editButtonEl);

    // Create delete button

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id" , taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];

    for(var i =0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // Append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

formEl.addEventListener("submit", taskFormHandler);


var taskButtonHandler = function (event) {
    //Get target element from event
    var targetEl = event.target
    // Edit button was clicked
    if(targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    // Delete Button was clicked
    if (targetEl.matches(".delete-btn")) {
        // get the elements Task ID
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    } 
};



var deleteTask = function(taskId) {
   var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
   taskSelected.remove();
};


var editTask = function(taskId) {
    console.log("editing task#" + taskId);
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']")
    
    var taskName = taskSelected.querySelector("h3.task-name").textContent;    

    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask = function(taskName, taskType, taskId) {
    // find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;
    alert("task updated!");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";    

};

var taskStatusChangeHandler = function(event) {
    // console.log(event.target, event.target.getAttribute("data-task-id"));
    // get the task items ID
    var taskId = event.target.getAttribute("data-task-id");

    // get the currently selected options value and convert to lowercase
    var statusValue = event.target.value.toLowerCase();

    // find the parent task item element based on ID
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
}
else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
}
else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
}

};

var dragTaskHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);

    var getId = event.dataTransfer.getData("text/plain");
    console.log("getId:", getId, typeof getId);
};

var dropZoneDragHandler = function (event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault(); 
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;" );       
    }    
};

var dropTaskHandler = function (event) {
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id='" + id + "']")
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;
   
    // Set status of task based on dropZone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");

    if (statusType === "tasks-to-do") {
        statusSelectEl.selectedIndex = 0;        
    }
    else if ( statusType === 'tasks-in-progress') {
        statusSelectEl.selectedIndex = 1;
    } 
    else if ( statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2; 
    }

    dropZoneEl.removeAttribute("style");

    dropZoneEl.appendChild(draggableElement);   

};

var dragLeaveHandler = function(event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
}



pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener('dragleave', dragLeaveHandler);
































