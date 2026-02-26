console.log("To-Do Loaded");

const taskInput = document.getElementById("taskInput");
const dueDateInput = document.getElementById("dueDate");
const prioritySelect = document.getElementById("prioritySelect");
const categorySelect = document.getElementById("categorySelect");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const filterButtons = document.querySelectorAll(".filters button");
const themeToggle = document.getElementById("themeToggle");
const taskCounter = document.getElementById("taskCounter");
const searchBar = document.getElementById("searchBar");

document.addEventListener("DOMContentLoaded", () => {
loadTasks();
loadTheme();
updateThemeButtonText();

searchBar.addEventListener("keyup", function(e) {
    const searchTerm = e.target.value.toLowerCase();
    filterTasksBySearch(searchTerm);
  });
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
const date = dueDateInput.value;
const category = categorySelect.value;
const priority = prioritySelect.value;

if (!text) return;

createTaskElement({ text, date, category, priority, completed: false });
updateLocalStorage();

taskInput.value = "";
dueDateInput.value = "";
updateCounter();

}

function getLocalDateString(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
// Create task element
function createTaskElement(task) {

    const li = document.createElement("li");
  
    // Store real data on the element
    li.dataset.text = task.text || "";
    li.dataset.date = task.date || "";
    li.dataset.category = task.category || "General";
    li.dataset.priority = task.priority || "";
    li.dataset.completed = task.completed ? "true" : "false";
  
    if (task.completed) li.classList.add("completed");
    if (task.priority) li.classList.add(`priority-${task.priority}`);
  
    // Date styling
    const today = getLocalDateString();
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = getLocalDateString(tomorrowDate);
  
    if (task.date && !task.completed) {
        if (task.date < today) li.classList.add("overdue");
        else if (task.date === today) li.classList.add("due-today");
        else if (task.date === tomorrow) li.classList.add("due-tomorrow");
    }
  
    // Category
    const categorySpan = document.createElement("span");
    categorySpan.textContent = `[${task.category}] `;
    categorySpan.classList.add("task-category", task.category);
  
    // Text
    const textSpan = document.createElement("span");
    let displayText = task.text;
  
    if (task.date) displayText += ` (Due: ${task.date})`;
    if (li.classList.contains("overdue")) displayText = "⚠️ " + displayText;
  
    textSpan.textContent = displayText;
  
    // Buttons container
    const buttons = document.createElement("div");
    buttons.classList.add("task-buttons");
  
    // Complete
    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✓";
    completeBtn.classList.add("complete-btn");
    completeBtn.onclick = () => {
        li.classList.toggle("completed");
        li.dataset.completed = li.classList.contains("completed") ? "true" : "false";
        li.classList.remove("overdue");
        updateCounter();
        updateLocalStorage();
    };
  
    // Edit
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.onclick = () => {
        const newText = prompt("Edit task:", li.dataset.text);
        if (newText) {
            li.dataset.text = newText;
            li.remove();
            createTaskElement({
                text: newText,
                date: li.dataset.date,
                category: li.dataset.category,
                priority: li.dataset.priority,
                completed: li.dataset.completed === "true"
            });
            updateLocalStorage();
            updateCounter();
        }
    };
  
    // Delete
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.onclick = () => {  
        updateCounter();
        li.remove();
        updateLocalStorage();
    };
  
    buttons.append(completeBtn, editBtn, deleteBtn);
    li.append(categorySpan, textSpan, buttons);
    taskList.appendChild(li);
  }

// Local storage
function updateLocalStorage() {

    const tasks = [];
  
    document.querySelectorAll("#taskList li").forEach(li => {
        tasks.push({
            text: li.dataset.text,
            date: li.dataset.date,
            category: li.dataset.category,
            priority: li.dataset.priority,
            completed: li.dataset.completed === "true"
        });
    });
  
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

function loadTasks() {
  const data = localStorage.getItem("tasks");
  if (!data) return;
  
  try {
      const tasks = JSON.parse(data);
      taskList.innerHTML = "";
      tasks.forEach(task => createTaskElement(task));
      updateCounter();
  } catch (e) {
      console.error("Storage error:", e);
      localStorage.removeItem("tasks");
  }
  }
// Task counter
function updateCounter() {
  const tasksLeft = document.querySelectorAll("#taskList li:not(.completed)").length;
  taskCounter.textContent = `${tasksLeft} task${tasksLeft !== 1 ? "s" : ""} left`;
}
function filterTasksBySearch(searchTerm) {
  const tasks = document.querySelectorAll("#taskList li");

  tasks.forEach(task => {
      const taskText = task.textContent.toLowerCase(); 
      if (taskText.includes(searchTerm)) {
          task.style.display = "flex";
      } else {
          task.style.display = "none";
      }
  });
}
