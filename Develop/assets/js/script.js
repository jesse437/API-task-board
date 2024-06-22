$(document).ready(function () {
  // Retrieve tasks and nextId from localStorage
  let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
  let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

  // Todo: create a function to generate a unique task id
  function generateTaskId() {
    // return "task" + Date.now() + "-" + Math.floor(Math.random() + 0 * 1000);
    return nextId++;
  }

  // Todo: create a function to create a task card
  function createTaskCard(task) {
    const taskCard = $("<div>")
      .addClass("card task-card draggable my-3")
      .attr("data-task-id", task.id);
    const cardHeader = $("<div>")
      .addClass("card-header h4")
      .text("Task: " + task.name);
    const cardBody = $("<div>").addClass("card-body");
    const cardDescription = $("<p>")
      .addClass("class-text")
      .text("Description: " + task.description);
    const cardDueDate = $("<p>")
      .addClass("class-text")
      .text("Due Date: " + task.dueDate);
    const cardDeleteBtn = $("<button>")
      .addClass("btn btn-danger delete")
      .text("Delete")
      .attr("data-task-id", task.id);

    cardDeleteBtn.on("click", handleDeleteTask);
    const today = dayjs().startOf("day");
    const dueDate = dayjs(task.dueDate, "YYYY-MM-DD").startOf("day");
    const daysDifference = dueDate.diff(today, "day");

    if (daysDifference < 0) {
      taskCard.addClass("bg-danger");
    } else if (daysDifference === 0) {
      taskCard.addClass("bg-warning");
    } else {
      taskCard.addClass("bg-white");
    }
    cardBody.append(cardDescription, cardDueDate, cardDeleteBtn);
    taskCard.append(cardHeader, cardBody);
    return taskCard;
  }

  // Todo: create a function to render the task list and make cards draggable
  function renderTaskList() {
    const todoList = $("#todo-cards");
    todoList.empty();
    const inProgressList = $("#in-progress-cards");
    inProgressList.empty();
    const doneList = $("#done-cards");
    doneList.empty();
    console.log(taskList);
    taskList.forEach((task) => {
      const taskCard = createTaskCard(task);
      console.log(task);
      if (task.status === "to-do") {
        // add task in todo card area
        todoList.append(taskCard);
      } else if (task.status === "in-progress") {
        // add in  prgress list
        inProgressList.append(taskCard);
      } else if (task.status === "done") {
        doneList.append(taskCard);
        // add in done list
      }
    });

    // draggable functionality
    makeCardsDraggable();
    makeLaneDroppable();
  }

  // Todo: create a function to handle adding a new task

  function handleAddTask(event) {
    event.preventDefault();
    const taskName = $("#taskName").val().trim();
    const taskDescription = $("#taskDescription").val().trim();
    const taskDueDate = $("#taskDueDate").val().trim();

    const newTask = {
      id: generateTaskId(),
      name: taskName,
      description: taskDescription,
      dueDate: taskDueDate,
      status: "to-do",
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));
    renderTaskList();
    $("#taskName").val('');
    $("#taskDescription").val('');
    $("#taskDueDate").val('');
    $("#formModal").modal("hide");
  }

  // Todo: create a function to handle deleting a task
  function handleDeleteTask(event) {
    const taskId = $(this).attr("data-task-id");
    taskList = taskList.filter((task) => task.id !== parseInt(taskId));
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
  }

  // Todo: create a function to handle dropping a task into a new status lane
  function handleDrop(event, ui) {
    const taskId = ui.draggable.attr("data-task-id");
    const newStatus = event.target.id.replace("-cards", "");
    const task = taskList.find((task) => task.id === parseInt(taskId));
    task.status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
  }

  // Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker

  function makeCardsDraggable() {
    $(".task-card").draggable({
      opacity: 0.6,
      zIndex: 100,
      helper: function (e) {
        const original = $(e.target).hasClass("ui-draggable")
          ? $(e.target)
          : $(e.target).closest(".ui-draggable");
        return original.clone().css({
          width: original.outerWidth(),
        });
      },
    });
  }

  function makeLaneDroppable() {
    $(".lane").droppable({
      accept: ".task-card",
      drop: handleDrop,
    });
  }
  renderTaskList();
    $("#taskForm").on("submit", handleAddTask);
    $('.datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
      });
});
