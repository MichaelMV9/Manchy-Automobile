/*
  # Clean Up Old Permissive Policies
  
  Remove remaining bad policies that allow unrestricted access
*/

-- Remove old permissive view policy on cars
DROP POLICY IF EXISTS "Anyone can view all cars" ON public.cars;

-- Remove old permissive view policy on staff
DROP POLICY IF EXISTS "Anyone can view staff" ON public.staff;

-- Ensure transactions UPDATE policy is not too permissive
DROP POLICY IF EXISTS "Authenticated users can update transactions" ON public.transactions;

CREATE POLICY "Authenticated users can update transactions"
  ON public.transactions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (payment_status IN ('Pending', 'Completed', 'Failed'));
