/*
  # Create Shoes App Database Schema

  1. New Tables
    - `shoes`
      - `id` (uuid, primary key) - Unique identifier for each shoe
      - `name` (text) - Name of the shoe
      - `type` (text) - Type of shoe (ballerinas, heels, flats, etc.)
      - `price` (numeric) - Price of the shoe
      - `image_url` (text) - URL to shoe image
      - `description` (text) - Description of the shoe
      - `available_sizes` (text[]) - Array of available sizes
      - `suitable_skin_tones` (text[]) - Array of suitable skin tones (fair, light, medium, tan, deep)
      - `stock` (integer) - Number of items in stock
      - `created_at` (timestamptz) - Timestamp of creation

    - `cart_items`
      - `id` (uuid, primary key) - Unique identifier for cart item
      - `session_id` (text) - Session identifier for guest users
      - `shoe_id` (uuid, foreign key) - Reference to shoes table
      - `size` (text) - Selected size
      - `quantity` (integer) - Quantity of items
      - `created_at` (timestamptz) - Timestamp of creation

  2. Security
    - Enable RLS on both tables
    - Allow public read access to shoes
    - Allow public access to cart_items for guest shopping
*/

CREATE TABLE IF NOT EXISTS shoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  price numeric NOT NULL,
  image_url text NOT NULL,
  description text DEFAULT '',
  available_sizes text[] NOT NULL DEFAULT '{}',
  suitable_skin_tones text[] NOT NULL DEFAULT '{}',
  stock integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  shoe_id uuid NOT NULL REFERENCES shoes(id) ON DELETE CASCADE,
  size text NOT NULL,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE shoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view shoes"
  ON shoes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can view cart items"
  ON cart_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert cart items"
  ON cart_items FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update cart items"
  ON cart_items FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete cart items"
  ON cart_items FOR DELETE
  TO public
  USING (true);
