document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    setActiveNavLink();
});

function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navbar = document.getElementById('navbar');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });

        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatNumber(number) {
    return new Intl.NumberFormat('en-NG').format(number);
}

function createCarCard(car) {
    const images = Array.isArray(car.images) ? car.images : [];
    const primaryImage = images.length > 0 ? images[0] : 'https://via.placeholder.com/400x300?text=No+Image';

    const card = document.createElement('div');
    card.className = 'car-card';
    card.innerHTML = `
        <div class="car-image">
            <img src="${primaryImage}" alt="${car.brand} ${car.model}" loading="lazy">
            <span class="car-badge">${car.condition}</span>
        </div>
        <div class="car-info">
            <h3 class="car-title">${car.brand} ${car.model}</h3>
            <div class="car-details">
                <span>${car.year}</span>
                <span>•</span>
                <span>${formatNumber(car.mileage)} km</span>
                <span>•</span>
                <span>${car.transmission}</span>
            </div>
            <div class="car-price">${formatCurrency(car.price)}</div>
            <div class="car-actions">
                <a href="/car-details.html?id=${car.id}" class="btn btn-primary">View Details</a>
                <button class="btn btn-secondary" onclick="quickInquiry('${car.id}', '${car.brand} ${car.model}')">Inquire</button>
            </div>
        </div>
    `;

    return card;
}

function showLoading(element, message = 'Loading...') {
    if (element) {
        element.innerHTML = `<div class="loading">${message}</div>`;
    }
}

function showError(element, message = 'An error occurred. Please try again.') {
    if (element) {
        element.innerHTML = `<div class="error-message">${message}</div>`;
    }
}

function quickInquiry(carId, carName) {
    const message = `I am interested in the ${carName}. Please provide me with more information.`;
    const whatsappNumber = '2347076470444';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
