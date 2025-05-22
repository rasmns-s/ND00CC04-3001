document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const openFormBtn = document.getElementById('open-form-btn');
    const popup = document.getElementById('submission-popup');
    const closeBtn = document.querySelector('.close-popup');
    const form = document.getElementById('submission-form');
    
    // Notification functions
    function showNotificationBanner(message, type = 'success') {
        const banner = document.createElement('div');
        banner.className = `notification-banner ${type}`;
        
        banner.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="dismiss-notification">&times;</button>
            </div>
        `;
        
        document.body.appendChild(banner);
        
        // Trigger animation
        setTimeout(() => banner.classList.add('active'), 10);
        
        // Set up dismiss button
        banner.querySelector('.dismiss-notification').addEventListener('click', () => {
            dismissNotification(banner);
        });
        
        // Auto-dismiss
        setTimeout(() => dismissNotification(banner), 5000);
    }
    
    function dismissNotification(banner) {
        banner.classList.remove('active');
        
        // Remove from DOM after animation completes
        setTimeout(() => {
            banner.parentNode?.removeChild(banner);
        }, 300);
    }
    
    // Event handlers
    function openPopup(e) {
        e.preventDefault();
        popup.classList.add('active');
    }
    
    function closePopup() {
        popup.classList.remove('active');
    }
    
    function handleOutsideClick(e) {
        if (e.target === popup) {
            closePopup();
        }
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        // Here you would normally handle the form data
        showNotificationBanner('Kiitos julkaisuehdotuksestasi! Tarkistamme tiedot pian.');
        closePopup();
        form.reset();
    }
    
    // Event listeners
    openFormBtn.addEventListener('click', openPopup);
    closeBtn.addEventListener('click', closePopup);
    window.addEventListener('click', handleOutsideClick);
    form.addEventListener('submit', handleSubmit);
});
