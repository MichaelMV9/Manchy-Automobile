/*
  # Fix Security Issues
  
  1. Remove Unused Indexes:
    - idx_cars_brand
    - idx_cars_status
    - idx_cars_is_featured
    - idx_inquiries_car_id
    - idx_transactions_car_id
    - idx_staff_display_order
  
  2. Fix Function Security:
    - Update update_updated_at_column function with secure search_path
  
  ## Security Improvements
  - Removed unused indexes to reduce maintenance overhead
  - Secured function search_path to prevent malicious schema injection
  
  ## Notes
  - Indexes can be re-added if query patterns change and they become necessary
  - Function search_path now immutable and explicitly set to prevent attacks
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_cars_brand;
DROP INDEX IF EXISTS idx_cars_status;
DROP INDEX IF EXISTS idx_cars_is_featured;
DROP INDEX IF EXISTS idx_inquiries_car_id;
DROP INDEX IF EXISTS idx_transactions_car_id;
DROP INDEX IF EXISTS idx_staff_display_order;

-- Drop trigger first, then function
DROP TRIGGER IF EXISTS update_cars_updated_at ON cars;
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Recreate the update_updated_at_column function with secure search_path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = pg_catalog, public
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER update_cars_updated_at
    BEFORE UPDATE ON cars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();