import { useState } from "react";
import MenuHeader from "@/components/MenuHeader";
import CategoryNav from "@/components/CategoryNav";
import MenuItemCard from "@/components/MenuItemCard";
import CartDrawer from "@/components/CartDrawer";
import { menuItems, categories } from "@/data/menu";
import { useCart } from "@/hooks/useCart";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const { cart, addItem, removeItem, getQuantity, totalItems, clearCart } = useCart();

  const filteredItems = menuItems.filter((item) => item.category === activeCategory);
  const activeCategoryName = categories.find((c) => c.id === activeCategory)?.name || "";

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <MenuHeader />
      <CategoryNav activeCategory={activeCategory} onSelect={setActiveCategory} />

      <main className="px-4 pt-4 pb-28">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-primary inline-block" />
          {activeCategoryName}
        </h2>

        {activeCategory === "promo" && filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <span className="text-4xl block mb-3">🔥</span>
            <p className="text-sm">Акции скоро появятся!</p>
          </div>
        ) : (
          <div className="space-y-3" key={activeCategory}>
            {filteredItems.map((item, i) => (
              <MenuItemCard
                key={item.id}
                item={item}
                quantity={getQuantity(item.id)}
                onAdd={() => addItem(item.id)}
                onRemove={() => removeItem(item.id)}
                index={i}
              />
            ))}
          </div>
        )}
      </main>

      <CartDrawer
        cart={cart}
        totalItems={totalItems}
        onAdd={addItem}
        onRemove={removeItem}
        onClear={clearCart}
      />
    </div>
  );
};

export default Index;
