/*
  # Fix Cart Items RLS Policies

  1. Security Updates
    - Replace overly permissive RLS policies on `cart_items` table
    - Add session-based access control to ensure users can only access their own cart items
    - Policies now verify session_id matches instead of allowing unrestricted access

  2. Policies Changed
    - SELECT: Users can only view cart items from their session
    - INSERT: Users can only add items to their own session
    - UPDATE: Users can only modify items in their session
    - DELETE: Users can only delete items from their session
*/

DROP POLICY IF EXISTS "Anyone can view cart items" ON cart_items;
DROP POLICY IF EXISTS "Anyone can insert cart items" ON cart_items;
DROP POLICY IF EXISTS "Anyone can update cart items" ON cart_items;
DROP POLICY IF EXISTS "Anyone can delete cart items" ON cart_items;

CREATE POLICY "Users can view their session cart items"
  ON cart_items FOR SELECT
  TO public
  USING (session_id = current_setting('app.session_id', true));

CREATE POLICY "Users can add to their session cart"
  ON cart_items FOR INSERT
  TO public
  WITH CHECK (session_id = current_setting('app.session_id', true));

CREATE POLICY "Users can update their session cart items"
  ON cart_items FOR UPDATE
  TO public
  USING (session_id = current_setting('app.session_id', true))
  WITH CHECK (session_id = current_setting('app.session_id', true));

CREATE POLICY "Users can delete from their session cart"
  ON cart_items FOR DELETE
  TO public
  USING (session_id = current_setting('app.session_id', true));
