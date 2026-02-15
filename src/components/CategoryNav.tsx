import { useRef, useEffect } from "react";
import { Category } from "@/data/menu";

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onSelect: (id: string) => void;
}

const CategoryNav = ({ categories, activeCategory, onSelect }: CategoryNavProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeEl = scrollRef.current?.querySelector(`[data-cat="${activeCategory}"]`);
    activeEl?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeCategory]);

  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div ref={scrollRef} className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat.id}
            data-cat={cat.id}
            onClick={() => onSelect(cat.id)}
            className={`category-chip whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === cat.id
                ? "category-chip-active"
                : "category-chip-inactive"
            }`}
          >
            <span>{cat.emoji}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
