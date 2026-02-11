import { MenuItem, makeCartKey } from "@/data/menu";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface MenuItemCardProps {
  item: MenuItem;
  getQuantity: (cartKey: string) => number;
  onAdd: (cartKey: string) => void;
  onRemove: (cartKey: string) => void;
  index: number;
}

const MenuItemCard = ({ item, getQuantity, onAdd, onRemove, index }: MenuItemCardProps) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [popping, setPopping] = useState(false);

  const hasVariants = !!item.variants && item.variants.length > 1;
  const cartKey = hasVariants ? makeCartKey(item.id, selectedVariant) : makeCartKey(item.id);
  const quantity = getQuantity(cartKey);

  const currentPrice = hasVariants ? item.variants![selectedVariant].price : (item.price ?? 0);
  const currentVolume = hasVariants ? item.variants![selectedVariant].volume : (item.volume ?? "");

  const handleAdd = () => {
    onAdd(cartKey);
    setPopping(true);
    setTimeout(() => setPopping(false), 300);
  };

  const formatPrice = (price: number) => price.toLocaleString("ru-RU");

  const emoji = item.category === "hot-drinks" ? "☕" :
    item.category === "cold-drinks" ? "🥤" :
    item.category === "breakfast" ? "🍳" :
    item.category === "fastfood" ? "🍔" :
    item.category === "desserts" ? "🍰" : "🔥";

  return (
    <div
      className="menu-card opacity-0 animate-float-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: "forwards" }}
    >
      <div className="flex items-center gap-3 p-3">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center flex-shrink-0">
          <span className="text-2xl">{emoji}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display text-sm font-semibold text-foreground leading-tight truncate">
            {item.name}
          </h3>
          {item.description && <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>}

          {hasVariants ? (
            <div className="flex gap-1.5 mt-1.5">
              {item.variants!.map((v, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedVariant(i)}
                  className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                    selectedVariant === i
                      ? "bg-primary/20 border-primary text-primary font-semibold"
                      : "bg-muted/30 border-border text-muted-foreground"
                  }`}
                >
                  {v.volume} · {formatPrice(v.price)}
                </button>
              ))}
            </div>
          ) : (
            <>
              {currentVolume && <p className="text-xs text-muted-foreground mt-0.5">{currentVolume}</p>}
              <p className="text-sm font-semibold text-primary mt-1">
                {currentPrice > 0 ? (
                  <>{formatPrice(currentPrice)} <span className="text-xs font-normal text-muted-foreground">сум</span></>
                ) : (
                  <span className="text-xs font-normal text-muted-foreground">уточняйте</span>
                )}
              </p>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {quantity > 0 ? (
            <>
              <button onClick={() => onRemove(cartKey)} className="qty-btn qty-btn-minus">
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className={`w-6 text-center font-semibold text-sm text-foreground ${popping ? "animate-count-pop" : ""}`}>
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
