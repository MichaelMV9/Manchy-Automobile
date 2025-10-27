/*
  # Fix Database Insert Issues
  
  ## Changes Made
  
  1. **Cars Table**
     - Fixed INSERT policy to allow proper data insertion
     - Ensure ID is auto-generated correctly
     - Remove any restrictive checks
  
  2. **Staff Table**
     - Fixed INSERT policy for staff members
     - Proper permissions for authenticated users
  
  3. **Inquiries Table**
     - Fixed INSERT policy to allow anonymous submissions
     - Remove invalid input restrictions
  
  4. **Transactions Table**
     - Fixed INSERT policy for transactions
     - Proper data validation
  
  ## Security Updates
  
  - All INSERT policies now properly allow data insertion
  - IDs are auto-generated and should not be provided by clients
  - Proper validation without blocking legitimate inserts
*/

-- Drop existing restrictive policies and recreate them properly
DROP POLICY IF EXISTS "Authenticated users can insert cars" ON cars;
DROP POLICY IF EXISTS "Authenticated users can manage staff" ON staff;
DROP POLICY IF EXISTS "Anyone can submit inquiries" ON inquiries;
DROP POLICY IF EXISTS "Anyone can create transactions" ON transactions;

-- Cars: Allow authenticated users to insert cars without ID
CREATE POLICY "Authenticated users can insert cars"
  ON cars
  FOR INSERT
  TO authenticated
  WITH CHECK (
    brand IS NOT NULL AND
    model IS NOT NULL AND
    year IS NOT NULL AND
    price IS NOT NULL
  );

-- Staff: Allow authenticated users to insert staff
CREATE POLICY "Authenticated users can insert staff"
  ON staff
  FOR INSERT
  TO authenticated
  WITH CHECK (
    name IS NOT NULL AND
    role IS NOT NULL AND
    email IS NOT NULL
  );

-- Inquiries: Allow anyone to submit inquiries
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    customer_name IS NOT NULL AND
    customer_email IS NOT NULL AND
    message IS NOT NULL
  );

-- Transactions: Allow anyone to create transactions
CREATE POLICY "Anyone can create transactions"
  ON transactions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    customer_name IS NOT NULL AND
    customer_email IS NOT NULL AND
    amount IS NOT NULL
  );

-- Ensure all tables have proper default values for IDs
-- (Already set, but verifying)
ALTER TABLE cars ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE staff ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE inquiries ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE transactions ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Add helpful comments
COMMENT ON COLUMN cars.id IS 'Auto-generated UUID - do not provide when inserting';
COMMENT ON COLUMN staff.id IS 'Auto-generated UUID - do not provide when inserting';
COMMENT ON COLUMN inquiries.id IS 'Auto-generated UUID - do not provide when inserting';
COMMENT ON COLUMN transactions.id IS 'Auto-generated UUID - do not provide when inserting';
