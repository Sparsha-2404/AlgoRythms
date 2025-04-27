// === frontend/scripts/app.js ===

document.addEventListener('DOMContentLoaded', function() {
    initUI();
    initHeroGraph();
    initGraphDemo();
    setupGlobalListeners();
    setupAuthLogic();
    setupGraphControls();
    setupNavbarScroll();
});

// ========================
// UI Initialization
// ========================

function initUI() {
    // Placeholder for any initial animations if needed
}

// ========================
// Navbar Scroll Effect
// ========================

function setupNavbarScroll() {
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.backgroundColor = 'var(--white)';
            navbar.style.boxShadow = 'var(--shadow)';
        }
    });
}

// ========================
// Global UI Event Listeners
// ========================

function setupGlobalListeners() {
    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition - navbarHeight,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile nav toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    mobileToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // CTA buttons
    document.getElementById('demo-btn').addEventListener('click', () => openModal('demo-modal'));
    document.getElementById('request-demo-btn').addEventListener('click', () => openModal('demo-modal'));

    // Switch login/signup modals
    document.getElementById('switch-to-signup').addEventListener('click', function(e) {
        e.preventDefault();
        closeModal('login-modal');
        openModal('signup-modal');
    });
    document.getElementById('switch-to-login').addEventListener('click', function(e) {
        e.preventDefault();
        closeModal('signup-modal');
        openModal('login-modal');
    });

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) closeModal(this.id);
        });
    });

    // Close modal when clicking 'X'
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal.id);
        });
    });
}

// ========================
// Authentication Logic
// ========================

function setupAuthLogic() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const authButtonsContainer = document.querySelector('.auth-buttons');

    const token = localStorage.getItem('token');

    if (token) {
        // Already logged in
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';

        const logoutBtn = document.createElement('button');
        logoutBtn.innerText = 'Logout';
        logoutBtn.classList.add('btn', 'btn-outline');
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('token');
            alert('Logged out successfully!');
            location.reload();
        });
        authButtonsContainer.appendChild(logoutBtn);
    }

    // Login Submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                alert('Login successful!');
                closeModal('login-modal');
                location.reload();
            } else {
                alert(data.message || 'Login failed.');
            }
        } catch (error) {
            console.error('Login Error:', error);
            alert('Something went wrong.');
        }
    });

    // Signup Submit
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const role = document.getElementById('signup-role').value;

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem('token', data.token);
                alert('Signup successful!');
                closeModal('signup-modal');
                location.reload();
            } else {
                alert(data.message || 'Signup failed.');
            }
        } catch (error) {
            console.error('Signup Error:', error);
            alert('Something went wrong.');
        }
    });
}

// ========================
// Graph Demo Controls
// ========================

function setupGraphControls() {
    document.getElementById('add-node').addEventListener('click', function() {
        const nodeType = document.getElementById('node-type').value;
        const nodeTitle = document.getElementById('node-title').value;
        if (nodeTitle.trim() === '') {
            showToast('Please enter a node title', 'error');
            return;
        }
        addNode(nodeType, nodeTitle);
        document.getElementById('node-title').value = '';
    });

    document.getElementById('add-edge').addEventListener('click', function() {
        const sourceId = document.getElementById('source-node').value;
        const targetId = document.getElementById('target-node').value;

        if (!sourceId || !targetId || sourceId === targetId) {
            showToast('Please select two different nodes', 'error');
            return;
        }

        addEdge(sourceId, targetId);
    });

    document.getElementById('reset-graph').addEventListener('click', function() {
        resetGraph();
        showToast('Graph reset to empty', 'info');
    });

    document.getElementById('load-example').addEventListener('click', function() {
        loadExampleGraph();
        showToast('Example graph loaded', 'info');
    });
}

// ========================
// Modal Open/Close
// ========================

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.display = 'none';
    }
}

// ========================
// Toast Notification
// ========================

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.innerText = message;
    toast.className = 'toast show ' + type;
    setTimeout(() => {
        toast.className = toast.className.replace('show', '');
    }, 3000);
}