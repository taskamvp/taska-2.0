// js/auth.js
import { auth, database } from './firebase-config.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, fetchSignInMethodsForEmail } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { ref, set } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';

// Show form based on role selection
export function showForm(userType) {
    const roleSelection = document.getElementById('role-selection');
    const profForm = document.getElementById('professional-form');
    const studForm = document.getElementById('student-form');

    roleSelection.style.display = 'none';
    if (userType === 'professional') {
        profForm.style.display = 'block';
        studForm.style.display = 'none';
    } else {
        studForm.style.display = 'block';
        profForm.style.display = 'none';
    }
}

// Show warning notice
function showWarning(message) {
    const notice = document.getElementById('warning-notice');
    const messageSpan = document.getElementById('warning-message');
    messageSpan.textContent = message;
    notice.style.display = 'flex';
    setTimeout(() => {
        notice.style.display = 'none';
    }, 3000); // Hide after 3 seconds
}

// Show/Hide loading overlay
function toggleLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = show ? 'flex' : 'none';
}

// Login function
export function login(userType) {
    const email = document.getElementById(userType === 'professional' ? 'prof-email' : 'stud-email').value;
    const password = document.getElementById(userType === 'professional' ? 'prof-password' : 'stud-password').value;

    toggleLoading(true);
    setPersistence(auth, browserLocalPersistence)
        .then(() => {
            return signInWithEmailAndPassword(auth, email, password);
        })
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(`${userType} logged in: ${user.email}, UID: ${user.uid}`);
            localStorage.setItem('userId', user.uid);
            localStorage.setItem('userRole', userType);
            toggleLoading(false);
            window.location.href = userType === 'professional' ? 'professional/explore.html' : 'workplace/tasks.html';
        })
        .catch((error) => {
            toggleLoading(false);
            console.debug("Login error:", error.code, error.message);
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                showWarning("No account found! Please sign up first.");
            } else {
                showWarning("Please check your email and password once again!");
            }
        });
}

// Signup function with validation
export async function signup(userType) {
    const email = document.getElementById(userType === 'professional' ? 'prof-email' : 'stud-email').value;
    const password = document.getElementById(userType === 'professional' ? 'prof-password' : 'stud-password').value;

    // Password length validation
    if (password.length < 6) {
        showWarning("Password must be at least 6 characters long");
        return;
    }

    toggleLoading(true);
    
    try {
        // Check if email already exists
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length > 0) {
            toggleLoading(false);
            showWarning("Account already exists. Please login.");
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(`${userType} signed up: ${user.email}, UID: ${user.uid}`);
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userRole', userType);

        // Store user profile data
        const list = userType === 'professional' ? 'professionalslist' : 'studentslist';
        const path = userType === 'professional' 
            ? `${list}/${user.uid}` 
            : `${list}/${user.uid}/personal`;
        const userRef = ref(database, path);
        const initialData = {
            email: user.email
        };

        await set(userRef, initialData);

        // Store loyalty score
        const loyaltySection = userType === 'professional' ? 'loyalty_professional' : 'loyalty_students';
        const loyaltyPath = `${loyaltySection}/${user.uid}`;
        const loyaltyRef = ref(database, loyaltyPath);
        const loyaltyData = {
            score: 1000
        };

        await set(loyaltyRef, loyaltyData);

        toggleLoading(false);
        window.location.href = userType === 'professional' ? 'professional/update-profile.html' : 'workplace/profile.html';
    } catch (error) {
        toggleLoading(false);
        console.debug("Signup error:", error.code, error.message);
        showWarning("Signup failed. Please try again!");
    }
}

// Logout function
export function signOut() {
    toggleLoading(true);
    auth.signOut()
        .then(() => {
            console.log("User signed out, clearing localStorage");
            localStorage.removeItem('userId');
            localStorage.removeItem('userRole');
            toggleLoading(false);
            window.location.href = 'login.html';
        })
        .catch((error) => {
            toggleLoading(false);
            console.debug("Logout error:", error);
            showWarning("Logout failed. Please try again!");
        });
}

// Check auth state
auth.onAuthStateChanged((user) => {
    if (user) {
        const storedUserId = localStorage.getItem('userId');
        if (!storedUserId || storedUserId !== user.uid) {
            localStorage.setItem('userId', user.uid);
            localStorage.setItem('userRole', window.location.href.includes('professional') ? 'professional' : 'student');
        }
        console.log(`User logged in: ${user.email}, UID: ${user.uid}`);
    } else {
        console.log('No user logged in');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
    }
});

// Function to get the user ID
export function getUserId() {
    return localStorage.getItem('userId');
}

// Function to get the user role
export function getUserRole() {
    return localStorage.getItem('userRole');
}