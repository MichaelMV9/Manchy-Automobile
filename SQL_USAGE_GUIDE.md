# SQL Usage Guide - Proper JSON Formatting for Cars Table

## ✅ IDs Are Auto-Generated

**IMPORTANT**: Never provide an ID when inserting new records. The database automatically generates UUIDs for all new rows.

```sql
-- ✅ CORRECT - No ID provided
INSERT INTO cars (brand, model, year, price, features, images)
VALUES ('Toyota', 'Camry', 2023, 15000000,
    '["Leather Seats", "Sunroof", "Bluetooth"]'::JSONB,
    '["https://example.com/image1.jpg"]'::JSONB);

-- ❌ WRONG - Don't provide ID
INSERT INTO cars (id, brand, model, year, price)
VALUES ('some-uuid-here', 'Toyota', 'Camry', 2023, 15000000);
```

## Proper JSON Formatting for Features Field

### ✅ CORRECT Methods

#### Method 1: Direct JSON Array String
```sql
UPDATE cars
SET
    year = 2019,
    price = 35000000,
    features = '["Magnetic Ride Control", "Rear Entertainment", "Bose Audio", "Adaptive Cruise", "Power Running Boards"]'::JSONB,
    images = '["https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg"]'::JSONB
WHERE id = '73e3f1b3-f360-4661-be4c-629fedff973d';
```

#### Method 2: Using Helper Function (for comma-separated strings)
```sql
UPDATE cars
SET
    year = 2019,
    price = 35000000,
    features = string_to_json_array('Magnetic Ride Control,Rear Entertainment,Bose Audio,Adaptive Cruise,Power Running Boards'),
    images = '["https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg"]'::JSONB
WHERE id = '73e3f1b3-f360-4661-be4c-629fedff973d';
```

#### Method 3: Building JSON Array Programmatically
```sql
UPDATE cars
SET
    year = 2019,
    price = 35000000,
    features = jsonb_build_array(
        'Magnetic Ride Control',
        'Rear Entertainment',
        'Bose Audio',
        'Adaptive Cruise',
        'Power Running Boards'
    ),
    images = jsonb_build_array('https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg')
WHERE id = '73e3f1b3-f360-4661-be4c-629fedff973d';
```

### ❌ INCORRECT - This Will Cause Errors

```sql
-- ❌ WRONG - Plain string instead of JSON array
UPDATE cars
SET features = 'Magnetic Ride Control,Rear Entertainment,Bose Audio'
WHERE id = '73e3f1b3-f360-4661-be4c-629fedff973d';

-- ❌ WRONG - Single string instead of array
UPDATE cars
SET features = '"Magnetic Ride Control"'
WHERE id = '73e3f1b3-f360-4661-be4c-629fedff973d';

-- ❌ WRONG - Not properly escaped
UPDATE cars
SET features = '[Magnetic Ride Control, Rear Entertainment]'
WHERE id = '73e3f1b3-f360-4661-be4c-629fedff973d';
```

## Inserting New Cars with Features

### ✅ CORRECT - Insert with JSON Arrays

```sql
-- Method 1: Direct JSON string with ::JSONB cast
INSERT INTO cars (
    brand,
    model,
    year,
    price,
    condition,
    transmission,
    fuel_type,
    features,
    images,
    is_featured,
    status
)
VALUES (
    'Chevrolet',
    'Tahoe',
    2019,
    35000000,
    'Used',
    'Automatic',
    'Petrol',
    '["Magnetic Ride Control", "Rear Entertainment", "Bose Audio", "Adaptive Cruise", "Power Running Boards"]'::JSONB,
    '["https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg"]'::JSONB,
    true,
    'Available'
);

-- Method 2: Using helper function
INSERT INTO cars (brand, model, year, price, features, images)
VALUES (
    'Chevrolet',
    'Tahoe',
    2019,
    35000000,
    string_to_json_array('Magnetic Ride Control,Rear Entertainment,Bose Audio,Adaptive Cruise,Power Running Boards'),
    string_to_json_array('https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg')
);

-- Method 3: Using jsonb_build_array
INSERT INTO cars (brand, model, year, price, features, images)
VALUES (
    'Chevrolet',
    'Tahoe',
    2019,
    35000000,
    jsonb_build_array('Magnetic Ride Control', 'Rear Entertainment', 'Bose Audio', 'Adaptive Cruise', 'Power Running Boards'),
    jsonb_build_array('https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg')
);
```

## Bulk Update Example

### Update All Cars to Ensure Proper JSON Format

```sql
-- Convert any malformed features to proper JSON arrays
UPDATE cars
SET features = string_to_json_array(features::TEXT)
WHERE jsonb_typeof(features) != 'array';

-- Add a new feature to all cars
UPDATE cars
SET features = features || '["New Feature"]'::JSONB
WHERE NOT features ? 'New Feature';

-- Remove a feature from all cars
UPDATE cars
SET features = features - 'Old Feature';
```

## Querying Features

### Search for Cars with Specific Features

