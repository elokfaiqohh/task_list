// Interface untuk tugas
class TaskInterface {
    createTask(name) {
        throw new Error("Method 'createTask' must be implemented.");
    }
    deleteTask(element) {
        throw new Error("Method 'deleteTask' must be implemented.");
    }
}

// Kelas Tugas
class Task extends TaskInterface {
    constructor(name) {
        super();
        this.name = name;
    }

    createTask() {
        const taskSection = document.querySelector(".tasks");
        const taskDiv = document.createElement("div");
        taskDiv.classList.add("task");
        taskDiv.innerHTML = `
            <label id="taskname">
                <input onclick="taskManager.updateTask(this)" type="checkbox" id="check-task">
                <p>${this.name}</p>
            </label>
            <div class="delete">
                <i class="uil uil-trash"></i>
            </div>
        `;
        taskSection.appendChild(taskDiv);
        
        const deleteButton = taskDiv.querySelector(".delete");
        deleteButton.onclick = () => this.deleteTask(taskDiv);
        
        this.checkOverflow();
    }

    deleteTask(element) {
        element.remove();
        this.checkOverflow();
        taskManager.saveTasks(); // Simpan perubahan ke cookie
    }

    checkOverflow() {
        const taskSection = document.querySelector(".tasks");
        if (taskSection.offsetHeight >= 300) {
            taskSection.classList.add("overflow");
        } else {
            taskSection.classList.remove("overflow");
        }
    }
}

// Kelas Pengelola Tugas
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks(); // Muat tugas dari cookie
        this.bindEvents();
        this.renderTasks(); // Render tugas yang dimuat
    }

    bindEvents() {
        const taskInput = document.querySelector("#newtask input");
        taskInput.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                this.createTask(taskInput.value);
            }
        });

        document.querySelector("#push").onclick = () => {
            this.createTask(taskInput.value);
        };
    }

    createTask(name) {
        if (name.length === 0) {
            alert("The task field is blank. Enter a task name and try again.");
        } else {
            const newTask = new Task(name);
            newTask.createTask();
            this.tasks.push(newTask.name); // Simpan nama tugas
            this.saveTasks(); // Simpan tugas ke cookie
            document.querySelector("#newtask input").value = ""; // Clear input field
        }
    }

    updateTask(task) {
        const taskItem = task.parentElement.lastElementChild;
        if (task.checked) {
            taskItem.classList.add("checked");
        } else {
            taskItem.classList.remove("checked");
        }
    }

    saveTasks() {
        // Simpan daftar tugas ke cookie
        document.cookie = `tasks=${JSON.stringify(this.tasks)}; path=/; max-age=3600`;
    }

    loadTasks() {
        // Muat tugas dari cookie
        const cookies = document.cookie.split('; ');
        const taskCookie = cookies.find(row => row.startsWith('tasks='));
        if (taskCookie) {
            const tasks = JSON.parse(taskCookie.split('=')[1]);
            return tasks || [];
        }
        return [];
    }

    renderTasks() {
        // Render tugas yang sudah dimuat
        this.tasks.forEach(taskName => {
            const newTask = new Task(taskName);
            newTask.createTask();
        });
    }
}

// Eksekusi Program
const taskManager = new TaskManager();