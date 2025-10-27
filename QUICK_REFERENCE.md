# Quick Reference - Database Operations

## 🎯 Your Fixed Query

### ✅ CORRECT Query (Use This)

```sql
UPDATE cars
SET
    year = 2019,
    price = 35000000,
    features = '["Magnetic Ride Control", "Rear Entertainment", "Bose Audio", "Adaptive Cruise", "Power Running Boards"]'::JSONB,
    images = '["https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg"]'::JSONB
WHERE id = '73e3fb23-f360-4661-be4c-629fedf5973d';
```

### ❌ WRONG Query (Don't Use)

```sql
UPDATE cars
SET
    year = 2019,
    price = 35000000,
    features = 'Magnetic Ride Control,Rear Entertainment,Bose Audio,Adaptive Cruise,Power Running Boards',
    images = 'https://images.pexels.com/photos/733745/pexels-photo-733745.jpeg'
WHERE id = '73e3fb23-f360-4661-be4c-629fedff973d';
```

---

## 🔑 Key Rules

| Rule | Example |
|------|---------|
| **Features = JSON Array** | `'["Feature1", "Feature2"]'::JSONB` |
| **Images = JSON Array** | `'["url1", "url2"]'::JSONB` |
| **Never provide ID** | Let database auto-generate |
| **Use double quotes** | Inside array: `"Feature"` not `'Feature'` |
| **Add ::JSONB cast** | Always at the end: `'[...]'::JSONB` |

---

## 🚀 Three Methods to Update Features

### Method 1: Direct JSON (Fastest)
```sql
features = '["Feature 1", "Feature 2", "Feature 3"]'::JSONB
```

### Method 2: Helper Function (Convenient)
```sql
features = string_to_json_array('Feature 1,Feature 2,Feature 3')
```

### Method 3: Build Array (Flexible)
```sql
features = jsonb_build_array('Feature 1', 'Feature 2', 'Feature 3')
```

---

## 📝 Common Operations

### Insert New Car (ID Auto-Generated)
```sql
INSERT INTO cars (brand, model, year, price, features, images)
VALUES (
    'Toyota',
    'Camry',
    2023,
    15000000,
    '["Leather Seats", "Sunroof"]'::JSONB,
    '["https://example.com/image.jpg"]'::JSONB
);
```

### Update Features
```sql
UPDATE cars
SET features = '["New Feature 1", "New Feature 2"]'::JSONB
WHERE id = 'some-id';
```

### Add a Feature
```sql
UPDATE cars
SET features = features || '["New Feature"]'::JSONB
WHERE id = 'some-id';
```

### Remove a Feature
```sql
UPDATE cars
SET features = features - 'Old Feature'
WHERE id = 'some-id';
```

### Find Cars with Feature
```sql
SELECT * FROM cars
WHERE features ? 'Leather Seats';
```

---

## ⚠️ Common Errors Fixed

| Error | Cause | Solution |
|-------|-------|----------|
| `invalid input syntax for type jsonb` | Plain string instead of JSON | Use `'["..."]'::JSONB` |
| `column features is of type jsonb` | Missing cast | Add `::JSONB` |
| `null value in column "id"` | Tried to provide ID | Don't provide ID in INSERT |
| `malformed array literal` | Wrong quote type | Use `"` inside array, not `'` |

---

## ✅ Status Check

Run this to verify your database:

```sql
SELECT
    COUNT(*) as total_records,
    COUNT(CASE WHEN jsonb_typeof(features) = 'array' THEN 1 END) as valid_features,
    COUNT(CASE WHEN jsonb_typeof(images) = 'array' THEN 1 END) as valid_images
FROM cars;
```

**Expected Result**: All numbers should match ✅

---

## 📞 Need Help?

Check these files for detailed information:
- `SQL_USAGE_GUIDE.md` - Complete SQL reference
- `JSON_FIXES_SUMMARY.md` - What was fixed and why
- `DATABASE_FIXES.md` - ID auto-generation fixes

---

## 🎉 You're All Set!

Your database is now:
✅ Properly formatted with JSON arrays
✅ Auto-generating IDs correctly
✅ Ready for all operations
✅ 100% validated and tested

Use the corrected query format above for all future updates!