```sql
-- Find cars with a specific feature
SELECT id, brand, model, features
FROM cars
WHERE features ? 'Leather Seats';

-- Find cars with ANY of these features
SELECT id, brand, model, features
FROM cars
WHERE features ?| array['Sunroof', 'Leather Seats', 'Navigation System'];

-- Find cars with ALL of these features
SELECT id, brand, model, features
FROM cars
WHERE features ?& array['Leather Seats', 'Sunroof'];

-- Count cars by feature
SELECT
    feature,
    COUNT(*) as car_count
FROM cars,
    jsonb_array_elements_text(features) as feature
GROUP BY feature
ORDER BY car_count DESC;
```

## Adding/Removing Features

### Add a Feature to Existing Array

```sql
-- Add one feature
UPDATE cars
SET features = features || '["Parking Sensors"]'::JSONB
WHERE id = '73e3f1b3-f360-4661-be4c-629fedff973d';

-- Add multiple features
UPDATE cars
SET features = features || '["Parking Sensors", "Lane Assist"]'::JSONB
WHERE id = '73e3f1b3-f360-4661-be4c-629fedff973d';
```

### Remove a Feature

```sql
-- Remove specific feature
UPDATE cars
SET features = features - 'Old Feature'
WHERE id = '73e3f1b3-f360-4661-be4c-629fedff973d';
```

### Replace All Features

```sql
UPDATE cars
SET features = '["New Feature 1", "New Feature 2", "New Feature 3"]'::JSONB
WHERE id = '73e3f1b3-f360-4661-be4c-629fedff973d';
```

## Images Field - Same Rules Apply

The `images` field follows the same JSON array format:

```sql
-- ✅ CORRECT - Array of image URLs
UPDATE cars
SET images = '["https://example.com/image1.jpg", "https://example.com/image2.jpg", "https://example.com/image3.jpg"]'::JSONB
WHERE id = '73e3f1b3-f360-4661-be4c-629fedff973d';

-- Add an image to existing array
UPDATE cars
SET images = images || '["https://example.com/new-image.jpg"]'::JSONB
WHERE id = '73e3f1b3-f360-4661-be4c-629fedff973d';

-- ❌ WRONG - Single string instead of array
UPDATE cars
SET images = 'https://example.com/image1.jpg'
WHERE id = '73e3f1b3-f360-4661-be4c-629fedff973d';
```

## Helper Function: string_to_json_array()

A custom function has been created to make it easier to convert comma-separated strings to JSON arrays:

```sql
-- Usage
SELECT string_to_json_array('Feature 1,Feature 2,Feature 3');
-- Result: ["Feature 1", "Feature 2", "Feature 3"]

-- In UPDATE statement
UPDATE cars
SET features = string_to_json_array('Leather Seats,Sunroof,Navigation')
WHERE id = 'some-id';
```

## Validating JSON Format

### Check if Features are Valid JSON Arrays

```sql
-- Find records with invalid features format
SELECT id, brand, model, features, jsonb_typeof(features) as type
FROM cars
WHERE jsonb_typeof(features) != 'array';

-- Fix all invalid formats
UPDATE cars
SET features = '[]'::JSONB
WHERE jsonb_typeof(features) != 'array';
```

## Common Errors and Solutions

### Error: "invalid input syntax for type json"

**Cause**: Trying to insert a plain string instead of JSON array

**Solution**:
```sql
-- Instead of:
features = 'Feature 1, Feature 2'

-- Use:
features = '["Feature 1", "Feature 2"]'::JSONB
-- OR
features = string_to_json_array('Feature 1,Feature 2')
```

### Error: "column features is of type jsonb but expression is of type text"

**Cause**: Missing `::JSONB` cast

**Solution**:
```sql
-- Add ::JSONB cast
features = '["Feature 1", "Feature 2"]'::JSONB
```

## Best Practices

1. ✅ **Always use JSON arrays** for features and images
2. ✅ **Use `::JSONB` cast** when inserting string literals
3. ✅ **Never provide ID** when inserting - it's auto-generated
4. ✅ **Use helper function** for comma-separated strings
5. ✅ **Validate JSON format** before large updates
6. ✅ **Use double quotes** for JSON strings, not single quotes inside arrays
7. ✅ **Test queries** on a single record before bulk updates

## JavaScript/Application Usage

When using the Supabase client in JavaScript:

```javascript
// ✅ CORRECT - Pass JavaScript array
const newCar = await CarService.createCar({
    brand: "Chevrolet",
    model: "Tahoe",
    year: 2019,
    price: 35000000,
    features: [
        "Magnetic Ride Control",
        "Rear Entertainment",
        "Bose Audio",
        "Adaptive Cruise",
        "Power Running Boards"
    ],
    images: [
        "https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg"
    ]
});

// ❌ WRONG - Don't pass comma-separated string
const newCar = await CarService.createCar({
    features: "Magnetic Ride Control,Rear Entertainment,Bose Audio"
});
```

## Summary

- **IDs**: Auto-generated, never provide manually
- **Features**: JSONB array format `["Feature 1", "Feature 2"]`
- **Images**: JSONB array format `["url1", "url2"]`
- **Helper**: Use `string_to_json_array()` for comma-separated strings
- **Cast**: Always add `::JSONB` when using string literals in SQL
- **Validation**: Features and images must be valid JSON arrays
