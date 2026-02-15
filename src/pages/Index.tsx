import { useState } from "react";
import MenuHeader from "@/components/MenuHeader";
import CategoryNav from "@/components/CategoryNav";
import MenuItemCard from "@/components/MenuItemCard";
import CustomItemCard from "@/components/CustomItemCard";
import CartDrawer from "@/components/CartDrawer";
import { useMenu } from "@/hooks/useMenu";
import { useCart } from "@/hooks/useCart";

const Index = () => {
  const { categories, menuItems, loading } = useMenu();
  const [activeCategory, setActiveCategory] = useState("");
  const { cart, customItems, addItem, removeItem, addCustomItem, getQuantity, totalItems, clearCart } = useCart();

  // Set default category once loaded
  const effectiveCategory = activeCategory || (categories.length > 0 ? categories[0].id : "");

  const filteredItems = menuItems.filter((item) => item.category === effectiveCategory);
  const activeCategoryName = categories.find((c) => c.id === effectiveCategory)?.name || "";

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка меню...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background max-w-lg mx-auto relative">
      <MenuHeader />
      <CategoryNav categories={categories} activeCategory={effectiveCategory} onSelect={setActiveCategory} />

      <main className="px-4 pt-4 pb-28">
        <h2 className="font-display text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <span className="w-1 h-5 rounded-full bg-primary inline-block" />
          {activeCategoryName}
        </h2>

        {effectiveCategory === "promo" && filteredItems.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <span className="text-4xl block mb-3">🔥</span>
            <p className="text-sm">Акции скоро появятся!</p>
          </div>
        ) : (
          <div className="space-y-3" key={effectiveCategory}>
            {filteredItems.map((item, i) => (
              <MenuItemCard
                key={item.id}
                item={item}
                getQuantity={getQuantity}
                onAdd={addItem}
                onRemove={removeItem}
                index={i}
              />
            ))}
            <CustomItemCard onAddCustom={addCustomItem} />
          </div>
        )}
      </main>

      <CartDrawer
        cart={cart}
        customItems={customItems}
        totalItems={totalItems}
        onAdd={addItem}
        onRemove={removeItem}
        onClear={clearCart}
        menuItems={menuItems}
      />
    </div>
  );
};

export default Index;
