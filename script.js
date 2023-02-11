const todoForm = document.querySelector("#todo-form");
const todoList = document.querySelector(".todos");
const totalTask = document.querySelector("#total-task");
const remainingTask = document.querySelector("#remaining-task");
const completedTask = document.querySelector("#completed-task");
const mainInput = document.querySelector("#todo-form input");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let isEditing = true;

function render() {
    let html = tasks.map((task, index) => {
        return `<li class="id${task.id} ${task.isCompleted ? "completed" : ""}">
        <div>
        <input type="checkbox" name="tasks" id="${
            task.id
        }" class="check${index}" ${task.isCompleted ? "checked" : ""}>
        <p>${task.name}</p>
    </div>

    <div class="actions">
        <button title="Edit task ${task.name}" class="edit-task">
            <i class="fas fa-edit"></i>
        </button>
        <button title="Remove task ${
            task.name
        }" class="remove-task" onclick = "deletasks(${index})">
            <i class="fas fa-trash-alt"></i>
        </button>
    </div>
        </li>
        `;
    });
    todoList.innerHTML = html.join("");
}

window.addEventListener("load", () => {
    renderStats();
    render();
    completeTask();
    editTask();
    // deleteTask();
});
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputValue = mainInput.value;
    if (inputValue.trim() === "") alert("Please input task!");
    if (!inputValue) return;
    const task = {
        id: new Date().getTime(),
        name: inputValue,
        isCompleted: false,
    };
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    createTask(task);
    renderStats();
    // deleteTask();
    todoForm.reset();
    mainInput.focus();
});

function createTask(task, index) {
    const taskEle = document.createElement("li");
    taskEle.setAttribute("class", "id" + task.id);

    if (task.isCompleted) {
        taskEle.classList.add("completed");
    }

    const html = `
        <div>
            <input type="checkbox" name="tasks" id="${
                task.id
            }" class="check${index}" ${task.isCompleted ? "checked" : ""}>
            <p>${task.name}</p>
        </div>

        <div class="actions">
            <button title="Edit task ${task.name}" class="edit-task">
                <i class="fas fa-edit"></i>
            </button>
            <button title="Remove task ${
                task.name
            }" class="remove-task" onclick = "deletasks(${index})">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>`;
    taskEle.innerHTML = html;
    todoList.appendChild(taskEle);
}

function countTask() {
    const completedTasksArr = tasks.filter((task) => task.isCompleted === true);
    return {
        total: tasks.length,
        completed: completedTasksArr.length,
        remaining: tasks.length - completedTasksArr.length,
    };
}

function renderStats() {
    let countTasks = countTask();
    totalTask.innerText = countTasks.total;
    remainingTask.innerText = countTasks.remaining;
    completedTask.innerText = countTasks.completed;
}

function completeTask() {
    let checkBtns = document.querySelectorAll("input[type=checkbox]");
    checkBtns.forEach((checkBtn, index) => {
        checkBtn.addEventListener("click", () => {
            let liElement = document.querySelector(".id" + checkBtn.id);
            if (tasks[index].isCompleted) {
                tasks[index].isCompleted = false;
                liElement.classList.remove("completed");
            } else {
                tasks[index].isCompleted = true;
                liElement.classList.add("completed");
            }
            localStorage.setItem("tasks", JSON.stringify(tasks));
            renderStats();
        });
    });
}

function editTask() {
    let editElements = document.querySelectorAll(".edit-task");
    editElements.forEach((editElement, index) => {
        editElement.addEventListener("click", () => {
            if (isEditing === true) {
                isEditing = false;
                let checkboxElement = document.querySelector(`.check${index}`);
                checkboxElement.style.display = "none";
                console.log(checkboxElement);
                let liElement = document.querySelector(
                    `.id${tasks[index].id} div`
                );
                let inputElement = document.createElement("input");
                inputElement.setAttribute("class", "edit-field");

                liElement.appendChild(inputElement);
                let pElement = liElement.querySelector("p");
                pElement.style.display = "none";
                inputElement.value = pElement.textContent;
                document.onkeyup = (e) => {
                    let input = inputElement.value;
                    if (e.keyCode === 13) {
                        inputElement.style.display = "none";
                        checkboxElement.style.display = "grid";
                        pElement.innerText = input;
                        pElement.style.display = "block";
                        editElement.name = input;
                        tasks[index].name = input;
                        localStorage.setItem("tasks", JSON.stringify(tasks));
                        isEditing = true;
                    }
                };
            }
        });
    });
}

function deletasks(index) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderStats();
    render();
}
