/* ==========================================================================
   1. GLOBAL SYSTEM THEME ORCHESTRATION ENGINE (SAFE WRAPPED)
   ========================================================================== */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';

// Initial state application configuration
document.body.setAttribute('data-theme', savedTheme);

// 🛡️ Safety Gateway Check: Execute theme updates ONLY if the button exists on the page
if (themeToggle) {
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

    // Click event listener tracking toggle execution signals
    themeToggle.addEventListener('click', () => {
        const activeTheme = document.body.getAttribute('data-theme');
        const targetTheme = activeTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', targetTheme);
        localStorage.setItem('portfolio-theme', targetTheme);
        themeToggle.textContent = targetTheme === 'dark' ? '☀️' : '🌙';
    });
}

/* ==========================================================================
   2. ROADMAP ITERATION INTERACTIVE FILTER ENGINE
   ========================================================================== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentActive = document.querySelector('.filter-btn.active');
            if (currentActive) currentActive.classList.remove('active');
            btn.classList.add('active');

            const queryScope = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const scopeMatch = card.getAttribute('data-category');
                
                if (queryScope === 'all' || scopeMatch === queryScope) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    card.style.display = 'none';
                }
            });
        });
    });
}

/* ==========================================================================
   3. DOCUMENTATION OBJECT OVERLAY REPOSITORY & CONTROLLER
   ========================================================================== */
const modalRepository = {
    ecommerce: {
        title: "E-Commerce Interface Shell",
        desc: "A target architectural layout tracking modern UI/UX principles, structural data grouping, and semantic layouts without any bloated external tools.",
        objectives: [
            "Establish scalable design variables using core structural properties.",
            "Optimize rendering speeds using flexible alignments and layout grids.",
            "Build robust layouts capable of shrinking seamlessly down to mobile scopes."
        ]
    },
    taskapi: {
        title: "Secure Task Manager API",
        desc: "A headless full-stack system backend configuration tracing routing maps, data schemas, and token authentication routines.",
        objectives: [
            "Initialize modular routing structures cleanly using an Express application.",
            "Integrate modular middleware checks to intercept and decode JSON Web Tokens securely.",
            "Configure schema layers to screen payload elements tightly before persistence layers."
        ]
    },
    chat: {
        title: "Real-Time Engine Sync",
        desc: "An advanced socket server configuration built to process stream metrics and handle bidirectional payloads concurrently.",
        objectives: [
            "Set up dual-channel network handshakes using persistent WebSocket interfaces.",
            "Apply origin verification checks to prevent script injection attacks at the gateway.",
            "Coordinate components that update user dashboards instantly upon packet signals."
        ]
    }
};

function openModal(projectKey) {
    const data = modalRepository[projectKey];
    const targetContainer = document.getElementById('modalContent');
    const projectModal = document.getElementById('projectModal');
    
    if (!data || !targetContainer || !projectModal) return;

    targetContainer.innerHTML = `
        <h2>${data.title}</h2>
        <p style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.5rem;">${data.desc}</p>
        <h4>System Learning Blueprint Goals</h4>
        <ul style="margin-top: 0.5rem;">
            ${data.objectives.map(item => `<li>${item}</li>`).join('')}
        </ul>
    `;
    
    projectModal.classList.add('active');
}

function closeModal(event) {
    const projectModal = document.getElementById('projectModal');
    if (projectModal && event.target.classList.contains('modal-overlay')) {
        projectModal.classList.remove('active');
    }
}

/* ==========================================================================
   4. FULL-STACK BACKEND RESOURCE TRANSMISSION CONNECTOR
   ========================================================================== */
const contactForm = document.getElementById('portfolioForm');

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const formData = new FormData(contactForm);
        const payloadData = {
            name: formData.get('userName'),
            email: formData.get('userEmail'),
            message: formData.get('userMessage')
        };

        console.log("Transmitting payload structure to Express gateway:", payloadData);

        fetch('/api/contact', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(payloadData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Server returned execution status code ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            alert(`Success Signal: ${result.message}`);
            contactForm.reset(); 
        })
        .catch(err => {
            console.error("Network infrastructure interface failure details:", err);
            alert("Unable to transmit signal to backend engine. Verify your node environment terminal is running!");
        });
    });
}
