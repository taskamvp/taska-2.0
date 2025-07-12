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
    // Map employer to professional for consistency
    const mappedUserType = userType === 'employer' ? 'professional' : userType;
    
    // Get the correct email and password field IDs
    let emailFieldId, passwordFieldId;
    
    if (mappedUserType === 'professional') {
        emailFieldId = 'emp-email';
        passwordFieldId = 'emp-password';
    } else {
        emailFieldId = 'stud-email';
        passwordFieldId = 'stud-password';
    }
    
    const email = document.getElementById(emailFieldId).value;
    const password = document.getElementById(passwordFieldId).value;

    toggleLoading(true);
    setPersistence(auth, browserLocalPersistence)
        .then(() => {
            return signInWithEmailAndPassword(auth, email, password);
        })
        .then((userCredential) => {
            const user = userCredential.user;
            console.log(`${mappedUserType} logged in: ${user.email}, UID: ${user.uid}`);
            localStorage.setItem('userId', user.uid);
            localStorage.setItem('userRole', mappedUserType);
            toggleLoading(false);
            
            // Check if there's an invite parameter and redirect parameter
            const urlParams = new URLSearchParams(window.location.search);
            const inviteId = urlParams.get('invite');
            const redirect = urlParams.get('redirect');
            
            if (inviteId && redirect === 'checkinvite') {
                // Redirect back to checkinvite.html with the invite parameter
                window.location.href = `checkinvite.html?invite=${inviteId}`;
            } else {
                // Normal redirect based on user type
                window.location.href = mappedUserType === 'professional' ? 'professional/explore.html' : 'workplace/tasks.html';
            }
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
    // Map employer to professional for consistency
    const mappedUserType = userType === 'employer' ? 'professional' : userType;
    
    // Get the correct email and password field IDs
    let emailFieldId, passwordFieldId;
    
    if (mappedUserType === 'professional') {
        emailFieldId = 'prof-email';
        passwordFieldId = 'prof-password';
    } else {
        emailFieldId = 'stud-email';
        passwordFieldId = 'stud-password';
    }
    
    const email = document.getElementById(emailFieldId).value;
    const password = document.getElementById(passwordFieldId).value;

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
        console.log(`${mappedUserType} signed up: ${user.email}, UID: ${user.uid}`);
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userRole', mappedUserType);

        // Store user profile data
        const list = mappedUserType === 'professional' ? 'professionalslist' : 'studentslist';
        const path = mappedUserType === 'professional' 
            ? `${list}/${user.uid}` 
            : `${list}/${user.uid}/personal`;
        const userRef = ref(database, path);
        const initialData = {
            email: user.email
        };

        await set(userRef, initialData);

        // Store loyalty score
        const loyaltySection = mappedUserType === 'professional' ? 'loyalty_professional' : 'loyalty_students';
        const loyaltyPath = `${loyaltySection}/${user.uid}`;
        const loyaltyRef = ref(database, loyaltyPath);
        const loyaltyData = {
            score: 1000
        };

        await set(loyaltyRef, loyaltyData);

        toggleLoading(false);
        window.location.href = mappedUserType === 'professional' ? 'professional/profile.html' : 'workplace/profile.html';
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
            localStorage.clear(); // Clear all localStorage data
            toggleLoading(false);
            window.location.href = 'index.html';
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