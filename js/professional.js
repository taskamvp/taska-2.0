// js/professional.js
import { auth, database } from './firebase-config.js';
import { ref, set, onValue, push } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

// Display active tasks
function displayActiveTasks() {
    const activeTasks = document.getElementById('active-tasks');
    if (activeTasks) {
        const tasksRef = ref(database, 'tasks');
        onValue(tasksRef, (snapshot) => {
            activeTasks.innerHTML = '';
            const tasks = snapshot.val();
            for (let id in tasks) {
                if (tasks[id].postedBy === auth.currentUser.uid) {
                    const taskDiv = document.createElement('div');
                    taskDiv.className = 'task-item';
                    taskDiv.innerHTML = `
                        <h3>${tasks[id].title}</h3>
                        <p>${tasks[id].desc}</p>
                        <p>Price: ₹${tasks[id].price} | Deadline: ${tasks[id].deadline}</p>
                        <button onclick="viewApplications('${id}')">View Applications</button>
                    `;
                    activeTasks.appendChild(taskDiv);
                }
            }
        });
    }
}

// Handle task posting
function handleTaskPost(event) {
    event.preventDefault();
    const form = event.target;
    const newTask = {
        title: form.querySelector('input[type="text"]').value,
        desc: form.querySelector('textarea').value,
        price: parseInt(form.querySelector('input[type="number"]').value),
        deadline: form.querySelector('input[type="date"]').value,
        postedBy: auth.currentUser.uid,
        status: 'open'
    };
    const newTaskRef = push(ref(database, 'tasks'));
    set(newTaskRef, newTask).then(() => {
        form.reset();
        alert('Task posted!');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    if (taskForm) taskForm.addEventListener('submit', handleTaskPost);
    displayActiveTasks();
});