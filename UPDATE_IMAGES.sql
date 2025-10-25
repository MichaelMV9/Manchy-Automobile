-- =====================================================
-- IMAGE UPDATE SCRIPT FOR MANCHY AUTOMOBILE
-- =====================================================
-- This script helps you update car and staff images after
-- uploading them to the appropriate folders
-- =====================================================

-- =====================================================
-- STAFF PHOTOS UPDATE
-- =====================================================
-- After placing staff photos in: public/images/staff-photos/
-- Run these commands to update the database

UPDATE staff
SET photo_url = 'images/staff-photos/emmanuel-adeyemi.jpg'
WHERE name = 'Emmanuel Adeyemi';

UPDATE staff
SET photo_url = 'images/staff-photos/adebayo-ogunleye.jpg'
WHERE name = 'Adebayo Ogunleye';

UPDATE staff
SET photo_url = 'images/staff-photos/funmilayo-adeleke.jpg'
WHERE name = 'Funmilayo Adeleke';

UPDATE staff
SET photo_url = 'images/staff-photos/chioma-okafor.jpg'
WHERE name = 'Chioma Okafor';

UPDATE staff
SET photo_url = 'images/staff-photos/blessing-adekunle.jpg'
WHERE name = 'Blessing Adekunle';


-- =====================================================
-- CAR IMAGES UPDATE EXAMPLES
-- =====================================================
-- After placing car photos in: public/images/car-inventory/
-- Use these templates to update car images

-- Example 1: Toyota Camry 2022
UPDATE cars
SET images = '[
  "images/car-inventory/toyota-camry-2022-1.jpg",
  "images/car-inventory/toyota-camry-2022-2.jpg",
  "images/car-inventory/toyota-camry-2022-3.jpg",
  "images/car-inventory/toyota-camry-2022-4.jpg"
]'::jsonb
WHERE brand = 'Toyota' AND model = 'Camry' AND year = 2022;

-- Example 2: Honda Accord 2023
UPDATE cars
SET images = '[
  "images/car-inventory/honda-accord-2023-1.jpg",
  "images/car-inventory/honda-accord-2023-2.jpg",
  "images/car-inventory/honda-accord-2023-3.jpg"
]'::jsonb
WHERE brand = 'Honda' AND model = 'Accord' AND year = 2023;

-- Example 3: Mercedes-Benz E-Class 2021
UPDATE cars
SET images = '[
  "images/car-inventory/mercedes-eclass-2021-1.jpg",
  "images/car-inventory/mercedes-eclass-2021-2.jpg",
  "images/car-inventory/mercedes-eclass-2021-3.jpg",
  "images/car-inventory/mercedes-eclass-2021-4.jpg",
  "images/car-inventory/mercedes-eclass-2021-5.jpg"
]'::jsonb
WHERE brand = 'Mercedes-Benz' AND model = 'E-Class' AND year = 2021;

-- Example 4: BMW 5 Series 2022
UPDATE cars
SET images = '[
  "images/car-inventory/bmw-5series-2022-1.jpg",
  "images/car-inventory/bmw-5series-2022-2.jpg",
  "images/car-inventory/bmw-5series-2022-3.jpg",
  "images/car-inventory/bmw-5series-2022-4.jpg"
]'::jsonb
WHERE brand = 'BMW' AND model = '5 Series' AND year = 2022;

-- Example 5: Lexus RX 350 2023
UPDATE cars
SET images = '[
  "images/car-inventory/lexus-rx350-2023-1.jpg",
  "images/car-inventory/lexus-rx350-2023-2.jpg",
  "images/car-inventory/lexus-rx350-2023-3.jpg"
]'::jsonb
WHERE brand = 'Lexus' AND model = 'RX 350' AND year = 2023;

-- Example 6: Range Rover Sport 2021
UPDATE cars
SET images = '[
  "images/car-inventory/rangerover-sport-2021-1.jpg",
  "images/car-inventory/rangerover-sport-2021-2.jpg",
  "images/car-inventory/rangerover-sport-2021-3.jpg",
  "images/car-inventory/rangerover-sport-2021-4.jpg"
]'::jsonb
WHERE brand = 'Range Rover' AND model = 'Sport' AND year = 2021;


-- =====================================================
-- BULK UPDATE TEMPLATE
-- =====================================================
-- Copy and modify this template for each car in your inventory

/*
UPDATE cars
SET images = '[
  "images/car-inventory/BRAND-MODEL-YEAR-1.jpg",
  "images/car-inventory/BRAND-MODEL-YEAR-2.jpg",
  "images/car-inventory/BRAND-MODEL-YEAR-3.jpg"
]'::jsonb
WHERE brand = 'BRAND' AND model = 'MODEL' AND year = YEAR;
*/


-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Use these to check if updates were successful

-- Check all staff photos
SELECT name, role, photo_url FROM staff ORDER BY display_order;

-- Check all car images
SELECT brand, model, year, images FROM cars ORDER BY brand, model;

-- Count cars with images
SELECT
  COUNT(*) as total_cars,
  COUNT(*) FILTER (WHERE images IS NOT NULL AND jsonb_array_length(images) > 0) as cars_with_images
FROM cars;


-- =====================================================
-- NOTES
-- =====================================================
-- 1. Always use forward slashes (/) in paths, not backslashes (\)
-- 2. Image paths are relative to the public folder
-- 3. File names are case-sensitive on most servers
-- 4. Supported formats: .jpg, .jpeg, .png, .webp
-- 5. Test one image first before bulk updating
-- =====================================================
