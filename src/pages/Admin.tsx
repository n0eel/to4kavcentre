import { useState } from "react";
import { useMenu } from "@/hooks/useMenu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, ArrowLeft, X } from "lucide-react";
import { Link } from "react-router-dom";

interface Variant {
  volume: string;
  price: string;
}

const Admin = () => {
  const { categories, menuItems, loading, refetch } = useMenu();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [volume, setVolume] = useState("");
  const [adding, setAdding] = useState(false);
  const [useVariants, setUseVariants] = useState(false);
  const [variants, setVariants] = useState<Variant[]>([{ volume: "", price: "" }]);

  const addVariantRow = () => setVariants([...variants, { volume: "", price: "" }]);
  const removeVariantRow = (i: number) => setVariants(variants.filter((_, idx) => idx !== i));
  const updateVariant = (i: number, field: keyof Variant, value: string) => {
    const updated = [...variants];
    updated[i] = { ...updated[i], [field]: value };
    setVariants(updated);
  };

  const handleAdd = async () => {
    if (!name.trim() || !category) {
      toast.error("Укажите название и категорию");
      return;
    }

    if (useVariants) {
      const validVariants = variants.filter(v => parseInt(v.price, 10) > 0);
      if (validVariants.length === 0) {
        toast.error("Добавьте хотя бы один вариант с ценой");
        return;
      }
    }

    setAdding(true);
    const id = name.trim().toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();

    const insertData: any = {
      id,
      name: name.trim(),
      category,
      description: description.trim() || null,
    };

    if (useVariants) {
      const validVariants = variants
        .filter(v => parseInt(v.price, 10) > 0)
        .map(v => ({
          price: parseInt(v.price, 10),
          ...(v.volume.trim() ? { volume: v.volume.trim() } : {}),
        }));
      insertData.variants = validVariants;
    } else {
      insertData.price = parseInt(price, 10) || null;
      insertData.volume = volume.trim() || null;
    }

    const { error } = await supabase.from("menu_items").insert(insertData);

    if (error) {
      toast.error("Ошибка добавления: " + error.message);
    } else {
      toast.success("Добавлено: " + name.trim());
      setName("");
      setPrice("");
      setDescription("");
      setVolume("");
      setUseVariants(false);
      setVariants([{ volume: "", price: "" }]);
      refetch();
    }
    setAdding(false);
  };

  const handleDelete = async (itemId: string, itemName: string) => {
    if (!confirm(`Удалить "${itemName}"?`)) return;
    const { error } = await supabase.from("menu_items").delete().eq("id", itemId);
    if (error) {
      toast.error("Ошибка удаления: " + error.message);
    } else {
      toast.success("Удалено: " + itemName);
      refetch();
    }
  };

  const formatPrice = (p: number) => p.toLocaleString("ru-RU");

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/" className="p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="font-display text-xl font-bold text-foreground">Управление меню</h1>
      </div>

      {/* Add item form */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-6 space-y-3">
        <h2 className="font-display text-sm font-semibold text-foreground flex items-center gap-2">
          <Plus className="w-4 h-4 text-primary" />
          Добавить блюдо
        </h2>

        <input
          type="text"
          placeholder="Название *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />

        {/* Variants toggle */}
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={useVariants}
            onChange={(e) => setUseVariants(e.target.checked)}
            className="rounded border-border"
          />
          Несколько вариантов (объём/цена)
        </label>

        {useVariants ? (
          <div className="space-y-2">
            {variants.map((v, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Объём"
                  value={v.volume}
                  onChange={(e) => updateVariant(i, "volume", e.target.value)}
                  className="w-24 bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
                <input
                  type="number"
                  placeholder="Цена (сум) *"
                  value={v.price}
                  onChange={(e) => updateVariant(i, "price", e.target.value)}
                  className="flex-1 bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
                {variants.length > 1 && (
                  <button onClick={() => removeVariantRow(i)} className="p-1.5 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addVariantRow}
              className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Ещё вариант
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Цена (сум)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
            <input
              type="text"
              placeholder="Объём"
              value={volume}
              onChange={(e) => setVolume(e.target.value)}
              className="w-24 bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
        )}

        <input
          type="text"
          placeholder="Описание (необязательно)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
        >
          <option value="">Выберите категорию *</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.name}
            </option>
          ))}
        </select>

        <button
          onClick={handleAdd}
          disabled={adding || !name.trim() || !category}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {adding ? "Добавление..." : "Добавить"}
        </button>
      </div>

      {/* Items list by category */}
      {categories.map((cat) => {
        const items = menuItems.filter((m) => m.category === cat.id);
        if (items.length === 0) return null;
        return (
          <div key={cat.id} className="mb-5">
            <h3 className="font-display text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
              <span>{cat.emoji}</span> {cat.name}
              <span className="text-xs text-muted-foreground font-normal">({items.length})</span>
            </h3>
            <div className="space-y-1.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-card/60 border border-border/50 rounded-xl px-3 py-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.price ? `${formatPrice(item.price)} сум` : ""}
                      {item.variants ? `варианты: ${(item.variants as any[]).length}` : ""}
                      {item.volume ? ` · ${item.volume}` : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    className="p-2 rounded-lg text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Admin;
