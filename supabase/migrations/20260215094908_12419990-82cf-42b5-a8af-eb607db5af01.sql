
-- Categories table
CREATE TABLE public.categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  emoji text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can insert categories" ON public.categories FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update categories" ON public.categories FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete categories" ON public.categories FOR DELETE USING (true);

-- Menu items table
CREATE TABLE public.menu_items (
  id text PRIMARY KEY,
  name text NOT NULL,
  volume text,
  price integer,
  variants jsonb,
  image text,
  category text NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read menu_items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert menu_items" ON public.menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update menu_items" ON public.menu_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete menu_items" ON public.menu_items FOR DELETE USING (true);

-- Seed categories
INSERT INTO public.categories (id, name, emoji, sort_order) VALUES
  ('hot-drinks', 'Горячие напитки', '☕', 1),
  ('breakfast', 'Завтраки', '🍳', 2),
  ('fastfood', 'Фаст-фуд', '🍔', 3),
  ('desserts', 'Десерты', '🍰', 4),
  ('promo', 'Акции', '🔥', 5);

-- Seed menu items
INSERT INTO public.menu_items (id, name, variants, category) VALUES
  ('tea', 'Чай', '[{"volume":"75мл","price":3000},{"volume":"100мл","price":5000}]', 'hot-drinks'),
  ('chai-karak', 'Чай Карак', '[{"volume":"75мл","price":6000},{"volume":"100мл","price":12000}]', 'hot-drinks'),
  ('chai-masala', 'Чай Масала', '[{"volume":"75мл","price":6000},{"volume":"100мл","price":12000}]', 'hot-drinks'),
  ('chai-cardamon', 'Чай Кардамон', '[{"volume":"75мл","price":6000},{"volume":"100мл","price":12000}]', 'hot-drinks'),
  ('chai-safrom', 'Чай Сафром', '[{"volume":"75мл","price":6000},{"volume":"100мл","price":12000}]', 'hot-drinks');

INSERT INTO public.menu_items (id, name, price, category) VALUES
  ('tea-lemon', 'Чай с лимоном', 10000, 'hot-drinks'),
  ('tea-raspberry', 'Чай с малиной', 15000, 'hot-drinks');

INSERT INTO public.menu_items (id, name, volume, price, category) VALUES
  ('coffee-3in1', 'Кофе 3в1', '0.4л', 6000, 'hot-drinks');

INSERT INTO public.menu_items (id, name, price, category) VALUES
  ('coffee-chocolate', 'Кофе с шоколадом', 6000, 'hot-drinks');

INSERT INTO public.menu_items (id, name, price, category) VALUES
  ('scramble', 'Скрембл', 20000, 'breakfast'),
  ('shakshuka', 'Шакшука', 28000, 'breakfast'),
  ('omelet', 'Омлет', 20000, 'breakfast'),
  ('english-breakfast', 'Английский завтрак', 34000, 'breakfast'),
  ('french-breakfast', 'Французский завтрак', 34000, 'breakfast'),
  ('soviet-breakfast', 'Советский завтрак', 15000, 'breakfast'),
  ('pp-breakfast', 'ПП-Завтрак', 15000, 'breakfast');

INSERT INTO public.menu_items (id, name, price, category, description) VALUES
  ('pancakes', 'Блины', 6000, 'breakfast', 'с творогом / нутеллой / вареньем');

INSERT INTO public.menu_items (id, name, price, category) VALUES
  ('potato-pies', 'Пирожки с картошкой', 5000, 'breakfast'),
  ('meat-pies', 'Пирожки с мясом', 8000, 'breakfast');

INSERT INTO public.menu_items (id, name, price, category, description) VALUES
  ('croissants', 'Круассаны', 35000, 'breakfast', 'с ветчиной / индейкой'),
  ('sausages-in-dough', 'Сосиски в тесте', 10000, 'breakfast', 'с ветчиной / индейкой');

INSERT INTO public.menu_items (id, name, price, category) VALUES
  ('hamburger', 'Гамбургер', 35000, 'fastfood'),
  ('tochka-burger', 'Точка Бургер', 38000, 'fastfood'),
  ('strips', 'Стрипсы', 23000, 'fastfood'),
  ('hotdog', 'Хот-дог', 18000, 'fastfood'),
  ('pita', 'Лаваш', 26000, 'fastfood');

INSERT INTO public.menu_items (id, name, variants, category) VALUES
  ('buns', 'Булочки', '[{"price":4000},{"price":8000}]', 'desserts');

INSERT INTO public.menu_items (id, name, price, category) VALUES
  ('zebra', 'Зерба', 6000, 'desserts');

INSERT INTO public.menu_items (id, name, price, category) VALUES
  ('bun+coffee/tea', 'Зебра + кофе чай', 10000, 'promo'),
  ('zebra+coffee/tea', 'Булочка + кофе чай', 10000, 'promo');
