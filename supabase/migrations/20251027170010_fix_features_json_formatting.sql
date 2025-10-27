/*
  # Fix Features JSON Formatting
  
  ## Purpose
  Ensure all features fields are properly formatted as JSON arrays and provide
  helper functions for future updates.
  
  ## Changes
  
  1. **Verify JSON Format**
     - Check all features columns are valid JSONB arrays
     - Fix any improperly formatted data
  
  2. **Create Helper Function**
     - Function to convert comma-separated strings to JSON arrays
     - Makes it easier to update features in the future
  
  3. **Add Update Trigger**
     - Automatically update updated_at timestamp
     - Ensure data integrity
  
  4. **Documentation**
     - Add comments explaining proper usage
*/

-- Create a helper function to convert comma-separated strings to JSON array
CREATE OR REPLACE FUNCTION string_to_json_array(input_string TEXT)
RETURNS JSONB AS $$
DECLARE
    features_array TEXT[];
    result JSONB;
BEGIN
    -- If input is already valid JSON, return it
    BEGIN
        result := input_string::JSONB;
        IF jsonb_typeof(result) = 'array' THEN
            RETURN result;
        END IF;
    EXCEPTION WHEN OTHERS THEN
        -- Not valid JSON, continue to convert
    END;
    
    -- Split comma-separated string into array
    features_array := string_to_array(input_string, ',');
    
    -- Trim whitespace from each element and convert to JSON array
    result := to_jsonb(array(SELECT trim(unnest(features_array))));
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Ensure all existing features are properly formatted as JSON arrays
UPDATE cars
SET features = CASE 
    WHEN features IS NULL THEN '[]'::JSONB
    WHEN jsonb_typeof(features) != 'array' THEN '[]'::JSONB
    ELSE features
END
WHERE features IS NULL OR jsonb_typeof(features) != 'array';

-- Similarly for images - ensure it's a JSON array
UPDATE cars
SET images = CASE 
    WHEN images IS NULL THEN '[]'::JSONB
    WHEN jsonb_typeof(images) != 'array' THEN 
        CASE 
            WHEN images::TEXT LIKE 'http%' THEN to_jsonb(ARRAY[images::TEXT])
            ELSE '[]'::JSONB
        END
    ELSE images
END
WHERE images IS NULL OR jsonb_typeof(images) != 'array';

-- Create or replace trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to cars table if it doesn't exist
DROP TRIGGER IF EXISTS update_cars_updated_at ON cars;
CREATE TRIGGER update_cars_updated_at
    BEFORE UPDATE ON cars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add helpful comments
COMMENT ON COLUMN cars.features IS 'JSONB array of car features. Use string_to_json_array() function to convert comma-separated strings. Example: ["Leather Seats", "Sunroof", "Bluetooth"]';
COMMENT ON COLUMN cars.images IS 'JSONB array of image URLs. Example: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]';
COMMENT ON FUNCTION string_to_json_array(TEXT) IS 'Converts comma-separated string to JSONB array. Usage: UPDATE cars SET features = string_to_json_array(''Feature1,Feature2,Feature3'')';

-- Verify all IDs have proper default (already confirmed, but double-checking)
ALTER TABLE cars ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE cars ALTER COLUMN created_at SET DEFAULT NOW();
ALTER TABLE cars ALTER COLUMN updated_at SET DEFAULT NOW();
