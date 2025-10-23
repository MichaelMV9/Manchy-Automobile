let allCars = [];
let filteredCars = [];

document.addEventListener('DOMContentLoaded', async function() {
    await initializePage();
    setupEventListeners();
});

async function initializePage() {
    await loadAllCars();
    await populateFilterDropdowns();
    applyUrlFilters();
}

function setupEventListeners() {
    document.getElementById('filtersForm').addEventListener('submit', handleFilterSubmit);
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    document.getElementById('sortBy').addEventListener('change', handleSort);
}

async function loadAllCars() {
    const carsGrid = document.getElementById('carsGrid');
    showLoading(carsGrid, 'Loading vehicles...');

    try {
        allCars = await CarService.getAllCars();
        filteredCars = [...allCars];
        displayCars(filteredCars);
        updateResultsCount();
    } catch (error) {
        console.error('Error loading cars:', error);
        showError(carsGrid, 'Unable to load vehicles. Please try again later.');
    }
}

async function populateFilterDropdowns() {
    try {
        const brands = await CarService.getUniqueBrands();
        const brandSelect = document.getElementById('filterBrand');

        brands.forEach(brand => {
            const option = document.createElement('option');
            option.value = brand;
            option.textContent = brand;
            brandSelect.appendChild(option);
        });

        const years = [...new Set(allCars.map(car => car.year))].sort((a, b) => b - a);
        const yearSelect = document.getElementById('filterYear');

        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            yearSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error populating filters:', error);
    }
}

function applyUrlFilters() {
    const urlParams = new URLSearchParams(window.location.search);

    const brand = urlParams.get('brand');
    const condition = urlParams.get('condition');
    const price = urlParams.get('price');

    if (brand) document.getElementById('filterBrand').value = brand;
    if (condition) document.getElementById('filterCondition').value = condition;
    if (price) document.getElementById('filterPrice').value = price;

    if (brand || condition || price) {
        applyFilters();
    }
}

function handleFilterSubmit(e) {
    e.preventDefault();
    applyFilters();
}

function applyFilters() {
    const brand = document.getElementById('filterBrand').value;
    const condition = document.getElementById('filterCondition').value;
    const transmission = document.getElementById('filterTransmission').value;
    const year = document.getElementById('filterYear').value;
    const priceRange = document.getElementById('filterPrice').value;

    filteredCars = allCars.filter(car => {
        if (brand && car.brand !== brand) return false;
        if (condition && car.condition !== condition) return false;
        if (transmission && car.transmission !== transmission) return false;
        if (year && car.year.toString() !== year) return false;

        if (priceRange) {
            const [minPrice, maxPrice] = priceRange.split('-').map(Number);
            if (car.price < minPrice || car.price > maxPrice) return false;
        }

        return true;
    });

    displayCars(filteredCars);
    updateResultsCount();
}

function resetFilters() {
    document.getElementById('filtersForm').reset();
    filteredCars = [...allCars];
    displayCars(filteredCars);
    updateResultsCount();
    window.history.replaceState({}, '', 'cars.html');
}

function handleSort() {
    const sortBy = document.getElementById('sortBy').value;

    switch (sortBy) {
        case 'newest':
            filteredCars.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'price-low':
            filteredCars.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredCars.sort((a, b) => b.price - a.price);
            break;
        case 'year-new':
            filteredCars.sort((a, b) => b.year - a.year);
            break;
        case 'year-old':
            filteredCars.sort((a, b) => a.year - b.year);
            break;
    }

    displayCars(filteredCars);
}

function displayCars(cars) {
    const carsGrid = document.getElementById('carsGrid');
    carsGrid.innerHTML = '';

    if (cars.length === 0) {
        carsGrid.innerHTML = '<div class="loading">No vehicles match your criteria. Please adjust your filters.</div>';
        return;
    }

    cars.forEach(car => {
        const carCard = createCarCard(car);
        carsGrid.appendChild(carCard);
    });
}

function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    const count = filteredCars.length;
    const total = allCars.length;

    resultsCount.textContent = `Showing ${count} of ${total} vehicle${total !== 1 ? 's' : ''}`;
}
