// js/explore.js
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('professional/explore.html')) {
        loadStudents();
    } else if (path.includes('explore.html')) {
        loadProfessionals();
    }
});

// Hardcoded student data
const studentsData = [
    {
        id: "priya-sharma",
        name: "Priya Sharma",
        skills: ["coding", "data-analysis", "research"],
        experience: "intermediate",
        availability: "part-time",
        location: "bangalore",
        rating: 4
    },
    {
        id: "amit-patel",
        name: "Amit Patel",
        skills: ["design", "project-management"],
        experience: "beginner",
        availability: "full-time",
        location: "delhi",
        rating: 3
    },
    {
        id: "rohan-gupta",
        name: "Rohan Gupta",
        skills: ["research", "coding"],
        experience: "advanced",
        availability: "part-time",
        location: "mumbai",
        rating: 5
    }
];

function loadStudents() {
    const studentsGrid = document.getElementById('students-grid');
    studentsGrid.innerHTML = '<p>Loading IIT talent...</p>';

    // Simulate a slight delay to mimic data loading (optional)
    setTimeout(() => {
        studentsGrid.innerHTML = '';
        studentsData.forEach(student => {
            const card = `
                <div class="student-card">
                    <h3>${student.name}</h3>
                    <p><strong>Skills:</strong> ${student.skills.join(', ')}</p>
                    <p><strong>Experience:</strong> ${student.experience}</p>
                    <p><strong>Availability:</strong> ${student.availability}</p>
                    <p><strong>Location:</strong> ${student.location}</p>
                    <p><strong>Rating:</strong> ${student.rating} ★</p>
                    <button class="cta-button" onclick="hireStudent('${student.id}')">Hire</button>
                </div>
            `;
            studentsGrid.innerHTML += card;
        });
    }, 500); // Remove this delay if not needed
}

function loadProfessionals() {
    // Placeholder for student explore.html (static data if needed later)
    const professionalsGrid = document.getElementById('professionals-grid');
    professionalsGrid.innerHTML = '<p>No professionals data hardcoded yet.</p>';
}

function applyFilters() {
    const path = window.location.pathname;
    if (path.includes('professional/explore.html')) {
        const searchInput = document.getElementById('search-input').value.toLowerCase();
        const skills = document.getElementById('skills').value;
        const experience = document.getElementById('experience').value;
        const availability = document.getElementById('availability').value;
        const location = document.getElementById('location').value;
        const rating = document.getElementById('rating').value;

        const studentsGrid = document.getElementById('students-grid');
        studentsGrid.innerHTML = '';

        studentsData.forEach(student => {
            const name = student.name.toLowerCase();
            const skillsText = student.skills.join(', ').toLowerCase();
            const expText = student.experience.toLowerCase();
            const availText = student.availability.toLowerCase();
            const locText = student.location.toLowerCase();
            const rateText = student.rating.toString();

            const matchesSearch = name.includes(searchInput) || skillsText.includes(searchInput);
            const matchesSkills = skills === 'all' || skillsText.includes(skills);
            const matchesExp = experience === 'all' || expText.includes(experience);
            const matchesAvail = availability === 'all' || availText.includes(availability);
            const matchesLoc = location === 'all' || locText.includes(location);
            const matchesRate = rating === 'all' || parseInt(rateText) >= parseInt(rating);

            if (matchesSearch && matchesSkills && matchesExp && matchesAvail && matchesLoc && matchesRate) {
                const card = `
                    <div class="student-card">
                        <h3>${student.name}</h3>
                        <p><strong>Skills:</strong> ${student.skills.join(', ')}</p>
                        <p><strong>Experience:</strong> ${student.experience}</p>
                        <p><strong>Availability:</strong> ${student.availability}</p>
                        <p><strong>Location:</strong> ${student.location}</p>
                        <p><strong>Rating:</strong> ${student.rating} ★</p>
                        <button class="cta-button" onclick="hireStudent('${student.id}')">Hire</button>
                    </div>
                `;
                studentsGrid.innerHTML += card;
            }
        });

        if (!studentsGrid.innerHTML) {
            studentsGrid.innerHTML = '<p>No matching IIT talent found.</p>';
        }
    }
}

function connectStudent() {
    alert('Connecting you to an IIT prodigy... (Functionality to be implemented)');
}

function hireStudent(studentId) {
    alert(`Hiring student with ID: ${studentId} (Functionality to be implemented)`);
}

window.applyFilters = applyFilters;
window.connectStudent = connectStudent;
window.hireStudent = hireStudent;