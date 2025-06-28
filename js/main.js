// js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // Dark Mode Toggle
    window.toggleDarkMode = function() {
        document.body.classList.toggle('dark-mode');
        document.querySelector('.navbar').classList.toggle('dark-mode');
        document.querySelector('.logo').classList.toggle('dark-mode');
        document.querySelectorAll('.nav-menu li a').forEach(link => link.classList.toggle('dark-mode'));
        document.querySelector('.dark-mode-toggle').classList.toggle('dark-mode');
        document.querySelector('.search-filter').classList.toggle('dark-mode');
        document.querySelector('.custom-input').classList.toggle('dark-mode');
        document.querySelector('.custom-dropdown').classList.toggle('dark-mode');
        document.querySelectorAll('.cta-button').forEach(btn => btn.classList.toggle('dark-mode'));
        document.querySelector('.task-grid-section').classList.toggle('dark-mode');
        document.querySelector('.task-grid-section h2').classList.toggle('dark-mode');
        document.querySelectorAll('.student-card').forEach(card => card.classList.toggle('dark-mode'));
        document.querySelectorAll('.student-card h3').forEach(h3 => h3.classList.toggle('dark-mode'));
        document.querySelectorAll('.student-card p').forEach(p => p.classList.toggle('dark-mode'));
        document.querySelectorAll('.pagination-btn').forEach(btn => btn.classList.toggle('dark-mode'));
        document.querySelector('#page-info').classList.toggle('dark-mode');
        document.querySelector('.number-summary').classList.toggle('dark-mode');
        document.querySelectorAll('.summary-item').forEach(item => item.classList.toggle('dark-mode'));
        document.querySelectorAll('.summary-item span').forEach(span => span.classList.toggle('dark-mode'));
        document.querySelectorAll('.summary-item p').forEach(p => p.classList.toggle('dark-mode'));
        document.querySelector('.how-tasks-work').classList.toggle('dark-mode');
        document.querySelector('.how-tasks-work h2').classList.toggle('dark-mode');
        document.querySelectorAll('.step').forEach(step => step.classList.toggle('dark-mode'));
        document.querySelectorAll('.step h3').forEach(h3 => h3.classList.toggle('dark-mode'));
        document.querySelectorAll('.step p').forEach(p => p.classList.toggle('dark-mode'));
        document.querySelector('.user-feedback').classList.toggle('dark-mode');
        document.querySelector('.user-feedback h2').classList.toggle('dark-mode');
        document.querySelectorAll('.feedback-item').forEach(item => item.classList.toggle('dark-mode'));
        document.querySelectorAll('.feedback-item span').forEach(span => span.classList.toggle('dark-mode'));
        document.querySelectorAll('.feedback-nav button').forEach(btn => btn.classList.toggle('dark-mode'));
        document.querySelector('footer').classList.toggle('dark-mode');
        document.querySelectorAll('.footer-links a').forEach(link => link.classList.toggle('dark-mode'));
        document.querySelector('.scroll-to-top').classList.toggle('dark-mode');
    };

    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Sample student data (replace with Firebase fetch)
    const students = [
        { name: 'Amit Sharma', category: 'coding', institute: 'IIT Delhi', description: 'Skilled in Python and Java.', image: 'assets/st1.jpeg' },
        { name: 'Krishna Patel', category: 'design', institute: 'NIT Trichy', description: 'Expert in UI/UX design.', image: 'assets/st2.jpg' },
        { name: 'Ravi Kumar', category: 'research', institute: 'IIT Bombay', description: 'Experienced in research.', image: 'assets/st3.jpg' },
        { name: 'Sneha Patel', category: 'data', institute: 'NIT Surathkal', description: 'Proficient in data analysis.', image: 'assets/st4.jpeg' },
        { name: 'Vikram Rao', category: 'tech', institute: 'IIT Madras', description: 'Tech enthusiast and developer.', image: 'https://via.placeholder.com/150' },
        { name: 'Ananya Gupta', category: 'content', institute: 'NIT Warangal', description: 'Creative content writer.', image: 'https://via.placeholder.com/150' },
        { name: 'Karan Mehta', category: 'coding', institute: 'IIT Kanpur', description: 'Full-stack developer.', image: 'https://via.placeholder.com/150' },
        { name: 'Neha Joshi', category: 'design', institute: 'NIT Calicut', description: 'Graphic design specialist.', image: 'https://via.placeholder.com/150' },
    ];

    const studentsPerPage = 4;
    let currentPage = 1;

    function displayStudents(filteredStudents) {
        const studentsGrid = document.getElementById('students-grid');
        studentsGrid.innerHTML = '';
        const start = (currentPage - 1) * studentsPerPage;
        const end = start + studentsPerPage;
        const paginatedStudents = filteredStudents.slice(start, end);

        paginatedStudents.forEach(student => {
            const card = document.createElement('div');
            card.className = 'student-card';
            card.innerHTML = `
                <img src="${student.image}" alt="${student.name}" loading="lazy">
                <h3>${student.name}</h3>
                <p>${student.institute}</p>
                <p>${student.description}</p>
                <button class="cta-button" onclick="connectToProfessional('${student.name}')">Connect</button>
            `;
            studentsGrid.appendChild(card);
        });

        const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
        document.getElementById('page-info').textContent = `Page ${currentPage} of ${totalPages}`;
    }

    window.filterStudents = function() {
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        const category = document.getElementById('category-filter').value;
        currentPage = 1;

        const filteredStudents = students.filter(student => {
            const matchesSearch = student.name.toLowerCase().includes(searchTerm) || student.description.toLowerCase().includes(searchTerm);
            const matchesCategory = category === 'all' || student.category === category;
            return matchesSearch && matchesCategory;
        });

        displayStudents(filteredStudents);
    };

    window.prevPage = function() {
        if (currentPage > 1) {
            currentPage--;
            filterStudents();
        }
    };

    window.nextPage = function() {
        const totalPages = Math.ceil(students.length / studentsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            filterStudents();
        }
    };

    // Initial display
    displayStudents(students);

    // Number Summary Animation
    function animateCounter(element, target) {
        let count = 0;
        const increment = target / 100;
        const interval = setInterval(() => {
            count += increment;
            if (count >= target) {
                count = target;
                clearInterval(interval);
            }
            element.textContent = Math.round(count);
        }, 20);
    }

    const counters = document.querySelectorAll('.summary-item span');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        animateCounter(counter, target);
    });

    // Feedback Carousel with Auto-Scroll
    let currentFeedback = 0;
    const feedbackItems = document.querySelectorAll('.feedback-item');
    const totalFeedback = feedbackItems.length;

    function showFeedback(index) {
        feedbackItems.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    window.prevFeedback = function() {
        currentFeedback = (currentFeedback - 1 + totalFeedback) % totalFeedback;
        showFeedback(currentFeedback);
    };

    window.nextFeedback = function() {
        currentFeedback = (currentFeedback + 1) % totalFeedback;
        showFeedback(currentFeedback);
    };

    // Auto-scroll every 5 seconds
    setInterval(nextFeedback, 5000);

    // Scroll to Top
    const scrollToTopBtn = document.querySelector('.scroll-to-top');
    window.addEventListener('scroll', () => {
        scrollToTopBtn.classList.toggle('visible', window.scrollY > 300);
    });

    window.scrollToTop = function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Utility Functions
    window.connectToProfessional = (name) => alert(`Connecting to ${name}...`);
});