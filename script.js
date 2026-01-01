const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const dateText = document.getElementById("date");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function today() {
  return new Date().toISOString().split("T")[0];
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

dateText.textContent = new Date().toDateString();

/* Weekly cleanup + rollover */
function maintainTasks() {
  const todayDate = today();
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  tasks = tasks.filter(task => {
    if (task.done) return false;
    if (task.createdAt < oneWeekAgo) return false;

    if (task.date < todayDate) {
      task.date = todayDate;
    }
    return true;
  });

  saveTasks();
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks
    .filter(task => task.date === today())
    .forEach(task => {
      const li = document.createElement("li");

      const textSpan = document.createElement("span");
      textSpan.textContent = task.text;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;

      checkbox.onchange = () => {
        task.done = checkbox.checked;
        saveTasks();
        renderTasks();
      };

      li.appendChild(textSpan);
      li.appendChild(checkbox);
      taskList.appendChild(li);
    });
}

addBtn.onclick = () => {
  if (!input.value.trim()) return;

  tasks.push({
    text: input.value,
    done: false,
    date: today(),
    createdAt: Date.now()
  });

  input.value = "";
  saveTasks();
  renderTasks();
};

maintainTasks();
renderTasks();

/* Service Worker */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
}

/* Notifications */
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}
