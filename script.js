// Check if script is connected
console.log("To-Do Script Loaded");

const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

console.log(taskInput);
console.log(addTaskBtn);
console.log(taskList);

// Load tasks when page opens
document.addEventListener("DOMContentLoaded", loadTasks);

// Add task when button is clicked
addTaskBtn.addEventListener("click", addTask);

// Add task when Enter key is pressed
taskInput.addEventListener("keypress", function (e) {
if (e.key === "Enter") {
addTask();
}
});

function addTask() {
const taskText = taskInput.value.trim();

if (taskText === "") {
    alert("Please enter a task");
    return;
}

createTaskElement(taskText, false);
saveTask(taskText);

taskInput.value = "";

}

function createTaskElement(text, completed) {
const li = document.createElement("li");

if (completed) {
    li.classList.add("completed");
}

const span = document.createElement("span");
span.textContent = text;

const buttonContainer = document.createElement("div");
buttonContainer.classList.add("task-buttons");

// Complete button
const completeBtn = document.createElement("button");
completeBtn.textContent = "✓";
completeBtn.classList.add("complete-btn");
completeBtn.onclick = function () {
    li.classList.toggle("completed");
    updateLocalStorage();
};

// Delete button
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "X";
deleteBtn.classList.add("delete-btn");
deleteBtn.onclick = function () {
    li.remove();
    updateLocalStorage();
};

buttonContainer.appendChild(completeBtn);
buttonContainer.appendChild(deleteBtn);

li.appendChild(span);
li.appendChild(buttonContainer);

taskList.appendChild(li);

}

// Save task to localStorage
function saveTask(text) {
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
tasks.push({ text: text, completed: false });
localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
tasks.forEach(task => {
createTaskElement(task.text, task.completed);
});
}

// Update localStorage after changes
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
