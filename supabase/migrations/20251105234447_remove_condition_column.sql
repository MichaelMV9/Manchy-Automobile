/*
  # Remove condition column from cars table

  1. Changes
    - Drop the `condition` column from `cars` table
    - This column is no longer needed as per business requirements
  
  2. Notes
    - Data in the condition column will be permanently removed
    - This is a destructive operation but matches the requirement to remove all condition references
*/

ALTER TABLE cars DROP COLUMN IF EXISTS condition;