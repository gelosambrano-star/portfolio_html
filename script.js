/* ==========================================================================
   🌐 FRONTEND CONTROL LOGIC ENGINE
   ========================================================================== */
const contactForm = document.getElementById('portfolioForm');

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnSpinner = document.getElementById('btnSpinner');

        // Turn on the loading spinner visual interfaces instantly
        if (submitBtn && btnText && btnSpinner) {
            submitBtn.style.opacity = "0.6";
            submitBtn.style.pointerEvents = "none";
            btnText.textContent = "Routing Data Packet...";
            btnSpinner.style.display = "inline-block";
        }

        const formData = new FormData(contactForm);
        
        // Bundles both property variants to ensure 100% compatibility across cached builds
        const payloadData = {
            name: formData.get('userName') || formData.get('name'),
            email: formData.get('userEmail') || formData.get('email'),
            message: formData.get('userMessage') || formData.get('message'),
            userName: formData.get('userName') || formData.get('name'),
            userEmail: formData.get('userEmail') || formData.get('email'),
            userMessage: formData.get('userMessage') || formData.get('message')
        };

        fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadData)
        })
        .then(response => response.json())
        .then(result => {
            // Triggers your premium embedded glassmorphic popup modal card
            showCustomSuccessPopup(result.message || "Signal received and logged to database cluster!");
            if (result.success || result.message.includes("logged")) {
                contactForm.reset(); 
            }
        })
        .catch(err => {
            console.error("Link sync channel failure:", err);
            showCustomSuccessPopup("❌ Network transmission link error. Check your connection fields.");
        })
        .finally(() => {
            // Reset button back to standard active home styling parameters
            if (submitBtn && btnText && btnSpinner) {
                submitBtn.style.opacity = "1";
                submitBtn.style.pointerEvents = "auto";
                btnText.textContent = "Send Signal";
                btnSpinner.style.display = "none";
            }
        });
    });
}

// ==========================================================================
// 📡 CUSTOM SUCCESS CONFIRMATION MODAL TRANSITIONS
// ==========================================================================
function showCustomSuccessPopup(messageString) {
    const overlay = document.getElementById('successPopup');
    const msgContainer = document.getElementById('successPopupMessage');
    
    if (overlay && msgContainer) {
        msgContainer.textContent = messageString;
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
    }
}

function closeSuccessPopup() {
    const overlay = document.getElementById('successPopup');
    if (overlay) {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
    }
}

// Basic modal window handlers for blueprint inspector items
function openModal(id) {
    const modal = document.getElementById('projectModal');
    const content = document.getElementById('modalContent');
    if (modal && content) {
        content.innerHTML = `<h3>Module Inspector Log [${id.toUpperCase()}]</h3><p style='margin-top:1rem; color:var(--text-secondary);'>System verification logs clear. Route metrics operational on current cloud node mapping arrays.</p><button class='btn btn-secondary' onclick='closeModal(event)' style='margin-top:1.5rem; width:100%'>Close Inspector</button>`;
        modal.style.display = 'flex';
    }
}

function closeModal(e) {
    const modal = document.getElementById('projectModal');
    if (modal && (e.target === modal || e.target.classList.contains('btn-secondary'))) {
        modal.style.display = 'none';
    }
}
