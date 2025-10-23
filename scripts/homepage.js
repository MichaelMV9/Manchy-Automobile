let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

setInterval(nextSlide, 5000);

document.addEventListener('DOMContentLoaded', async function() {
    await loadFeaturedCars();
    await loadBrandsForSearch();
    setupQuickSearch();
});

async function loadFeaturedCars() {
    const featuredGrid = document.getElementById('featuredCarsGrid');
    showLoading(featuredGrid, 'Loading featured vehicles...');

    try {
        const cars = await CarService.getFeaturedCars(6);

        if (cars.length === 0) {
            const allCars = await CarService.getAllCars();
            const featured = allCars.slice(0, 6);
            displayCars(featured, featuredGrid);
        } else {
            displayCars(cars, featuredGrid);
        }
    } catch (error) {
        console.error('Error loading featured cars:', error);
        showError(featuredGrid, 'Unable to load featured vehicles. Please try again later.');
    }
}

function displayCars(cars, container) {
    container.innerHTML = '';

    if (cars.length === 0) {
        container.innerHTML = '<div class="loading">No vehicles available at the moment.</div>';
        return;
    }

    cars.forEach(car => {
        const carCard = createCarCard(car);
        container.appendChild(carCard);
    });
}

async function loadBrandsForSearch() {
    const brandSelect = document.getElementById('searchBrand');

    try {
        const brands = await CarService.getUniqueBrands();

        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading brands:', error);
    }
}

function setupQuickSearch() {
    const searchForm = document.getElementById('quickSearchForm');

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const brand = document.getElementById('searchBrand').value;
        const condition = document.getElementById('searchCondition').value;
        const priceRange = document.getElementById('searchPrice').value;

        const params = new URLSearchParams();
        if (brand) params.append('brand', brand);
        if (condition) params.append('condition', condition);
        if (priceRange) params.append('price', priceRange);

        window.location.href = `cars.html?${params.toString()}`;
    });
}
