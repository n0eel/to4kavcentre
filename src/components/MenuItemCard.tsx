import { MenuItem } from "@/data/menu";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface MenuItemCardProps {
  item: MenuItem;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  index: number;
}

const MenuItemCard = ({ item, quantity, onAdd, onRemove, index }: MenuItemCardProps) => {
  const [popping, setPopping] = useState(false);

  const handleAdd = () => {
    onAdd();
    setPopping(true);
    setTimeout(() => setPopping(false), 300);
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString("ru-RU");
  };

  return (
    <div
      className="menu-card opacity-0 animate-float-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-center gap-3 p-3">
        {/* Icon / color circle */}
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">
            {item.category === "hot-drinks" ? "☕" :
             item.category === "cold-drinks" ? "🥤" :
             item.category === "breakfast" ? "🍳" :
             item.category === "fastfood" ? "🍔" :
             item.category === "desserts" ? "🍰" : "🔥"}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm font-semibold text-foreground leading-tight truncate">
            {item.name}
          </h3>
          {item.volume && <p className="text-xs text-muted-foreground mt-0.5">{item.volume}</p>}
          {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}
          <p className="text-sm font-semibold text-primary mt-1">
            {item.price > 0 ? (
              <>{formatPrice(item.price)} <span className="text-xs font-normal text-muted-foreground">сум</span></>
            ) : (
              <span className="text-xs font-normal text-muted-foreground">уточняйте</span>
            )}
          </p>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {quantity > 0 ? (
            <>
              <button onClick={onRemove} className="qty-btn qty-btn-minus">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span
                className={`w-6 text-center font-semibold text-sm text-foreground ${
                  popping ? "animate-count-pop" : ""
                }`}
              >
                {quantity}
              </span>
              <button onClick={handleAdd} className="qty-btn qty-btn-plus">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </>
          ) : (
            <button onClick={handleAdd} className="qty-btn qty-btn-plus w-9 h-9">
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
