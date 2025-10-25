# Image Management Guide

This guide explains how to manage images for Manchy Automobile website.

## Folder Structure

```
public/images/
├── Background-Slideshow(1).jpeg  # Homepage hero backgrounds
├── Background-Slideshow(2).jpeg
├── Background-Slideshow(3).jpeg
├── Background-Slideshow(4).jpeg
├── Manchy-Logo2962.PNG           # Company logo
├── car-inventory/                # Car photos folder
│   ├── README.md
│   └── [car images go here]
└── staff-photos/                 # Staff photos folder
    ├── README.md
    └── [staff photos go here]
```

## How to Add Car Images

### Step 1: Prepare Your Images
- Take high-quality photos of the vehicle (front, side, rear, interior)
- Resize to recommended 1200x800 pixels
- Save as JPG format
- Name using format: `brand-model-year-number.jpg`

### Step 2: Upload to Folder
Place all images in: `public/images/car-inventory/`

Example:
```
public/images/car-inventory/
├── toyota-camry-2022-1.jpg
├── toyota-camry-2022-2.jpg
├── toyota-camry-2022-3.jpg
├── mercedes-eclass-2021-1.jpg
└── mercedes-eclass-2021-2.jpg
```

### Step 3: Update Database
Update the car record in Supabase with the image paths:

```sql
UPDATE cars
SET images = '[
  "images/car-inventory/toyota-camry-2022-1.jpg",
  "images/car-inventory/toyota-camry-2022-2.jpg",
  "images/car-inventory/toyota-camry-2022-3.jpg"
]'::jsonb
WHERE brand = 'Toyota' AND model = 'Camry' AND year = 2022;
```

Or use the Supabase dashboard to edit the `images` field directly.

## How to Add Staff Photos

### Step 1: Prepare Photos
- Take professional headshots
- Resize to recommended 800x800 pixels
- Save as JPG format
- Name using format: `firstname-lastname.jpg`

### Step 2: Upload to Folder
Place photos in: `public/images/staff-photos/`

Example:
```
public/images/staff-photos/
├── emmanuel-adeyemi.jpg
├── adebayo-ogunleye.jpg
├── funmilayo-adeleke.jpg
├── chioma-okafor.jpg
└── blessing-adekunle.jpg
```

### Step 3: Update Database
Update the staff record in Supabase:

```sql
UPDATE staff
SET photo_url = 'images/staff-photos/emmanuel-adeyemi.jpg'
WHERE name = 'Emmanuel Adeyemi';
```

## Quick Reference: Current Staff Members

1. Emmanuel Adeyemi - CEO → `emmanuel-adeyemi.jpg`
2. Adebayo Ogunleye - Operations Manager → `adebayo-ogunleye.jpg`
3. Funmilayo Adeleke - Sales Manager → `funmilayo-adeleke.jpg`
4. Chioma Okafor - Accountant → `chioma-okafor.jpg`
5. Blessing Adekunle - PA to CEO → `blessing-adekunle.jpg`

## Bulk Update Script (SQL)

To update all staff photos at once:

```sql
-- Update all staff photos
UPDATE staff SET photo_url = 'images/staff-photos/emmanuel-adeyemi.jpg' WHERE name = 'Emmanuel Adeyemi';
UPDATE staff SET photo_url = 'images/staff-photos/adebayo-ogunleye.jpg' WHERE name = 'Adebayo Ogunleye';
UPDATE staff SET photo_url = 'images/staff-photos/funmilayo-adeleke.jpg' WHERE name = 'Funmilayo Adeleke';
UPDATE staff SET photo_url = 'images/staff-photos/chioma-okafor.jpg' WHERE name = 'Chioma Okafor';
UPDATE staff SET photo_url = 'images/staff-photos/blessing-adekunle.jpg' WHERE name = 'Blessing Adekunle';
```

## Best Practices

### For Car Images:
- Use 3-5 images per vehicle
- Include: exterior front/side, interior, dashboard, engine bay
- Ensure good lighting
- Clean the vehicle before photographing
- Use consistent background when possible

### For Staff Photos:
- Professional attire
- Good lighting
- Neutral background
- Clear face visibility
- Consistent photo style across all staff

## Accessing Supabase Dashboard

1. Go to: https://supabase.com
2. Sign in to your account
3. Select your project: Manchy Automobile
4. Navigate to Table Editor
5. Select `cars` or `staff` table
6. Edit the `images` or `photo_url` fields

## Support

For questions about image management, contact your web developer or refer to the project documentation.
