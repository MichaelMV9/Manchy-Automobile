let currentCar = null;
let currentImageIndex = 0;

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
    const features = Array.isArray(car.features) ? car.features : [];

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
                        <span class="car-condition-badge">${car.condition}</span>
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
                            <span class="spec-label">Mileage</span>
                            <span class="spec-value">${formatNumber(car.mileage)} km</span>
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
                            <span class="spec-value">${car.condition}</span>
                        </div>
                    </div>

                    ${car.description ? `
                        <div class="description-section">
                            <h3 class="section-heading">Description</h3>
                            <p class="description-text">${car.description}</p>
                        </div>
                    ` : ''}

                    ${features.length > 0 ? `
                        <div class="description-section">
                            <h3 class="section-heading">Features</h3>
                            <div class="features-list">
                                ${features.map(feature => `
                                    <div class="feature-item">${feature}</div>
                                `).join('')}
                            </div>
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

function initiatePayment() {
    const email = prompt('Please enter your email address for payment:');

    if (!email || !email.includes('@')) {
        showNotification('Please provide a valid email address', 'error');
        return;
    }

    const name = prompt('Please enter your full name:');
    if (!name) {
        showNotification('Please provide your name', 'error');
        return;
    }

    const phone = prompt('Please enter your phone number:');
    if (!phone) {
        showNotification('Please provide your phone number', 'error');
        return;
    }

    const amount = currentCar.price * 100;

    const handler = PaystackPop.setup({
        key: CONFIG.PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: amount,
        currency: 'NGN',
        ref: 'MA-' + Math.floor(Math.random() * 1000000000 + 1),
        metadata: {
            custom_fields: [
                {
                    display_name: 'Car',
                    variable_name: 'car',
                    value: `${currentCar.brand} ${currentCar.model}`
                },
                {
                    display_name: 'Customer Name',
                    variable_name: 'customer_name',
                    value: name
                },
                {
                    display_name: 'Phone',
                    variable_name: 'phone',
                    value: phone
                }
            ]
        },
        onClose: function() {
            showNotification('Payment cancelled', 'error');
        },
        callback: async function(response) {
            try {
                await TransactionService.createTransaction({
                    car_id: currentCar.id,
                    customer_name: name,
                    customer_email: email,
                    customer_phone: phone,
                    amount: currentCar.price,
                    payment_reference: response.reference,
                    payment_status: 'Success'
                });

                showNotification('Payment successful! We will contact you shortly.');
                setTimeout(() => {
                    const message = `Payment completed for ${currentCar.brand} ${currentCar.model}. Reference: ${response.reference}`;
                    const whatsappUrl = `https://wa.me/2347076470444?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                }, 2000);
            } catch (error) {
                console.error('Error recording transaction:', error);
                showNotification('Payment processed, but there was an error recording it. Please contact us.', 'error');
            }
        }
    });

    handler.openIframe();
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
            showNotification('Your inquiry has been submitted successfully! We will contact you soon.');
            form.reset();
        } catch (error) {
            console.error('Error submitting inquiry:', error);
            showNotification('Unable to submit inquiry. Please try again or contact us directly.', 'error');
        }
    });
}
