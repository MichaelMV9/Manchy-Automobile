/*
  # Remove Features Field and Simplify Car Table for Easy Editing
  
  ## Purpose
  Make the cars table as easily editable as the staff table, with instant updates
  to the website without any validation errors.
  
  ## Changes
  
  1. **Remove Features Column**
     - Drop the features column from cars table
  
  2. **Simplify RLS Policies**
     - Make INSERT and UPDATE policies permissive like staff table
     - Allow anyone (anon + authenticated) to manage cars
     - Remove restrictive validation checks
  
  3. **Ensure Instant Updates**
     - Optimize for real-time editing
     - Remove barriers to data entry
     - Make it work exactly like staff table
*/

-- Drop the features column
ALTER TABLE cars DROP COLUMN features;

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Authenticated users can insert cars" ON cars;
DROP POLICY IF EXISTS "Authenticated users can update cars" ON cars;
DROP POLICY IF EXISTS "Anyone can view available cars" ON cars;

-- Create simple, permissive policies like staff table

-- Allow everyone to view all cars (not just available ones)
CREATE POLICY "Anyone can view all cars"
  ON cars
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow anyone to insert cars (like staff table)
CREATE POLICY "Anyone can insert cars"
  ON cars
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to update cars (like staff table)
CREATE POLICY "Anyone can update cars"
  ON cars
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete cars (like staff table)
CREATE POLICY "Anyone can delete cars"
  ON cars
  FOR DELETE
  TO anon, authenticated
  USING (true);

-- Ensure all required fields have sensible defaults
ALTER TABLE cars ALTER COLUMN condition SET DEFAULT 'Used';
ALTER TABLE cars ALTER COLUMN transmission SET DEFAULT 'Automatic';
ALTER TABLE cars ALTER COLUMN fuel_type SET DEFAULT 'Petrol';
ALTER TABLE cars ALTER COLUMN status SET DEFAULT 'Available';
ALTER TABLE cars ALTER COLUMN is_featured SET DEFAULT false;
ALTER TABLE cars ALTER COLUMN mileage SET DEFAULT 0;

-- Make non-essential fields nullable
ALTER TABLE cars ALTER COLUMN mileage DROP NOT NULL;
ALTER TABLE cars ALTER COLUMN color DROP NOT NULL;
ALTER TABLE cars ALTER COLUMN description DROP NOT NULL;

-- Update table comment
COMMENT ON TABLE cars IS 'Simplified cars table for easy editing via Supabase dashboard. Changes apply instantly to website. Works just like staff table.';
