// Retrieve tasks and nextId from localStorage
let taskList = localStorage.getItem("tasks")
  ? JSON.parse(localStorage.getItem("tasks"))
  : [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

const TODO_LANE = "todo";
const INPROG_LANE = "in-progess";
const DONE_LANE = "done";
const DEFAULT_LANE = TODO_LANE;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  // Generate random number or uuid
  return "task-" + Date.now();
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $("<div>", {
    class: "task-card",
    draggable: true,
    id: "task-" + task.id,
    html: `
    <div class="card-body">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text">${task.description}</p>
        <footer class="blockquote-footer">${task.dueDate}</footer>
    </div>
    `,
  });
  taskCard.draggable({
    //containment: "parent", // Optional: Restrict dragging within the parent container
    revert: "invalid", // Optional: Revert to original position if not dropped on a droppable target
    cursor: "move",
    //helper: "clone"
  });
  return taskCard;
}

function addTaskDom(task) {
  // "#todo-cards"
  const laneElement = $("#" + task.laneState + "-cards");
  let taskCard = createTaskCard(task);
  laneElement.append(taskCard);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // iterate over task list to add each task to the DOM
  taskList.forEach((task) => addTaskDom(task));
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  // Use info fields to create the task object
  // Save the task object to local storage
  // Create the task card
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  // Remove task from DOM
  // Remove task from local storage
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  $(this).append(ui.draggable);
  ui.draggable.css({ top: "0px", left: "0px" });
  //update lane state
  let taskId = ui.draggable[0].getAttribute("id"); // task-1232131
  let targetLane = event.target.getAttribute("id"); // todo
  for (let idx = 0; idx < taskList.length; ++i) {
    let task = taskList[idx];
    if (task.id === taskId) {
      task.laneState = targetLane;
      break;
    }
  }
}

function saveTask(task) {
  taskList.push(task);
  localStorage.setItem("tasks", JSON.stringify(taskList));
}

// Setup drop areas
function setupDropZones() {
  $(".lane").droppable({
    accept: ".task-card", // Only accept elements matching this selector
    drop: handleDrop,
  });
}
function createTask() {
  return {
    id: generateTaskId(),
    title: $("#task-title").val().trim(),
    description: $("#task-description").val().trim(),
    dueDate: dayjs($("#due-date").val()).format("YYYY-MM-DD"),
    laneState: DEFAULT_LANE,
  };
}

// delete, date field should be date picker, and near/pastdue/good status(styelling and view)
// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();
  //evenlisteners
  $("#form-add-task-btn").click(function () {
    let task = createTask();
    // validation check
    if (task.title && task.dueDate) {
      addTaskDom(task);
      saveTask(task);
      $("#formModal").modal("hide");
    } else {
      // nothing happens , close popup
      $("#formModal").modal("hide");
    }
  });
  // make lanes droppable
  setupDropZones();
});
