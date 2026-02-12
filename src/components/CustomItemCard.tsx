import { useState } from "react";
import { Plus } from "lucide-react";

interface CustomItemCardProps {
  onAddCustom: (name: string, price: number) => void;
}

const CustomItemCard = ({ onAddCustom }: CustomItemCardProps) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [popping, setPopping] = useState(false);

  const handleAdd = () => {
    const p = parseInt(price, 10);
    if (!name.trim() || !p || p <= 0) return;
    onAddCustom(name.trim(), p);
    setName("");
    setPrice("");
    setPopping(true);
    setTimeout(() => setPopping(false), 300);
  };

  const isValid = name.trim().length > 0 && parseInt(price, 10) > 0;

  return (
    <div className="menu-card">
      <div className="flex items-center gap-3 p-3">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">✏️</span>
        </div>

        <div className="flex-1 min-w-0 space-y-1.5">
          <input
            type="text"
            placeholder="Название"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            className="w-full bg-muted/30 border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
          <input
            type="number"
            placeholder="Цена (сум)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={0}
            className="w-full bg-muted/30 border border-border rounded-lg px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <button
          onClick={handleAdd}
          disabled={!isValid}
          className={`qty-btn qty-btn-plus w-9 h-9 ${!isValid ? "opacity-30" : ""} ${popping ? "animate-count-pop" : ""}`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CustomItemCard;
