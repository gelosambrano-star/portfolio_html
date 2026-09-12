/* ==========================================================================
   🌐 FRONTEND CONTROL LOGIC ENGINE (INLINE STATUS TELEMETRY)
   ========================================================================== */
const contactForm = document.getElementById('portfolioForm');

if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const submitBtn = document.getElementById('submitBtn');
        const btnText = document.getElementById('btnText');
        const btnSpinner = document.getElementById('btnSpinner');
        const statusText = document.getElementById('formStatusText'); // Target new text row

        // Hide any previous status text before sending
        if (statusText) { statusText.style.display = "none"; }

        if (submitBtn && btnText && btnSpinner) {
            submitBtn.style.opacity = "0.6";
            submitBtn.style.pointerEvents = "none";
            btnText.textContent = "Routing...";
            btnSpinner.style.display = "inline-block";
        }

        const formData = new FormData(contactForm);
        const payloadData = {
            name: formData.get('userName') || formData.get('name'),
            email: formData.get('userEmail') || formData.get('email'),
            message: formData.get('userMessage') || formData.get('message')
        };

        fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadData)
        })
        .then(response => response.json())
        .then(result => {
            if (statusText) {
                statusText.style.display = "block";
                
                // Check if response matches a valid successful save sequence
                if (result.success || result.message.includes("logged") || result.message.includes("received")) {
                    statusText.style.color = "#10b981"; // Success Emerald Green
                    statusText.textContent = "✓ Signal Logged Securely to MongoDB Cluster!";
                    contactForm.reset(); // Wipe fields cleanly
                } else {
                    // Triggers if backend rate limiter blocks the request
                    statusText.style.color = "#ef4444"; // Warning Crimson Red
                    statusText.textContent = `❌ Blocked: ${result.message}`;
                }
            }
        })
        .catch(err => {
            console.error("Pipeline Sync Error:", err);
            if (statusText) {
                statusText.style.display = "block";
                statusText.style.color = "#ef4444";
                statusText.textContent = "❌ Network Infrastructure Error. Transmission failed.";
            }
        })
        .finally(() => {
            if (submitBtn && btnText && btnSpinner) {
                submitBtn.style.opacity = "1";
                submitBtn.style.pointerEvents = "auto";
                btnText.textContent = "Send Signal";
                btnSpinner.style.display = "none";
            }
            
            // Automatically fade the confirmation message out after 5 seconds
            setTimeout(() => {
                if (statusText) { statusText.style.display = "none"; }
            }, 5000);
        });
    });
}

function openModal(id) {
    const modal = document.getElementById('projectModal');
    const content = document.getElementById('modalContent');
    if (modal && content) {
        content.innerHTML = `<h3>Module Inspector Log [${id.toUpperCase()}]</h3><p style='margin-top:1rem; color:var(--text-secondary);'>System verification logs clear.</p><button class='btn btn-secondary' onclick='closeModal(event)' style='margin-top:1.5rem; width:100%'>Close Inspector</button>`;
        modal.style.display = 'flex';
    }
}

function closeModal(e) {
    const modal = document.getElementById('projectModal');
    if (modal && (e.target === modal || e.target.classList.contains('btn-secondary'))) {
        modal.style.display = 'none';
    }
}
