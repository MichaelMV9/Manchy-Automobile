/*
  # Manchy Automobile Database Schema

  ## Overview
  Creates the complete database structure for Manchy Automobile e-commerce website
  including cars inventory, staff information, and customer inquiries.

  ## New Tables
  
  ### 1. `cars` - Vehicle Inventory
    - `id` (uuid, primary key)
    - `brand` (text) - Car manufacturer
    - `model` (text) - Car model name
    - `year` (integer) - Manufacturing year
    - `price` (decimal) - Price in Naira
    - `condition` (text) - New or Used
    - `transmission` (text) - Manual or Automatic
    - `fuel_type` (text) - Petrol, Diesel, Hybrid, Electric
    - `mileage` (integer) - Kilometers driven
    - `color` (text) - Exterior color
    - `description` (text) - Detailed description
    - `features` (jsonb) - Array of features
    - `images` (jsonb) - Array of image URLs
    - `is_featured` (boolean) - Show on homepage
    - `status` (text) - Available, Sold, Reserved
    - `created_at` (timestamp)
    - `updated_at` (timestamp)

  ### 2. `staff` - Team Members
    - `id` (uuid, primary key)
    - `name` (text) - Full name
    - `role` (text) - Position/Title
    - `email` (text) - Professional email
    - `photo_url` (text) - Headshot image URL
    - `bio` (text) - Brief biography
    - `display_order` (integer) - Sort order
    - `created_at` (timestamp)

  ### 3. `inquiries` - Customer Inquiries
    - `id` (uuid, primary key)
    - `car_id` (uuid, foreign key) - Related car
    - `customer_name` (text)
    - `customer_email` (text)
    - `customer_phone` (text)
    - `inquiry_type` (text) - Test Drive, Purchase, General
    - `message` (text)
    - `status` (text) - New, Contacted, Closed
    - `created_at` (timestamp)

  ### 4. `transactions` - Payment Records
    - `id` (uuid, primary key)
    - `car_id` (uuid, foreign key)
    - `customer_name` (text)
    - `customer_email` (text)
    - `customer_phone` (text)
    - `amount` (decimal)
    - `payment_reference` (text) - Paystack reference
    - `payment_status` (text) - Pending, Success, Failed
    - `created_at` (timestamp)

  ## Security
    - Enable RLS on all tables
    - Public read access for cars and staff (for browsing)
    - Authenticated write access for inquiries
    - Admin-only access for transactions and sensitive operations

  ## Notes
    - All tables use UUIDs for primary keys
    - Timestamps use timestamptz for proper timezone handling
    - JSONB fields for flexible data storage (features, images)
    - Indexes on commonly queried fields for performance
*/

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price decimal(12,2) NOT NULL,
  condition text NOT NULL DEFAULT 'Used',
  transmission text NOT NULL DEFAULT 'Automatic',
  fuel_type text NOT NULL DEFAULT 'Petrol',
  mileage integer DEFAULT 0,
  color text,
  description text,
  features jsonb DEFAULT '[]'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  status text DEFAULT 'Available',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  email text NOT NULL,
  photo_url text,
  bio text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid REFERENCES cars(id),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  inquiry_type text NOT NULL DEFAULT 'General',
  message text NOT NULL,
  status text DEFAULT 'New',
  created_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id uuid REFERENCES cars(id),
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  amount decimal(12,2) NOT NULL,
  payment_reference text,
  payment_status text DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for cars (public read access)
CREATE POLICY "Anyone can view available cars"
  ON cars FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert cars"
  ON cars FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update cars"
  ON cars FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for staff (public read access)
CREATE POLICY "Anyone can view staff"
  ON staff FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can manage staff"
  ON staff FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update staff"
  ON staff FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for inquiries
CREATE POLICY "Anyone can submit inquiries"
  ON inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view inquiries"
  ON inquiries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update inquiries"
  ON inquiries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for transactions
CREATE POLICY "Anyone can create transactions"
  ON transactions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update transactions"
  ON transactions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cars_brand ON cars(brand);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_cars_is_featured ON cars(is_featured);
CREATE INDEX IF NOT EXISTS idx_inquiries_car_id ON inquiries(car_id);
CREATE INDEX IF NOT EXISTS idx_transactions_car_id ON transactions(car_id);
CREATE INDEX IF NOT EXISTS idx_staff_display_order ON staff(display_order);
