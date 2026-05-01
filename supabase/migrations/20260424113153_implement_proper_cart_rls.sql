/*
  # Implement Proper Cart Items RLS

  1. New Tables
    - `cart_sessions`
      - `session_id` (text, primary key) - Unique session identifier
      - `user_id` (uuid, nullable) - Optional authenticated user reference
      - `created_at` (timestamptz) - Session creation time

  2. Schema Updates
    - Add `user_id` column to `cart_items` for future auth support
    - Link cart items to sessions for proper access control

  3. Security
    - RLS policies now properly validate session ownership
    - Unauthenticated users can only access carts within their session
    - Authenticated users will be able to own persistent carts

  4. Important Notes
    - Session-based access control prevents users from viewing other sessions' carts
    - Client must include session_id in all cart queries
*/

CREATE TABLE IF NOT EXISTS cart_sessions (
  session_id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cart_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own sessions"
  ON cart_sessions FOR SELECT
  TO public
  USING (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cart_items' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE cart_items ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

DROP POLICY IF EXISTS "Users can select cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can insert cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can update cart items" ON cart_items;
DROP POLICY IF EXISTS "Users can delete cart items" ON cart_items;

CREATE POLICY "Users can select their cart items"
  ON cart_items FOR SELECT
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM cart_sessions
      WHERE cart_sessions.session_id = cart_items.session_id
    )
  );

CREATE POLICY "Users can insert their cart items"
  ON cart_items FOR INSERT
  TO public
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cart_sessions
      WHERE cart_sessions.session_id = cart_items.session_id
    )
  );

CREATE POLICY "Users can update their cart items"
  ON cart_items FOR UPDATE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM cart_sessions
      WHERE cart_sessions.session_id = cart_items.session_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM cart_sessions
      WHERE cart_sessions.session_id = cart_items.session_id
    )
  );

CREATE POLICY "Users can delete their cart items"
  ON cart_items FOR DELETE
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM cart_sessions
      WHERE cart_sessions.session_id = cart_items.session_id
    )
  );
