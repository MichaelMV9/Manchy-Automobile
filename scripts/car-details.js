let currentCar = null;
let currentImageIndex = 0;

function formatConditionDisplay(condition) {
    if (!condition) return 'N/A';
    const conditionLower = condition.toLowerCase().trim();
    if (conditionLower === 'used') {
        return 'Foreign Used';
    }
    return condition;
}

document.addEventListener('DOMContentLoaded', async function() {
    await loadCarDetails();
    setupInquiryForm();
});

async function loadCarDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('id');

    if (!carId) {
        window.location.href = 'cars.html';
        return;
    }

    const container = document.getElementById('detailsContainer');
    showLoading(container, 'Loading vehicle details...');

    try {
        currentCar = await CarService.getCarById(carId);

        if (!currentCar) {
            showError(container, 'Vehicle not found.');
            return;
        }

        displayCarDetails(currentCar);
    } catch (error) {
        console.error('Error loading car details:', error);
        showError(container, 'Unable to load vehicle details. Please try again later.');
    }
}

function displayCarDetails(car) {
    const container = document.getElementById('detailsContainer');
    const images = Array.isArray(car.images) ? car.images : [];

    if (images.length === 0) {
        images.push('https://via.placeholder.com/800x600?text=No+Image');
    }

    container.innerHTML = `
        <div class="car-details-wrapper">
            <a href="cars.html" class="back-link">
                ← Back to All Vehicles
            </a>

            <div class="details-grid">
                <div class="gallery-section">
                    <div class="main-image" id="mainImage">
                        <img src="${images[0]}" alt="${car.brand} ${car.model}">
                    </div>
                    <div class="thumbnail-grid" id="thumbnailGrid">
                        ${images.map((img, index) => `
                            <div class="thumbnail ${index === 0 ? 'active' : ''}" onclick="changeImage(${index})">
                                <img src="${img}" alt="View ${index + 1}">
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="info-section">
                    <div class="car-header">
                        <h1 class="car-name">${car.brand} ${car.model}</h1>
                        <div class="car-main-price">${formatCurrency(car.price)}</div>
                    </div>

                    <div class="action-buttons">
                        <button class="btn btn-primary" onclick="initiatePayment()">Buy Now</button>
                        <button class="btn btn-secondary" onclick="contactWhatsApp()">Contact Us</button>
                    </div>

                    <div class="specs-grid">
                        <div class="spec-item">
                            <span class="spec-label">Year</span>
                            <span class="spec-value">${car.year}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Transmission</span>
                            <span class="spec-value">${car.transmission}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Fuel Type</span>
                            <span class="spec-value">${car.fuel_type}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Color</span>
                            <span class="spec-value">${car.color || 'N/A'}</span>
                        </div>
                        <div class="spec-item">
                            <span class="spec-label">Condition</span>
                            <span class="spec-value">${formatConditionDisplay(car.condition)}</span>
                        </div>
                    </div>

                    ${car.description ? `
                        <div class="description-section">
                            <h3 class="section-heading">Description</h3>
                            <p class="description-text">${car.description}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

function changeImage(index) {
    const images = Array.isArray(currentCar.images) ? currentCar.images : ['https://via.placeholder.com/800x600?text=No+Image'];
    currentImageIndex = index;

    const mainImage = document.querySelector('#mainImage img');
    mainImage.src = images[index];

    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

function contactWhatsApp() {
    const message = `Hello, I'm interested in the ${currentCar.brand} ${currentCar.model} (${currentCar.year}) listed for ${formatCurrency(currentCar.price)}. Can you provide more information?`;
    const whatsappUrl = `https://wa.me/2347076470444?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

async function initiatePayment() {
    const email = prompt('Please enter your email address for payment:');

    if (!email || !email.includes('@')) {
        showNotification('Please provide a valid email address', 'error');
        return;
    }

    const name = prompt('Please enter your full name:');
    if (!name || name.trim().length < 2) {
        showNotification('Please provide your full name', 'error');
        return;
    }

    const phone = prompt('Please enter your phone number:');
    if (!phone || phone.trim().length < 10) {
        showNotification('Please provide a valid phone number', 'error');
        return;
    }

    try {
        const response = await fetch(`${CONFIG.SUPABASE_URL}/functions/v1/initialize-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                amount: Math.round(Number(currentCar.price) * 100),
                metadata: {
                    car_id: currentCar.id,
                    car_name: `${currentCar.brand} ${currentCar.model}`,
                    customer_name: name,
                    customer_phone: phone
                }
            })
        });

        const result = await response.json();

        if (!result.status || !result.data) {
            throw new Error(result.message || 'Payment initialization failed');
        }

        window.location.href = result.data.authorization_url;

    } catch (error) {
        console.error('Payment error:', error);
        showNotification('Unable to process payment. Please try again or contact us directly.', 'error');
    }
}

function setupInquiryForm() {
    const form = document.getElementById('inquiryForm');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const inquiryData = {
            car_id: currentCar.id,
            customer_name: formData.get('name'),
            customer_email: formData.get('email'),
            customer_phone: formData.get('phone'),
            inquiry_type: formData.get('inquiry_type'),
            message: formData.get('message')
        };

        try {
            await InquiryService.submitInquiry(inquiryData);
        } catch (error) {
            console.error('Error submitting inquiry:', error);
        } finally {
            showNotification('Message sent successfully and we will get back to you');
            form.reset();
        }
    });
}
