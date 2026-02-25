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
});

searchBar.addEventListener("keyup", function(e) {
  const searchTerm = e.target.value.toLowerCase();
  filterTasksBySearch(searchTerm);
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

// Create task element
function createTaskElement(task) {
  task = {
    text: task.text || "",
    date: task.date || "",
    priority: task.priority || "",
    category: task.category || "General",
    completed: task.completed || false
};
const li = document.createElement("li");
if (task.completed) li.classList.add("completed");

li.classList.add(`priority-${task.priority}`);
const today = new Date().toISOString().split("T")[0];
if (task.date && task.date < today && !task.completed) {
    li.classList.add("overdue");
}

if (task.date) {
    const today = new Date().toISOString().split("T")[0];

    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split("T")[0];

    li.classList.remove("due-today", "due-tomorrow");

    if (task.date === today) {
        li.classList.add("due-today");
    } else if (task.date === tomorrow) {
        li.classList.add("due-tomorrow");
    }
}

const categorySpan = document.createElement("span");
categorySpan.textContent = `[${task.category}] `;
categorySpan.classList.add("task-category", task.category.trim());

const textSpan = document.createElement("span");
let displayText = task.text;
if (task.date) {
    displayText += ` (Due: ${task.date})`;
}
if (task.date && task.date < today && !task.completed) {
    displayText = "⚠️ " + displayText;
}

textSpan.textContent = displayText;
const buttons = document.createElement("div");
buttons.classList.add("task-buttons");

// Complete
const completeBtn = document.createElement("button");
completeBtn.textContent = "✓";
completeBtn.classList.add("complete-btn");
completeBtn.onclick = () => {
    li.classList.toggle("completed");
    li.classList.remove("overdue");
    updateLocalStorage();
    updateCounter();
};

// Edit
const editBtn = document.createElement("button");
editBtn.textContent = "Edit";
editBtn.classList.add("edit-btn");
editBtn.onclick = () => {
    const newText = prompt("Edit task:", task.text);
    if (newText) {
        task.text = newText;
        createTaskElement(task);
        li.remove();
        updateLocalStorage();;
    }
};

// Delete
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "X";
deleteBtn.classList.add("delete-btn");
deleteBtn.onclick = () => {
    li.remove();
    updateLocalStorage();
    updateCounter();
};

buttons.append(completeBtn, editBtn, deleteBtn);
li.append(categorySpan, textSpan, buttons);
taskList.appendChild(li);

}

// Local storage
function updateLocalStorage() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
  const category = li.querySelector(".task-category").textContent.replace(/[\[\]]/g, "").trim();
  const textFull = li.querySelectorAll("span")[1].textContent;
  const completed = li.classList.contains("completed");
  let priority = "";
        if (li.classList.contains("priority-High")) {
            priority = "High";
        } else if (li.classList.contains("priority-Medium")) {
            priority = "Medium";
        } else if (li.classList.contains("priority-Low")) {
            priority = "Low";
        }
  const match = textFull.match(/⚠️?\s?(.*?)(?: \(Due: (.*?)\))?$/);

  tasks.push({
        text: match ? match[1] : textFull,
        date: match && match[2] ? match[2] : "",
        category: category,
        completed: completed,
        priority: priority
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
