/*
  # Add condition column back to cars table

  1. Changes
    - Add `condition` column to `cars` table with TEXT data type
    - Column will store either 'New' or 'Foreign Used' values
  
  2. Notes
    - This restores the condition column that was previously removed
    - Data will be populated in subsequent updates
*/

ALTER TABLE cars ADD COLUMN IF NOT EXISTS condition TEXT;