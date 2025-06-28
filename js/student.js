// js/student.js
import { auth, database } from './firebase-config.js';
import { ref, onValue, push, set } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

let user = { earnings: 0 };

// Display available tasks
function displayTaskBrowser() {
    const taskBrowser = document.getElementById('task-browser');
    if (taskBrowser) {
        const tasksRef = ref(database, 'tasks');
        onValue(tasksRef, (snapshot) => {
            taskBrowser.innerHTML = '';
            const tasks = snapshot.val();
            for (let id in tasks) {
                if (tasks[id].status === 'open') {
                    const taskDiv = document.createElement('div');
                    taskDiv.className = 'task-item';
                    taskDiv.innerHTML = `
                        <h3>${tasks[id].title}</h3>
                        <p>${tasks[id].desc}</p>
                        <p>Price: ₹${tasks[id].price} | Deadline: ${tasks[id].deadline}</p>
                        <button onclick="applyForTask('${id}')">Apply</button>
                    `;
                    taskBrowser.appendChild(taskDiv);
                }
            }
        });
    }
}

// Handle task application
window.applyForTask = function(taskId) {
    const appRef = push(ref(database, 'applications'));
    set(appRef, {
        taskId: taskId,
        studentId: auth.currentUser.uid,
        status: 'pending'
    }).then(() => alert('Application submitted!'));
};

document.addEventListener('DOMContentLoaded', () => {
    displayTaskBrowser();
});