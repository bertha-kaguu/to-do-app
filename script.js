console.log("Tier-2 To-Do Loaded");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filters button");
const themeToggle = document.getElementById("themeToggle");

document.addEventListener("DOMContentLoaded", () => {
loadTasks();
loadTheme();
});

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keypress", function(e) {
if (e.key === "Enter") addTask();
});

// Theme toggle
themeToggle.addEventListener("click", () => {
document.body.classList.toggle("dark");
localStorage.setItem("theme", document.body.classList.contains("dark"));
updateThemeButtonText();
});

function loadTheme() {
const dark = localStorage.getItem("theme") === "true";
if (dark) document.body.classList.add("dark");
}

function updateThemeButtonText() {
    if (document.body.classList.contains("dark")) {
      themeToggle.textContent = "Light Mode";
    } else {
      themeToggle.textContent = "Dark Mode";
    }
  }

// Filters
filterButtons.forEach(btn => {
btn.addEventListener("click", () => {
const filter = btn.dataset.filter;
filterTasks(filter);
});
});

function filterTasks(filter) {
document.querySelectorAll("#taskList li").forEach(li => {
const completed = li.classList.contains("completed");

    if (filter === "all") li.style.display = "flex";
    if (filter === "active") li.style.display = completed ? "none" : "flex";
    if (filter === "completed") li.style.display = completed ? "flex" : "none";
});

}

// Add task
function addTask() {
const text = taskInput.value.trim();
if (text === "") return;

createTaskElement(text, false);
updateLocalStorage();

taskInput.value = "";

}

// Create task element
function createTaskElement(text, completed) {
const li = document.createElement("li");
if (completed) li.classList.add("completed");

const span = document.createElement("span");
span.textContent = text;

const buttons = document.createElement("div");
buttons.classList.add("task-buttons");

// Complete
const completeBtn = document.createElement("button");
completeBtn.textContent = "✓";
completeBtn.classList.add("complete-btn");
completeBtn.onclick = () => {
    li.classList.toggle("completed");
    updateLocalStorage();
};

// Edit
const editBtn = document.createElement("button");
editBtn.textContent = "Edit";
editBtn.classList.add("edit-btn");
editBtn.onclick = () => {
    const newText = prompt("Edit task:", span.textContent);
    if (newText) {
        span.textContent = newText;
        updateLocalStorage();
    }
};

// Delete
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "X";
deleteBtn.classList.add("delete-btn");
deleteBtn.onclick = () => {
    li.remove();
    updateLocalStorage();
};

buttons.appendChild(completeBtn);
buttons.appendChild(editBtn);
buttons.appendChild(deleteBtn);

li.appendChild(span);
li.appendChild(buttons);
taskList.appendChild(li);

}

// Local storage
function updateLocalStorage() {
const tasks = [];
document.querySelectorAll("#taskList li").forEach(li => {
tasks.push({
text: li.querySelector("span").textContent,
completed: li.classList.contains("completed")
});
});
localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
tasks.forEach(task => createTaskElement(task.text, task.completed));
}
updateThemeButtonText();