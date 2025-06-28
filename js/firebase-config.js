// js/firebase-config.js
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyDZIDlEtaNRxODoFhRw0xF2yYFBqqBexqo",
    authDomain: "taska-45011.firebaseapp.com",
    databaseURL: "https://taska-45011-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "taska-45011",
    storageBucket: "taska-45011.firebasestorage.app",
    messagingSenderId: "205487498813",
    appId: "1:205487498813:web:0de2c9eab567482781ec54",
    measurementId: "G-G0G1F6GQ9B"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };