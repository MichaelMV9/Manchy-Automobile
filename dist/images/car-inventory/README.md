# Car Inventory Images

Place car images in this folder for easy management.

## Naming Convention

Use the following naming format for consistency:
- `brand-model-year-1.jpg` (main image)
- `brand-model-year-2.jpg` (additional images)
- `brand-model-year-3.jpg` (more views)

Examples:
- `toyota-camry-2022-1.jpg`
- `toyota-camry-2022-2.jpg`
- `honda-accord-2023-1.jpg`

## Image Requirements

- **Format**: JPG, PNG, or WebP
- **Recommended Size**: 1200x800 pixels (landscape)
- **Max File Size**: 2MB per image
- **Quality**: High resolution for best display

## Usage

After adding images to this folder, update the car record in the database with the image paths:

```javascript
images: [
  "images/car-inventory/toyota-camry-2022-1.jpg",
  "images/car-inventory/toyota-camry-2022-2.jpg",
  "images/car-inventory/toyota-camry-2022-3.jpg"
]
```

## Current Inventory

The system currently uses Pexels placeholder images. Replace these with actual vehicle photos by:
1. Taking high-quality photos of your vehicles
2. Saving them in this folder with proper naming
3. Updating the database image paths to point to these files
