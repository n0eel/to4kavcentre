import { useState } from "react";
import { useMenu } from "@/hooks/useMenu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  const { categories, menuItems, loading, refetch } = useMenu();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [volume, setVolume] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!name.trim() || !category) {
      toast.error("Укажите название и категорию");
      return;
    }
    setAdding(true);
    const id = name.trim().toLowerCase().replace(/\s+/g, "-") + "-" + Date.now();
    const priceNum = parseInt(price, 10) || null;

    const { error } = await supabase.from("menu_items").insert({
      id,
      name: name.trim(),
      price: priceNum,
      category,
      description: description.trim() || null,
      volume: volume.trim() || null,
    });

    if (error) {
      toast.error("Ошибка добавления: " + error.message);
    } else {
      toast.success("Добавлено: " + name.trim());
      setName("");
      setPrice("");
      setDescription("");
      setVolume("");
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
