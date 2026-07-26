/* ==========================================================================
   RessoX Web - Minimal & Fast Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion Toggle
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            item.classList.toggle('active');
        });
    });

    // SHA-256 Checksum Copy Action
    const copyShaBtn = document.getElementById('copyShaBtn');
    if (copyShaBtn) {
        copyShaBtn.addEventListener('click', () => {
            const shaCode = document.getElementById('shaCode').textContent;
            navigator.clipboard.writeText(shaCode);
            showToast("SHA-256 Checksum copied to clipboard! 📋");
        });
    }

    // Simple Toast Notification
    function showToast(msg) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<i class="fa-solid fa-circle-check text-pink"></i> <span>${msg}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});
