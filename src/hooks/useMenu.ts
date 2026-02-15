import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MenuItem, Category } from "@/data/menu";

export function useMenu() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [catRes, itemRes] = await Promise.all([
      supabase.from("categories").select("*").order("sort_order"),
      supabase.from("menu_items").select("*").order("created_at"),
    ]);

    if (catRes.data) {
      setCategories(catRes.data.map((c: any) => ({ id: c.id, name: c.name, emoji: c.emoji })));
    }
    if (itemRes.data) {
      setMenuItems(itemRes.data.map((m: any) => ({
        id: m.id,
        name: m.name,
        volume: m.volume ?? undefined,
        price: m.price ?? undefined,
        variants: m.variants as any ?? undefined,
        image: m.image ?? undefined,
        category: m.category,
        description: m.description ?? undefined,
      })));
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return { categories, menuItems, loading, refetch: fetchData };
}
