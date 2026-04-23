-- ORDERS
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  product_name text NOT NULL,
  product_price integer NOT NULL,
  product_slug text,
  offer_label text,
  first_name text,
  last_name text,
  whatsapp text,
  country text,
  city text,
  neighborhood text,
  car_transport text,
  is_available boolean DEFAULT true,
  status text DEFAULT 'pending',
  ai_score integer DEFAULT 80,
  ai_flags text[],
  livreur_idx integer,
  source text,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read orders" ON public.orders
  FOR SELECT USING (true);
CREATE POLICY "Anyone can update orders" ON public.orders
  FOR UPDATE USING (true);

-- VISITS
CREATE TABLE public.visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text,
  referrer text,
  country text,
  city text,
  device text,
  page text,
  visited_at timestamptz DEFAULT now()
);

CREATE INDEX idx_visits_visited_at ON public.visits(visited_at DESC);
CREATE INDEX idx_visits_source ON public.visits(source);

ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create visits" ON public.visits
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read visits" ON public.visits
  FOR SELECT USING (true);

-- DELIVERIES
CREATE TABLE public.deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE,
  livreur_idx integer NOT NULL,
  status text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.deliveries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage deliveries" ON public.deliveries
  FOR ALL USING (true) WITH CHECK (true);

-- STOCK TRANSACTIONS
CREATE TABLE public.stock_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  livreur_idx integer,
  type text NOT NULL,
  quantite integer NOT NULL,
  motif text,
  produit text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.stock_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage stock" ON public.stock_transactions
  FOR ALL USING (true) WITH CHECK (true);