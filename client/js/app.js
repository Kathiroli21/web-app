document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('add-task-btn');
    const addTaskModal = new bootstrap.Modal(document.getElementById('addTaskModal'));
    const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
    const addTaskForm = document.getElementById('add-task-form');
    const editTaskForm = document.getElementById('edit-task-form');
    const tasksContainer = document.getElementById('tasks-container');
    const welcomeText = "Welcome to Task Manager";
    const welcomeTextElement = document.getElementById('welcome-text');
    let currentTaskId = '';

    let i = 0;
    const typeWriter = () => {
        if (i < welcomeText.length) {
            welcomeTextElement.innerHTML += welcomeText.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };

    typeWriter();

    
    // Fetch tasks from the server
    const fetchTasks = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/tasks');
            const tasks = await response.json();
            tasksContainer.innerHTML = '';
            tasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'task';
                taskElement.innerHTML = `
                    <h5>${task.title}</h5>
                    <p>${task.content}</p>
                    <button class="btn btn-primary edit-btn" data-id="${task._id}"><ion-icon name="create-outline"></ion-icon></button>
                    <button class="btn btn-danger delete-btn" data-id="${task._id}">Delete</button>
                `;
                tasksContainer.appendChild(taskElement);
            });


            tasksContainer.querySelectorAll('.edit-btn').forEach(btn => {
                btn.addEventListener('click', handleEditTask);
            });

            tasksContainer.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', handleDeleteTask);
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };


    addTaskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;

        try {
            await fetch('http://localhost:3000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });
            addTaskModal.hide();
            fetchTasks();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    });


    const handleEditTask = async (event) => {
        const id = event.target.getAttribute('data-id');
        currentTaskId = id;

        try {
            const response = await fetch(`http://localhost:3000/api/tasks/${id}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const task = await response.json();
            document.getElementById('edit-title').value = task.title;
            document.getElementById('edit-content').value = task.content;

            editTaskModal.show();
        } catch (error) {
            console.error('Error fetching task for editing:', error);
        }
    };


    editTaskForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const title = document.getElementById('edit-title').value;
        const content = document.getElementById('edit-content').value;

        try {
            await fetch(`http://localhost:3000/api/tasks/${currentTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });
            editTaskModal.hide();
            fetchTasks();
        } catch (error) {
            console.error('Error editing task:', error);
        }
    });


    const handleDeleteTask = async (event) => {
        const id = event.target.getAttribute('data-id');

        if (confirm('Are you sure you want to delete this task?')) {
            try {
                await fetch(`http://localhost:3000/api/tasks/${id}`, {
                    method: 'DELETE',
                });
                fetchTasks();
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        }
    };


    addTaskBtn.addEventListener('click', () => {
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
        addTaskModal.show();
    });


    fetchTasks();
    
});
