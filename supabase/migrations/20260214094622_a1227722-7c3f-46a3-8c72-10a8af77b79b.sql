
-- Add order_number and payment_method columns
ALTER TABLE public.orders 
  ADD COLUMN order_number integer,
  ADD COLUMN payment_method text NOT NULL DEFAULT 'cash';

-- Function to get next auto order number for today (Tashkent timezone)
CREATE OR REPLACE FUNCTION public.next_order_number()
RETURNS integer
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  today_start timestamptz;
  today_end timestamptz;
  max_num integer;
BEGIN
  today_start := (now() AT TIME ZONE 'Asia/Tashkent')::date::timestamptz AT TIME ZONE 'Asia/Tashkent';
  today_end := today_start + interval '1 day';
  
  SELECT COALESCE(MAX(order_number), 0) INTO max_num
  FROM public.orders
  WHERE created_at >= today_start AND created_at < today_end
    AND order_number IS NOT NULL;
  
  RETURN max_num + 1;
END;
$$;
