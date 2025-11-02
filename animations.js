// Global Scroll Animation System with Fade In/Out
(function() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const delay = entry.target.getAttribute('data-delay') || 0;

            if (entry.isIntersecting) {
                // Fade in when element enters viewport
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                    entry.target.classList.remove('animate-out');
                }, delay);
            } else {
                // Fade out when element leaves viewport
                if (entry.target.classList.contains('animate-in')) {
                    entry.target.classList.add('animate-out');
                    entry.target.classList.remove('animate-in');
                }
            }
        });
    }, observerOptions);

    // Initialize animations when DOM is ready
    function initAnimations() {
        document.querySelectorAll('[data-animate]').forEach(el => {
            animateOnScroll.observe(el);
        });
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }
})();
