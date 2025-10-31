/*
  # Fix Database Security Issues

  ## Changes
  
  ### 1. Remove Unused Indexes
    - Drop `idx_cars_brand` - not being used by queries
    - Drop `idx_cars_is_featured` - not being used by queries
  
  ### 2. Fix Function Search Path Security
    - Recreate `string_to_json_array` function with immutable search_path
    - Recreate `update_updated_at_column` function with immutable search_path
    - This prevents security vulnerabilities from role mutable search paths
  
  ## Security Impact
    - Removes unused indexes (reduces maintenance overhead)
    - Hardens functions against search_path manipulation attacks
    - Functions now use explicit schema references for security
*/

-- Drop unused indexes
DROP INDEX IF EXISTS idx_cars_brand;
DROP INDEX IF EXISTS idx_cars_is_featured;

-- Recreate string_to_json_array function with secure search_path
CREATE OR REPLACE FUNCTION public.string_to_json_array(input_string text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
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
$function$;

-- Recreate update_updated_at_column function with secure search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;