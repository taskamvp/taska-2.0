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
            localStorage.setItem('userEmail', user.email);
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
            if (mappedUserType === 'student') {
                showWarning("Email already registered. Please login.");
            } else {
                showWarning("Account already exists. Please login.");
            }
            return;
        }

        // For students, also check if email exists in students database
        if (mappedUserType === 'student') {
            const { get } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js');
            const studentsRef = ref(database, 'studentslist');
            const snapshot = await get(studentsRef);
            
            if (snapshot.exists()) {
                const students = snapshot.val();
                const emailExists = Object.values(students).some(student => 
                    student.personal && student.personal.email === email
                );
                
                if (emailExists) {
                    toggleLoading(false);
                    showWarning("Email already registered. Please login.");
                    return;
                }
            }
        }

        // For professionals, also check if email exists in professionals database
        if (mappedUserType === 'professional') {
            const { get } = await import('https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js');
            const professionalsRef = ref(database, 'professionalslist');
            const snapshot = await get(professionalsRef);
            
            if (snapshot.exists()) {
                const professionals = snapshot.val();
                const emailExists = Object.values(professionals).some(professional => 
                    professional.email === email
                );
                
                if (emailExists) {
                    toggleLoading(false);
                    showWarning("Email already registered. Please login.");
                    return;
                }
            }
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log(`${mappedUserType} signed up: ${user.email}, UID: ${user.uid}`);
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userRole', mappedUserType);
        localStorage.setItem('userEmail', user.email);

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
        if (error.code === 'auth/email-already-in-use') {
            if (mappedUserType === 'student') {
                showWarning("Email already registered. Please login.");
            } else {
                showWarning("Account already exists. Please login.");
            }
        } else {
            showWarning("Signup failed. Please try again!");
        }
    }
}

// Logout function
export function signOut() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout? This will clear all your data from this device.')) {
        toggleLoading(true);
        auth.signOut()
            .then(() => {
                console.log("User signed out, clearing all browser data");
                
                // Clear all browser data related to the site
                try {
                    // Clear localStorage
                    localStorage.clear();
                    
                    // Clear sessionStorage
                    sessionStorage.clear();
                    
                    // Clear all cookies
                    const cookies = document.cookie.split(";");
                    for (let i = 0; i < cookies.length; i++) {
                        const cookie = cookies[i];
                        const eqPos = cookie.indexOf("=");
                        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
                        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=" + window.location.hostname;
                    }
                    
                    // Clear IndexedDB if available
                    if ('indexedDB' in window) {
                        const databases = indexedDB.databases();
                        databases.then(dbList => {
                            dbList.forEach(db => {
                                indexedDB.deleteDatabase(db.name);
                            });
                        }).catch(err => {
                            console.log('IndexedDB deletion failed:', err);
                        });
                    }
                    
                    // Clear service worker cache if available
                    if ('serviceWorker' in navigator) {
                        navigator.serviceWorker.getRegistrations().then(registrations => {
                            for (let registration of registrations) {
                                registration.unregister();
                            }
                        });
                    }
                    
                    // Clear cache storage if available
                    if ('caches' in window) {
                        caches.keys().then(names => {
                            names.forEach(name => {
                                caches.delete(name);
                            });
                        });
                    }
                    
                    // Clear application cache if available
                    if ('applicationCache' in window) {
                        window.applicationCache.clear();
                    }
                    
                    // Clear browser cache for this domain
                    if ('caches' in window) {
                        caches.keys().then(cacheNames => {
                            return Promise.all(
                                cacheNames.map(cacheName => {
                                    return caches.delete(cacheName);
                                })
                            );
                        });
                    }
                    
                    console.log('All browser data cleared successfully');
                } catch (clearError) {
                    console.log('Error clearing browser data:', clearError);
                }
                
                toggleLoading(false);
                window.location.href = 'index.html';
            })
            .catch((error) => {
                toggleLoading(false);
                console.debug("Logout error:", error);
                showWarning("Logout failed. Please try again!");
            });
    } else {
        // User cancelled logout
        console.log("Logout cancelled by user");
    }
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